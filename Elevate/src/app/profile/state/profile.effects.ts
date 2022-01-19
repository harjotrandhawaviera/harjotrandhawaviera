import * as fromProfile from './index';
import * as fromProfileAction from './profile.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, forkJoin, of } from 'rxjs';
import {catchError, exhaustMap, map, mergeMap, switchMap, tap} from 'rxjs/operators';

import {FreelancerAssignmentVM} from '../../model/freelancer.model';
import { FreelancerMappingService } from '../../services/mapping-services';
import { FreelancerResponse } from '../../model/freelancer.response';
import { FreelancerService } from '../../services/freelancer.service';
import { HttpResponse } from '@angular/common/http';
import { IdentityDocumentsService } from '../../services/identity-documents.service ';
import { Injectable } from '@angular/core';
import {ProjectService} from '../../services/project.service';
import { QualificationService } from '../../services/qualification.service';
import { ReferenceService } from './../../services/reference.service';
import { Router } from '@angular/router';
import { SingleResponse } from './../../model/response';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from '../../services/training.service';
import { TranslateService } from './../../services/translate.service';
import { UserApprovalService } from '../../services/user-approval.service';
import { UserRequestService } from '../../services/user-request.service';
import { WorkHistoryService } from '../../services/work-history.service';

@Injectable()
export class ProfileEffect {
  constructor(
    private freelancerService: FreelancerService,
    private identityDocumentsService: IdentityDocumentsService,
    private projectService: ProjectService,
    private userApprovalService: UserApprovalService,
    private userRequestService: UserRequestService,
    private qualificationService: QualificationService,
    private trainingService: TrainingService,
    private referenceService: ReferenceService,
    private toastrService: ToastrService,
    private workHistoryService: WorkHistoryService,
    private router: Router,
    private translateService: TranslateService,
    private store: Store<fromProfile.State>,
    private actions$: Actions,
    private freelancerMappingService: FreelancerMappingService
  ) { }

  @Effect()
  loadProfileDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.LoadProfileDetail),
    map((action: fromProfileAction.LoadProfileDetail) => action.payload),
    switchMap((payload) =>
      forkJoin([this.freelancerService.getFreelancerAllData(payload.id),
      this.freelancerService.getFreelancerGtcDocuments({ freelancerId: payload.id, include: 'freelancer_documents' })])
        .pipe(
          map((res: any) => {
            const freelancerRes = res[0] as SingleResponse<FreelancerResponse>;
            const docRes = res[1];
            if (freelancerRes?.data) {
              return new fromProfileAction.LoadProfileDetailSuccess({
                profile: this.freelancerMappingService.freelancerResponseToVM(
                  freelancerRes.data,
                  docRes
                ),
                mode: payload.mode,
              });
            } else {
              return new fromProfileAction.LoadProfileDetailFailed(freelancerRes);
            }
          }),
          catchError((err) =>
            of(new fromProfileAction.LoadProfileDetailFailed(err))
          )
        )
    )
  );

  @Effect()
  updateProfile$: Observable<Action> = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.UpdateMasterData),
    map((action: fromProfileAction.UpdateMasterData) => action.payload),
    exhaustMap((payload) => {
      const reqList: any[] = [of(payload), this.freelancerService
        .updateFreelancer({
          id: payload.id,
          freelancer: this.freelancerMappingService.freelancerVMToMasterResponse(
            payload.profile
          ),
        })];
      if ((payload.onboarding || payload.isAdmin) && payload.state) {
        reqList.push(this.freelancerService.submitApproval({ id: payload.id, type: 'master', state: payload.state, comment: undefined }));
      }
      return forkJoin(reqList);
    }),
    switchMap((payload: any) => {
      const res = payload[1];
      const originalPayload = payload[0];
      if (res.body && res.body.data && res.body.data.id) {
        if (originalPayload.isValid) {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.success')
          );
        } else {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.warning'),
            this.translateService.instant('notification.post.freelancers.success')
          );
        }
        if (originalPayload.onboarding && !originalPayload.isAdmin && originalPayload.isValid) {
          return of(new fromProfileAction.GoToNext({
            id: res.body.data.id,
            part: 'master',
            isOnboarding: originalPayload.onboarding,
            valid: originalPayload.isValid,
            contractTypeEnabled: false
          }));
        } else {
          return of(new fromProfileAction.LoadProfileDetail({
            id: res.body.data.id,
            mode: '',
          }));
        }
      } else {
        this.toastrService.error(
          this.translateService.instant(
            'notification.post.freelancers.error'
          )
        );
        return of(new fromProfileAction.UpdateMasterDataFailed(res));
      }
    })
  );

  @Effect()
  updateProfileAppearance$: Observable<Action> = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.UpdateAppearanceData),
    map((action: fromProfileAction.UpdateAppearanceData) => action.payload),
    exhaustMap((payload) => {
      const requestList: any[] = [
        of(payload),
        this.freelancerService.updateFreelancer({
          id: payload.id,
          freelancer: this.freelancerMappingService.freelancerVMToAppearanceResponse(
            payload.profile
          ),
        }),
      ];
      if (payload.newBodyPictureId && !payload.isAdmin) {
        requestList.push(
          this.userRequestService.submitRequest({
            type: 'freelancer-changerequest',
            action: 'replace-freelancer-bodypicture',
            picture_id: payload.newBodyPictureId,
            freelancer_id: payload.id
          })
        );
      }
      if (payload.newProfilePictureId && !payload.isAdmin) {
        requestList.push(
          this.userRequestService.submitRequest({
            type: 'freelancer-changerequest',
            action: 'replace-freelancer-portraitpicture',
            picture_id: payload.newProfilePictureId,
            freelancer_id: payload.id
          })
        );
      }
      if (payload.picIds.length) {
        requestList.push(
          this.freelancerService.updateFreelancerPictures({
            id: payload.id,
            pictureRequest: {
              pictures: payload.picIds.map((a) => {
                return {
                  id: a,
                };
              }),
            },
          })
        );
      }
      if ((payload.onboarding || payload.isAdmin) && payload.state) {
        requestList.push(this.freelancerService.submitApproval({ id: payload.id, type: 'appearance', state: payload.state, comment: undefined }));
      }
      return forkJoin(requestList);
    }),
    switchMap((payload: any) => {
      const res = payload[1];
      const originalPayload = payload[0];
      if (res.body && res.body.data && res.body.data.id) {
        if (originalPayload.isValid) {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.success')
          );
        } else {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.warning'),
            this.translateService.instant('notification.post.freelancers.success')
          );
        }
        if (originalPayload.onboarding && !originalPayload.isAdmin && originalPayload.isValid) {
          return of(new fromProfileAction.GoToNext({
            id: res.body.data.id,
            part: 'appearance',
            isOnboarding: originalPayload.onboarding,
            valid: originalPayload.isValid,
            contractTypeEnabled: false
          }));
        } else {
          return of(new fromProfileAction.LoadProfileDetail({
            id: res.body.data.id,
            mode: '',
          }));
        }
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.freelancers.error')
        );
        return of(new fromProfileAction.UpdateMasterDataFailed(res));
      }
    })
  );

  @Effect()
  updateProfileQualification$: Observable<Action> = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.UpdateQualificationData),
    map((action: fromProfileAction.UpdateQualificationData) => action.payload),
    exhaustMap((payload) => {
      const requestList: any[] = [
        of(payload),
        this.freelancerService.updateFreelancer({
          id: payload.id,
          freelancer: { languages: payload.languages || null, resume: payload.resume, about_me: payload.about_me},
        }),
      ];
      if (payload.resume){
        this.freelancerService.updateDocument([{
          document_id: payload.resume,
          type: "resume"
      }], payload.id);
      }
      if (payload.qualifications.length) {
        payload.qualifications.forEach((a) => {
          requestList.push(
            this.qualificationService.upsert(
              this.freelancerMappingService.qualificationVMToRe(a)
            )
          );
        });
      }
      if (payload.training.length) {
        payload.training.forEach((a) => {
          requestList.push(
            this.trainingService.upsert(
              this.freelancerMappingService.trainingVMToRe(a)
            )
          );
        });
      }
      if (payload.deletedTrainings.length) {
        payload.deletedTrainings.forEach((a) => {
          requestList.push(
            this.trainingService.delete(a)
          );
        });
      }
      if (payload.deletedQualifications.length) {
        payload.deletedQualifications.forEach((a) => {
          requestList.push(
            this.qualificationService.delete(a)
          );
        });
      }
      if ((payload.onboarding || payload.isAdmin) && payload.state) {
        requestList.push(this.freelancerService.submitApproval({ id: payload.id, type: 'qualifications', state: payload.state, comment: undefined }));
      }
      return forkJoin(requestList);
    }),
    switchMap((payload: any) => {
      const originalPayload = payload[0];
      const res = payload[1];
      if (res.body && res.body.data && res.body.data.id) {
        if (originalPayload.isValid) {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.success')
          );
        } else {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.warning'),
            this.translateService.instant('notification.post.freelancers.success')
          );
        }
        if (originalPayload.onboarding && !originalPayload.isAdmin && originalPayload.isValid) {
          return of(new fromProfileAction.GoToNext({
            id: res.body.data.id,
            part: 'qualifications',
            isOnboarding: originalPayload.onboarding,
            valid: originalPayload.isValid,
            contractTypeEnabled: false
          }));
        } else {
          return of(new fromProfileAction.LoadProfileDetail({
            id: res.body.data.id,
            mode: '',
          }));
        }
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.freelancers.error')
        );
        return of(new fromProfileAction.UpdateQualificationDataFailed(res));
      }
    })
  );


  @Effect()
  updateProfileEmployment$: Observable<Action> = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.UpdateEmploymentData),
    map((action: fromProfileAction.UpdateEmploymentData) => action.payload),
    exhaustMap((payload) => {
      const requestList: any[] = [
        of(payload),
        this.freelancerService.updateFreelancer({
          id: payload.id,
          freelancer: { work_preference: payload.work_preference || null, industry_exposure: payload.industry_exposure || null, skills: payload.skills || null, primary_role: payload.primary_role || null, secondry_role: payload.secondry_role || null},
        }),

      ];
      if (payload.refernces.length) {
        payload.refernces.forEach((a) => {
          requestList.push(
            this.referenceService.upsert(
              this.freelancerMappingService.referenceVMToRe(a)
            )
          );
        });
      }
      if (payload.deletedReferences.length) {
        payload.deletedReferences.forEach((a) => {
          requestList.push(
            this.referenceService.delete(a)
          );
        });
      }
      if (payload.workHistories.length) {
        payload.workHistories.forEach((a) => {
          requestList.push(
            this.workHistoryService.upsert(
             this.freelancerMappingService.workHistoryVMToRe(a)
            )
          );
        });
      }
      if (payload.deleteWorkHistory.length) {
        payload.deleteWorkHistory.forEach((a) => {
          requestList.push(
            this.workHistoryService.delete(a)
          );
        });
      }
      if ((payload.onboarding || payload.isAdmin) && payload.state) {
        requestList.push(this.freelancerService.submitApproval({ id: payload.id, type: 'employment', state: payload.state, comment: undefined }));
      }
      return forkJoin(requestList);
    }),
    switchMap((payload: any) => {
      const originalPayload = payload[0];
      const res = payload[1];
      if(res){
     if (res.body && res.body.data && res.body.data.id) {
        if (originalPayload.isValid) {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.success')
          );
        } else {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.warning'),
            this.translateService.instant('notification.post.freelancers.success')
          );
        }
        if (originalPayload.onboarding && !originalPayload.isAdmin && originalPayload.isValid) {
          return of(new fromProfileAction.GoToNext({
            id: res.body.data.id,
            part: 'employment',
            isOnboarding: originalPayload.onboarding,
            valid: originalPayload.isValid,
            contractTypeEnabled: false
          }));
        } else {
          return of(new fromProfileAction.LoadProfileDetail({
            id: res.body.data.id,
            mode: '',
          }));
        }
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.freelancers.error')
        );
        return of(new fromProfileAction.UpdateQualificationDataFailed(res));
      }
    }
    else{
      return of(new fromProfileAction.UpdateQualificationDataFailed(res));

    }
    })
  );



  @Effect()
  updateProfileLegal$: Observable<Action> = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.UpdateLegalData),
    map((action: fromProfileAction.UpdateLegalData) => action.payload),
    switchMap((payload) => {
      const requestList: any = [of(payload)];
      if (!payload.collectionId && payload.documentIds && payload.documentIds.length) {
        requestList.push(
          this.freelancerService.uploadCollectionDocument(payload.documentIds)
        );
      } else {
        requestList.push(of(null))
      }
      const taxIdDooc = payload.collectionId;
      if (taxIdDooc) {
        requestList.push(this.freelancerService.updateFreelancerDocument({
          id: payload.id, documentRequest: [{ document_id: taxIdDooc, type: 'trade-licence' }]
        }))
      }
      if (payload.identityDocuments.length) {
        payload.identityDocuments.forEach((a) => {
          requestList.push(
            this.identityDocumentsService.upsert(
              this.freelancerMappingService.identityDocumentsVMToRe(a)
            )
          );
        });
      }
      if (payload.deletedLegalDocuments.length) {
        payload.deletedLegalDocuments.forEach((a) => {
          requestList.push(
            this.identityDocumentsService.delete(a)
          );
        });
      }
      if (payload.deletedIdentityDocuments.length) {
        payload.deletedIdentityDocuments.forEach((a) => {
          requestList.push(
            this.identityDocumentsService.deleteIdentityDocument(a)
          );
        });
      }
      if ((payload.onboarding || payload.isAdmin) && payload.state) {
        requestList.push(this.freelancerService.submitApproval({ id: payload.id, type: 'legal', state: payload.state, comment: undefined }));
      }
      return forkJoin(requestList);
    }),
    exhaustMap((result) => {
      const payload = result[0] as any;
      const newDoc = result[1] as any;
      const requestList: any[] = [
        of(payload),
        this.freelancerService.updateFreelancer({
          id: payload.id,
          freelancer: this.freelancerMappingService.freelancerVMToLegalResponse(
            payload.profile
          ),
        }),
      ];
      if (!payload.onboarding && newDoc && newDoc.body && newDoc.body.data && newDoc.body.data.id) {
        requestList.push(this.userRequestService.submitRequest({
          type: 'freelancer-changerequest',
          action: 'replace-freelancer-workpermit',
          document_id: newDoc.body.data.id,
        }));
      }
      let originalDocId = payload.originalCollectionId;
      if ((payload.onboarding || payload.isAdmin) && newDoc && newDoc.body && newDoc.body.data && newDoc.body.data.id) {
        originalDocId = newDoc.body.data.id;
      }
      if (payload.profile.bankDetailsDocument) {
        requestList.push(this.freelancerService.updateFreelancerDocument({
          id: payload.id, documentRequest: [{ document_id: payload.profile.bankDetailsDocument, type: 'upload-bank-photo' }]
        }));
      }
      if (originalDocId) {
        requestList.push(this.freelancerService.updateFreelancerDocument({
          id: payload.id, documentRequest: [{ document_id: originalDocId, type: 'work-permit' }]
        }));
      }
      return forkJoin(requestList);
    }),
    switchMap((payload: any) => {
      const res = payload[1];
      const originalPayload = payload[0];
      if (res.body && res.body.data && res.body.data.id) {
        if (originalPayload.isValid) {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.success')
          );
        } else {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.warning'),
            this.translateService.instant('notification.post.freelancers.success')
          );
        }
        if (originalPayload.onboarding && !originalPayload.isAdmin && originalPayload.isValid) {
          return of(new fromProfileAction.GoToNext({
            id: res.body.data.id,
            part: 'legal',
            isOnboarding: originalPayload.onboarding,
            valid: originalPayload.isValid,
            contractTypeEnabled: true
          }));
        } else {
          return of(new fromProfileAction.LoadProfileDetail({
            id: res.body.data.id,
            mode: '',
          }));
        }
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.freelancers.error')
        );
        return of(new fromProfileAction.UpdateLegalDataFailed(res));
      }
    })
  );

  @Effect()
  updateProfileFreelancerContract$: Observable<Action> = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.UpdateFreelancerContractData),
    map((action: fromProfileAction.UpdateFreelancerContractData) => action.payload),
    switchMap((payload) => {
      const requestList: any = [of(payload)];
      const requestDocList: any = [];
      const multiDocReqIds: any[] = [];
      const requestGTCList: any = [];
      const multiDocGtcReqIds: any[] = [];
      if (payload.documents) {
        for (const key in payload.documents) {
          if (Object.prototype.hasOwnProperty.call(payload.documents, key)) {
            const doc = payload.documents[key];
            if (!doc.id && doc.documents && doc.documents.length) {
              requestDocList.push(
                this.freelancerService.uploadCollectionDocument(doc.documents.map((a: any) => a.id))
              );
              multiDocReqIds.push(key);
            }
          }
        }
      }
      // if (!payload.collectionId && payload.documentIds && payload.documentIds.length > 0) {
      //   requestList.push(
      //     this.freelancerService.uploadCollectionDocument(payload.documentIds)
      //   );
      // } else {
      //   requestList.push(of(null))
      // }
      if (payload.gtcDocs) {
        for (const key in payload.gtcDocs) {
          if (Object.prototype.hasOwnProperty.call(payload.gtcDocs, key)) {
            const gtcDoc = payload.gtcDocs[key];
            if (gtcDoc.freelancer_documents && gtcDoc.freelancer_documents.length && gtcDoc.freelancer_documents[0]) {
              // should only be one....
              gtcDoc.freelancer_documents.forEach((item: any, index: number) => {
                if (item.document && item.document.document_ids && item.document.document_ids.length > 0) {
                  requestGTCList.push(
                    this.freelancerService.uploadCollectionDocument(item.document.document_ids)
                  );
                  multiDocGtcReqIds.push(key + '_' + index);
                }

              });
            }
          }
        }
      }
      return forkJoin([...requestList, of(multiDocReqIds), of(multiDocGtcReqIds), ...requestGTCList, ...requestDocList]);
    }),
    exhaustMap((result: any) => {
      const payload = result[0] as any;
      const multiDocReqIds = result[1] as any;
      const multiDocGtcReqIds = result[2] as any;
      let gtcDocs: any;
      if (payload.gtcDocs) {
        gtcDocs = JSON.parse(JSON.stringify(payload.gtcDocs));
        multiDocGtcReqIds.forEach((type: any, idex: number) => {
          if (result) {
            const docRes = result[idex + 3]?.body;
            if (docRes) {
              const gtcDocId = type.split('_')[0];
              const index = type.split('_')[1];
              gtcDocs[gtcDocId].freelancer_documents[index] = docRes.data ? this.freelancerMappingService.transformDocument(docRes.data, false) : result[idex + 3];
            }
          }
        });
      }
      const requestList: any[] = [
        of(payload),
        this.freelancerService.updateFreelancer({
          id: payload.id,
          freelancer: payload.profile,
        }),
      ];
      if (payload.documents) {
        for (const key in payload.documents) {
          if (Object.prototype.hasOwnProperty.call(payload.documents, key)) {
            const doc = payload.documents[key];
            if (!doc.id && doc.documents && doc.documents.length && multiDocReqIds && multiDocReqIds.findIndex((x: any) => x === key) !== -1) {
              // requestList.push(
              //   this.freelancerService.uploadCollectionDocument(doc.documents.map((a: any) => a.id))
              // );
              const docRes = result[multiDocReqIds.indexOf(key) + 3 + multiDocGtcReqIds.length]?.body;
              if (docRes) {
                requestList.push(this.freelancerService.updateFreelancerDocument({
                  id: payload.id, documentRequest: [{ document_id: docRes.data.id, type: key }]
                }));
              }
            } else if (doc.id) {
              requestList.push(this.freelancerService.updateFreelancerDocument({
                id: payload.id, documentRequest: [{ document_id: doc.id, type: key }]
              }));
            }
          }
        }
      }
      if (payload.part && payload.state) {
        requestList.push(this.freelancerService.submitApproval({ id: payload.id, type: payload.part, state: payload.state, comment: undefined }));
      }

      if (payload.hasChange && payload.change.contract_type_identifier) {
        requestList.push(this.userRequestService.submitRequest({
          type: 'freelancer-changerequest',
          action: payload.isUpdate ? 'approve-freelancer-data-change' : 'approve-freelancer-contract',
          freelancer_id: payload.id,
          contract_type_identifier: payload.change.contract_type_identifier
        }));
      }
      // const collectionId = payload.collectionId || newDoc && newDoc.body && newDoc.body.data && newDoc.body.data.id;
      // if (collectionId) {
      //   requestList.push(this.freelancerService.updateFreelancerDocument({
      //     id: payload.id, documentRequest: [{ document_id: collectionId, type: 'trade-licence' }]
      //   }))
      // }
      if (gtcDocs) {
        const preparedDocuments = [];
        for (const key in gtcDocs) {
          if (Object.prototype.hasOwnProperty.call(gtcDocs, key)) {
            const doc = gtcDocs[key];
            preparedDocuments.push({
              is_checked: doc.is_checked,
              gtc_document_id: key,
              document_id: doc.freelancer_documents && doc.freelancer_documents[0] ? doc.freelancer_documents[0].id : undefined
            });
          }
        }
        if (preparedDocuments && preparedDocuments.length > 0) {
          requestList.push(this.freelancerService.updateFreelancerGtcDocuments({ id: payload.id, documentRequest: preparedDocuments }))
        }
      }
      return forkJoin(requestList);
    }),
    switchMap((payload: any) => {
      const originalPayload = payload[0];
      const res = payload[1];
      if (res.body && res.body.data && res.body.data.id) {
        if (originalPayload.isValid) {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.success')
          );
        } else {
          this.toastrService.success(
            this.translateService.instant('notification.post.freelancers.warning'),
            this.translateService.instant('notification.post.freelancers.success')
          );
        }
        if (originalPayload.onboarding && originalPayload.isValid) {
          return of(new fromProfileAction.GoToNext({
            id: res.body.data.id,
            part: originalPayload.part,
            isOnboarding: originalPayload.onboarding,
            valid: originalPayload.isValid,
            contractTypeEnabled: originalPayload.contractTypeEnabled
          }));
        } else {
          return of(new fromProfileAction.LoadProfileDetail({
            id: res.body.data.id,
            mode: '',
          }));
        }
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.freelancers.error')
        );
        return of(new fromProfileAction.UpdateLegalDataFailed(res));
      }
    })
  );

  @Effect({ dispatch: false })
  goToNext$ = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.GoToNext),
    map((action: fromProfileAction.GoToNext) => action.payload),

    tap((payload) => {
      forkJoin([this.freelancerService.getFreelancerAllData(payload.id),
      this.freelancerService.getFreelancerGtcDocuments({ freelancerId: payload.id, include: 'freelancer_documents' })]).subscribe(res => {
        const freelancerRes = res[0] as SingleResponse<FreelancerResponse>;
        const docRes = res[1];
        if (freelancerRes?.data) {
          this.store.dispatch(new fromProfileAction.LoadProfileDetailSuccess({
            profile: this.freelancerMappingService.freelancerResponseToVM(
              freelancerRes.data,
              docRes
            ),
            mode: '',
          }));
          this.freelancerService.getFreelancerAllData(payload.id).subscribe(res => {
            let parts = ['master', 'appearance', 'qualifications', 'employment', 'legal'];
            let currentIndex = parts.indexOf(payload.part);
            let next = (currentIndex > -1 && currentIndex < parts.length - 1) ? parts[currentIndex + 1] : 'start';
            if (res && res.data && res.data.requests && res.data.requests.data && res.data.requests.data.filter(a => a.type === 'freelancer-onboarding').length > 0) {
              this.router.navigate(['profile/', 'confirmation']);
            } else {
              this.userApprovalService.getFreelancerApprovals(payload.id).subscribe(approvalRes => {
                const approvals = ((approvalRes.data || {}) as any);
                const states: string[] = [];
                for (const key in approvals) {
                  if (Object.prototype.hasOwnProperty.call(approvals, key)) {
                    states.push(approvals[key].state);
                  }
                }
                if (!states.find(a => a === 'open') && !states.find(a => a === 'rejected')) {
                  if (payload.contractTypeEnabled) {
                    this.router.navigate(['profile/', 'summary']);
                  } else {
                    this.router.navigate(['profile/', 'contract_freelancer']);
                  }
                } else {
                  this.router.navigate(['profile/', next]);
                }
              })
            }

          });
        }
      });
    })
  );

  @Effect()
  loadFreelancerAssignment$ = this.actions$.pipe(
    ofType(fromProfileAction.ProfileActionTypes.LoadFreelancerAssignment),
    mergeMap((action: any) => this.freelancerService.getFreelancerAssignment(action?.payload?.id).pipe(
      (map(FreelancerAssignmentVM => (new fromProfileAction.LoadFreelancerAssignmentSuccess({  freelancerAssignment: FreelancerAssignmentVM, mode: '' })))))
    )
  );
}

