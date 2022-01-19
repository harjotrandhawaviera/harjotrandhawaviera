import * as fromJob from './index';
import * as fromJobAction from './job.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultipleResponse, SingleResponse } from './../../model/response';
import { Observable, forkJoin, of } from 'rxjs';
import {
  catchError,
  map, mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { BudgetMappingService } from '../../services/mapping-services/budget-mapping.service';
import { BudgetResponse } from '../../model/budget.response';
import { BudgetService } from '../../services/budget.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobMappingService } from '../../services/mapping-services/job-mapping.service';
import { JobResponse } from '../../model/job.response';
import { JobSearchVM } from '../../model/job.model';
import { JobService } from '../../services/job.service';
import { ProjectMappingService } from '../../services/mapping-services';
import { ProjectResponse } from '../../model/project.response';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { TenderMappingService } from '../../services/mapping-services/tender-mapping.service';
import { TenderResponse } from '../../model/tender.response';
import { TenderService } from '../../services/tender.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import {JobSubmittedOffer} from "./job.actions";

@Injectable()
export class JobEffect {
  constructor(
    private jobService: JobService,
    private budgetService: BudgetService,
    private projectService: ProjectService,
    private tenderService: TenderService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private store: Store<fromJob.State>,
    private actions$: Actions,
    private jobMappingService: JobMappingService,
    private budgetMappingService: BudgetMappingService,
    private projectMappingService: ProjectMappingService,
    private tenderMappingService: TenderMappingService
  ) {}

  @Effect()
  loadJobList$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadJobList),
    map((action: fromJobAction.LoadJobList) => action.payload),
    switchMap((payload) =>
      this.jobService
        .getJobs(this.jobMappingService.searchRequest(payload.search, payload.view))
        .pipe(
          map((jobRes: MultipleResponse<JobResponse>) => {
            return new fromJobAction.LoadJobListSuccess(
              this.jobMappingService.jobSearchResponseToVM(jobRes)
            );
          }),
          catchError((err) => of(new fromJobAction.LoadJobListFailed(err)))
        )
    )
  );

  @Effect()
  deleteJob$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.DeleteJob),
    withLatestFrom(
      this.store.select(fromJob.getSearchModel),
      (action: fromJobAction.DeleteJob, model: JobSearchVM) => {
        return {
          id: action.payload,
          searchModel: model,
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([
        this.jobService.deleteJob(payload.id).pipe(
          map((res) => res)
        ),
        of(payload.searchModel),
      ])
    ),
    switchMap((payload: any) => {
      if (payload[0] && payload[0].status === 204) {
        this.toastrService.success(
          this.translateService.instant('notification.delete.jobs.success')
        );
        return of(new fromJobAction.LoadJobList({search: payload[1]}));
      } else {
        return of(new fromJobAction.LoadJobList({search: payload[1]}));
      }
    })
  );

  @Effect()
  loadJobDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadJobDetail),
    map((action: fromJobAction.LoadJobDetail) => action.payload),
    switchMap((payload) =>
      this.jobService
        .getJobById(this.jobMappingService.getByIdRequest(payload.id, payload.mode))
        .pipe(
          map((res: SingleResponse<JobResponse>) => {
            if (res?.data) {
              return new fromJobAction.LoadJobDetailSuccess(
                this.jobMappingService.jobResponseToVM(res.data)
              );
            } else {
              return new fromJobAction.LoadJobDetailFailed(res);
            }
          }),
          catchError((err) => of(new fromJobAction.LoadJobDetailFailed(err)))
        )
    )
  );

  @Effect()
  loadBudgetDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadBudgetDetail),
    map((action: fromJobAction.LoadBudgetDetail) => action.payload),
    switchMap((payload) =>
      this.budgetService
        .getBudgets(this.budgetMappingService.getBudgetRequest(payload))
        .pipe(
          map((res: BudgetResponse) => {
            if (res?.data) {
              return new fromJobAction.LoadBudgetDetailSuccess(
                this.budgetMappingService.budgetResponseToVM(res)
              );
            } else {
              return new fromJobAction.LoadBudgetDetailFailed(res);
            }
          }),
          catchError((err) => of(new fromJobAction.LoadBudgetDetailFailed(err)))
        )
    )
  );

  @Effect()
  loadProjectDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadProjectDetail),
    map((action: fromJobAction.LoadProjectDetail) => action.payload),
    switchMap((payload) =>
      this.projectService
        .getProjectById(this.projectMappingService.getByIdRequest(payload.id))
        .pipe(
          map((ProjectRes: SingleResponse<ProjectResponse>) => {
            if (ProjectRes?.data) {
              return new fromJobAction.LoadProjectDetailSuccess({
                project: this.projectMappingService.projectResponseToVM(
                  ProjectRes.data
                ),
                mode: payload.mode,
              });
            } else {
              return new fromJobAction.LoadProjectDetailFailed(ProjectRes);
            }
          }),
          catchError((err) =>
            of(new fromJobAction.LoadProjectDetailFailed(err))
          )
        )
    )
  );

  @Effect()
  createJob$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.CreateJob),
    map((action: fromJobAction.CreateJob) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.jobService.createBulkJob({
          job: this.jobMappingService.jobVMToResponse(
            payload.job,
            payload.documents
          ),
          projectId: payload.projectId,
        }),
      ])
    ),
    switchMap((payload) => {
      if (
        payload[1].status === 204 ||
        (payload[1].body && payload[1].body.data && payload[1].body.data.id)
      ) {
        this.toastrService.success(
          this.translateService.instant('notification.post.jobs.success')
        );
        return of(
          new fromJobAction.CreateJobSuccess(
            (payload[1].body && payload[1].body.data && payload[1].body.data.id) ? payload[1].body.data.id : null
          )
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.jobs.error')
        );
        return of(new fromJobAction.CreateJobFailed({}));
      }
    })
  );

  @Effect()
  createClientJob$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.CreateClientJob),
    map((action: fromJobAction.CreateClientJob) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.jobService.createBulkJob({
          job: this.jobMappingService.clientJobVMToResponse(payload.job),
          projectId: payload.projectId,
        }),
      ])
    ),
    switchMap((payload) => {
      if (
        payload[1].status === 204 ||
        (payload[1].body && payload[1].body.data && payload[1].body.data.id)
      ) {
        this.toastrService.success(
          this.translateService.instant('notification.post.jobs.success')
        );
        return of(
          new fromJobAction.CreateJobSuccess(
            (payload[1].body && payload[1].body.data && payload[1].body.data.id) ? payload[1].body.data.id : null
          )
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.jobs.error')
        );
        return of(new fromJobAction.CreateJobFailed({}));
      }
    })
  );

  @Effect({ dispatch: false })
  createJobSuccess$ = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.CreateJobSuccess),
    map((action: fromJobAction.CreateJobSuccess) => action.payload),
    tap((payload) => {
      if(payload) {
        this.router.navigate(['jobs', payload]);
      }
    })
  );

  @Effect()
  updateJob$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.UpdateJob),
    map((action: fromJobAction.UpdateJob) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.jobService.updateJob({
          job: this.jobMappingService.updateJobVMToResponse(payload.job),
        }),
      ])
    ),
    switchMap((payload) => {
      const originalPayload = payload[0];
      const updateJobResponse = payload[1];
      const newDocRequest = originalPayload.newDocuments.map((a) =>
        this.jobService.createJobDocument({
          jobId: Number(originalPayload.job.id),
          document: { ...a, document_id: a.id },
        })
      );
      const updatedDocRequest = originalPayload.updatedDocuments.map((a) =>
        this.jobService.updateJobDocument({
          jobId: Number(originalPayload.job.id),
          document: a,
        })
      );
      const deletedDocRequest = originalPayload.deletedDocuments.map((a) =>
        this.jobService.deleteJobDocument({
          jobId: Number(originalPayload.job.id),
          documentId: a,
        })
      );
      return forkJoin([
        of(originalPayload),
        of(updateJobResponse),
        ...newDocRequest,
        ...updatedDocRequest,
        ...deletedDocRequest,
      ]);
    }),
    switchMap((payload: any) => {
      const updateJobResponse = payload[1];
      if (
        updateJobResponse.body &&
        updateJobResponse.body.data &&
        updateJobResponse.body.data.id
      ) {
        this.toastrService.success(
          this.translateService.instant('notification.post.jobs.success')
        );
        return of(
          new fromJobAction.UpdateJobSuccess({
            id: updateJobResponse.body.data.id,
          })
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.jobs.error')
        );
        return of(new fromJobAction.UpdateJobFailed(updateJobResponse));
      }
    })
  );

  @Effect({ dispatch: false })
  updateJobSuccess$ = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.UpdateJobSuccess),
    map((action: fromJobAction.UpdateJobSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['jobs', payload.id]);
    })
  );

  @Effect()
  loadJobOffer$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadJobOffer),
    map((action: fromJobAction.LoadJobOffer) => action.payload),
    switchMap((payload) =>
      this.tenderService
        .getJobTender(this.tenderMappingService.getJobTenderRequest(payload.id, payload.type))
        .pipe(
          map((res: MultipleResponse<TenderResponse>) => {
            if (res) {
              return new fromJobAction.LoadJobOfferSuccess(
                this.tenderMappingService.tenderSearchResponseToVM(res)
              );
            } else {
              return new fromJobAction.LoadJobOfferFailed(res);
            }
          }),
          catchError((err) => of(new fromJobAction.LoadJobOfferFailed(err)))
        )
    )
  );

  @Effect()
  CreateJobTenders$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.CreateJobTenders),
    map((action: fromJobAction.CreateJobTenders) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.tenderService.createBulkTenderAssignments({
          tender: payload.tender,
          jobId: +payload.jobId,
        }),
      ])
    ),
    switchMap((payload) => {
      if (
        payload[1].status === 204 ||
        (payload[1].body && payload[1].body.data && payload[1].body.data.id)
      ) {
        this.toastrService.success(
          this.translateService.instant('notification.post.tenders.success')
        );
        return of(
          new fromJobAction.CreateJobTendersSuccess(
            payload[0].tender.dates ? payload[0].tender.dates : []
          )
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.tenders.error')
        );
        return of(new fromJobAction.CreateJobTendersFailed({}));
      }
    })
  );

  @Effect()
  loadFreelancerJobOfferDetails$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadFreelancerJobOffer),
    mergeMap((action: any) => this.jobService.getFreelancerJobOffer(action?.payload).pipe(
      (map(FreelancerJobOffer => (new fromJobAction.LoadFreelancerJobOfferSuccess({ data: FreelancerJobOffer })))))
    )
  );

  @Effect()
  loadFreelancerJobOffersDetails$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadFreelancerJobDetail),
    mergeMap((action: any) => this.jobService.getAdvertisementById(action?.payload.id, action?.payload.role_id, action?.payload.is_matched, action?.payload).pipe(
      (map(FreelancerJobOfferDetails => (new fromJobAction.LoadFreelancerJobDetailSuccess({ data: FreelancerJobOfferDetails })))))
    )
  );

  @Effect()
  LoadFreelancerJobDetailQuestion$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadFreelancerJobDetailQuestion),
    mergeMap((action: any) => this.jobService.getFreelancerJobOfferQuestion(action?.payload, action?.jobId).pipe(
      (map(freelancerJobOfferQuestions => (new fromJobAction.LoadFreelancerJobDetailQuestionSuccess({ data: freelancerJobOfferQuestions })))))
    )
  );

  @Effect()
  LoadFreelancerJobDetailSubmittedOffers$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadFreelancerJobDetailSubmitOffers),
    mergeMap((action: any) => this.jobService.getFreelancerJobOfferSubmittedOffers(action?.payload).pipe(
      (map(freelancerJobOfferSubmitted =>
        (new fromJobAction.LoadFreelancerJobDetailSubmitOffersSuccess({ data: freelancerJobOfferSubmitted })))))
    )
  );

  @Effect()
  LoadFreelancerJobDetailRejectedOffers$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadFreelancerJobDetailRejected),
    mergeMap((action: any) => this.jobService.getFreelancerJobOfferRejectedOffers(action?.payload).pipe(
      (map(freelancerJobOfferRejected =>
        (new fromJobAction.LoadFreelancerJobDetailRejectedSuccess({ data: freelancerJobOfferRejected })))))
    )
  );

  @Effect()
  loadTenderList$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadJobAdvertise),
    map((action: fromJobAction.LoadJobAdvertise) => action.payload),
    switchMap((payload) =>
      this.tenderService
        .getTenders(this.tenderMappingService.searchRequest(payload.search))
        .pipe(
          map((res: MultipleResponse<TenderResponse>) => {
            return new fromJobAction.LoadJobAdvertiseSuccess(
              this.tenderMappingService.tenderSearchResponseToVM(res)
            );
          }),
        )
    )
  );

  @Effect()
  userList$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadUserList),
    mergeMap((page) => this.jobService.userList(page).pipe(
      (map(userList => (new fromJobAction.LoadUserListSuccess({data: userList}))))
    ))
  );

  @Effect()
  SendInvite$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.SendInvite),
    mergeMap((action: any ) => this.jobService.createInvite(action?.payload).pipe(
      (map(newFreelancers => (new fromJobAction.SendInviteSuccess({data: newFreelancers})))))
    )
  );

  @Effect()
  loadJobInvite$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadJobInvite),
    mergeMap((action: any) => this.jobService.getJobInvite(action?.payload).pipe(
      (map(InviteJobs => (new fromJobAction.LoadJobInviteSuccess( InviteJobs )))))
    )
  );

  @Effect()
  loadShortlistOffer$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadShortlistOffer),
    mergeMap((action: any) => this.jobService.getShortlistOfferList(action?.payload).pipe(
      (map(InviteJobs => (new fromJobAction.LoadShortlistOfferSuccess( InviteJobs )))))
    )
  );

  @Effect()
  loadShortlistOfferDetails$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadShortlistOfferDetails),
    mergeMap((action: any) => this.jobService.getShortlistOfferDetail(action?.payload?.id).pipe(
      (map(shortlistDetails => (new fromJobAction.LoadShortlistOfferDetailsSuccess( shortlistDetails )))))
    )
  );

  @Effect()
  loadAdminOfferDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadAdminOfferDetail),
    mergeMap((action: any ) => {
        return this.jobService.confirmOffer(action?.payload).pipe
        (map(FreelancerOfferDetail => (new fromJobAction.LoadAdminOfferDetailSuccess({data: FreelancerOfferDetail}))))
      }
    )
  );

  @Effect()
  loadAdminOfferRejectDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadAdminOfferRejectDetail),
    mergeMap((action: any ) => {
        return this.jobService.rejectOffer(action?.payload).pipe
        (map(FreelancerOfferRejectDetail => (new fromJobAction.LoadAdminOfferRejectDetailSuccess({data: FreelancerOfferRejectDetail}))))
      }
    )
  );

  @Effect()
  loadAdminFreelancer$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.LoadAdminFreelancer),
    mergeMap((action: any ) => {
        return this.jobService.adminFreelancerData(action?.payload).pipe
        (map(AdminFreelancer => (new fromJobAction.LoadAdminFreelancerSuccess({data: AdminFreelancer}))))
      }
    )
  );

  @Effect()
  JobSubmittedOffers$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAction.JobActionTypes.JobSubmittedOffer),
    mergeMap((action: any ) => {
        return this.jobService.confirmJobOffer(action?.payload).pipe
        (map(jobSubmittedOffer => (new fromJobAction.JobSubmittedOfferSuccess({data: jobSubmittedOffer}))))
      }
    )
  );

}
