import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

import { ApprovalRequestMappingService } from './../../services/mapping-services/apparoval-request-mapping.service';
import { ApprovalRequestService } from './../../services/approval-request.service';
import { ApprovalRequestVM } from '../../model/approval-request.model';
import { FormConfig } from '../../constant/forms.constant';
import { FreelancerMappingService } from './../../services/mapping-services/freelancer-mapping.service';
import { FreelancerService } from '../../services/freelancer.service';
import { MessageService } from '../../services/messages.service';
import { OptionVM } from '../../model/option.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from './../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-approval-change',
  templateUrl: './approval-change.component.html',
  styleUrls: ['./approval-change.component.scss']
})
export class ApprovalChangeComponent implements OnInit {
  requestId: string = '';
  type: string = '';
  request: ApprovalRequestVM | undefined;
  approval_document_actions: any;
  profile: any;
  message: any
  messageRequired = false;
  data: any;
  gtc: any;
  contractType: any;
  missingDataWarning: any;
  nationalityLK: OptionVM[] = [];
  date: Date;
  fullname: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private approvalRequestService: ApprovalRequestService,
    private toastrService: ToastrService,
    private freelancerService: FreelancerService,
    private userService: UserService,
    private messageService: MessageService,
    private freelancerMappingService: FreelancerMappingService,
    private translateService: TranslateService,
    private approvalRequestMappingService: ApprovalRequestMappingService
  ) {
    this.date = new Date();
    this.fullname = this.userService.user().name();
  }
  ngOnInit(): void {
    this.approval_document_actions = FormConfig.legal.type_action_mapping;

    this.route.params.subscribe(res => {
      if (res.type) {
        this.type = res.type;
      }
      if (res.requestId) {
        this.requestId = res.requestId;
        this.loadRequest();
      }
    });
  }
  loadRequest(): void {
    if (this.requestId) {
      this.approvalRequestService.getRequest(this.requestId).subscribe(res => {
        if (res && res.data) {
          this.request = this.approvalRequestMappingService.approvalRequestResponseToVM(res.data);
          this.profile = this.request.profile;
          this.translateService.get('messages.subject.action.' + this.request.action).subscribe(sub => {
            this.message = {
              content: '',
              subject: sub
            };
          });
          if (this.request) {
            if (this.request.params && this.request.params.picture_id) {
              this.data = {
                pending: this.freelancerMappingService.transformPicture({ id: this.request.params.picture_id }, false),
                current: this.request.action === 'replace-freelancer-bodypicture' ?
                  this.freelancerMappingService.transformPicture({ id: this.profile.body_picture_id }, false) :
                  this.freelancerMappingService.transformPicture({ id: this.profile.face_picture_id }, false)
              };
            }

            if (this.request && this.request.action && this.request.params && this.approval_document_actions[this.request.action] && this.request.params.document_id) {
              this.freelancerService.getDocument(this.request.params.document_id).subscribe((docRes) => {
                if (docRes && docRes.data) {
                  const data = this.freelancerMappingService.transformDocument(docRes.data, false)
                  if (this.request && this.request.action && data) {
                    var current = this.profile.documents[this.approval_document_actions[this.request.action]];
                    this.data = {
                      pending: data,
                      current: current && current.id === data.id ? null : current
                    };
                  }
                }
              });
            }
            if (this.request && this.request.params && this.request.params.freelancer_id &&
              (this.request.action === 'approve-freelancer-contract' || this.request.action === 'approve-freelancer-data-change')) {
              this.freelancerService.getFreelancerAllData(this.request.params.freelancer_id).subscribe((response) => {
                if (response.data) {
                  this.data = this.freelancerMappingService.freelancerResponseToVM(
                    response.data,
                    null
                  );
                  this.freelancerService.getCountries().subscribe((res) => {
                    this.nationalityLK = res.data
                      ? res.data.map((item) => {
                        var idx = item.cca2
                          ? FormConfig.master.nationalityOrder.indexOf(item.cca2)
                          : -1;
                        return {
                          value: item.cca2,
                          text: item.nationality || item.name,
                          data: {
                            requiresWorkPermit: !item.is_eu_member,
                            order: (idx > -1 ? idx : 9) + (item.name || ''),
                          },
                        };
                      })
                      : [];
                    let nationality = this.nationalityLK.find(x => x.value === (this.data && this.data.nationality) || '') || {} as any;
                    // check new data fields
                    this.missingDataWarning = {
                      master: !(this.data.birthplace && this.data.birthcountry),
                      legal: !this.data.nationality || (nationality && nationality.data && nationality.data.requiresWorkpermit
                        && !(this.data && this.data.orgDocuments && this.data.orgDocuments.current
                          && this.data.orgDocuments.current['work-permit'] && this.data.orgDocuments.current['work-permit'].id))
                    };
                  });
                }
              });
            }
            if (this.request.action === 'approve-freelancer-gtc' && this.request.params?.freelancer_id) {
              forkJoin([
                this.freelancerService.getFreelancerAllData(this.request.params.freelancer_id),
                this.approvalRequestService.getGtc(this.request.params.gtc_id)
              ]).subscribe(result => {
                if (result[0].data) {
                  this.data = this.freelancerMappingService.freelancerResponseToVM(
                    result[0].data,
                    null
                  );
                  this.data = result[0].data;
                  this.gtc = this.transformGtc(result[1].data);
                  this.contractType = this.gtc.map((a: any) => a.contract_type);
                }
              });
              // var req = {
              //   data: this.freelancerService.getFreelancerAllData(this.request.params.freelancer_id),
              //   gtc: this.approvalRequestService.getGtc(this.request.params.gtc_id)
              // };
              // $q.all(req).then(function (response) {
              //   vm.data = response.data;
              //   vm.gtc = response.gtc;
              //   vm.contractType = collection.extract(vm.gtc, 'contract_type');
              // });
            }
            if (this.request.action === 'replace-freelancer-gtc-document' && this.request.params && this.request.params.current_document_id) {
              var current = this.profile.documents.gtc.find((a: any) => a.id === this.request?.params?.current_document_id);
              var pending = this.profile.documents.gtc.find((a: any) => a.id === this.request?.params?.document_id);
              this.data = {
                pending: pending,
                current: current && current.id === pending.id ? null : current
              };
            }
          }
        }
      });
    }

  }
  transformGtc(item: any) {
    return item && {
      ...item,
      // single document not used anymore
      documents: item.documents && item.documents.data.map((doc: any) => {
        return {
          ...doc, url: doc.url || `${environment.api}/documents/${doc.id}`,
          originalFilename: doc.original_filename || null,
          saved: true
        }
      }),
      // gtc will contain a collection of documents
      // documents: item.documents && item.documents.data.map(documents.transform),
      publishedDate: item.published_at,
      validDate: item.valid_at,
      identifier: item.contract_type.data.identifier
    };
  }

  /**
     * close a change request by accepting or rejecting the request
     * @param {boolean} updateAccepted if true, freelancer data will be updated
     */
  closeRequest(updateAccepted: boolean) {
    if (this.request) {
      let req: { type: string, obj: Observable<any> }[] = [];

      if (!updateAccepted && !(this.message.content && this.message.subject)) {
        this.messageRequired = true;
        return;
      }

      if (updateAccepted) {
        var toUpdate: any = {};

        switch (this.request.action) {
          case 'replace-freelancer-bodypicture':
            if (this.request.params)
              toUpdate.body_picture_id = this.request.params.picture_id; // eslint-disable-line camelcase
            break;
          case 'replace-freelancer-portraitpicture': {
            if (this.request.params)
              toUpdate.face_picture_id = this.request.params.picture_id; // eslint-disable-line camelcase
            break;
          }
          case 'approve-freelancer-contract': {
            // approve contract only if contract is enabled for this user otherwise just close the request
            // should never happen, but if user send request and the disables the selection, before approval it could...
            if (this.data && this.request.params && this.data.contract_types.find((a: any) => this.request && this.request.params && a.identifier === this.request.params.contract_type_identifier)) {
              toUpdate.contract = {
                contract_type_identifier: this.request.params.contract_type_identifier,
                is_approved: true
              };
              toUpdate.gtc = this.request.params.gtc_id;
            }
            break;
          }
          case 'approve-freelancer-data-change': {
            // approve contract only if contract is enabled for this user otherwise just close the request
            // should never happen, but if user send request and the disables the selection, before approval it could...
            if (this.data && this.request.params && this.data.contract_types.find((a: any) => this.request && this.request.params && a.identifier === this.request.params.contract_type_identifier)) {
              toUpdate.contract = {
                contract_type_identifier: this.request.params.contract_type_identifier,
                is_pending: false
              };
            }
            break;
          }
          case 'approve-freelancer-gtc': {
            toUpdate.gtc = this.gtc.id;
            break;
          }
          case 'replace-freelancer-gtc-document': {
            if (this.request.params) {
              toUpdate.gtcDoc = {
                id: this.request.freelancer_id,
                document_id: this.request.params.document_id,
                gtc_document_id: this.request.params.gtc_document_id,
                is_approved: true
              };
            }
            break;
          }
          case 'replace-freelancer-tradelicence':
          case 'replace-freelancer-workpermit':
          case 'replace-freelancer-evidence': {
            var current = this.profile.documents[this.approval_document_actions[this.request.action]];
            if (!current || (current && current.id !== this.data.pending.id)) {
              this.profile.documents[this.approval_document_actions[this.request.action]] = this.data.pending;
              toUpdate.documents = this.prepareDocument(this.approval_document_actions[this.request.action]);
            }
            break;
          }
          default:
            break;
        }
        req = [
          {
            type: 'freelancerData',
            obj: this.request.freelancer_id ? this.freelancerService.updateFreelancer({ id: this.request.freelancer_id, freelancer: toUpdate }) : of(null)
          },
          {
            type: 'freelancerDocuments',
            obj: this.request.freelancer_id && toUpdate.documents ? this.freelancerService.updateFreelancerDocument({ id: this.request.freelancer_id, documentRequest: toUpdate.documents }) : of(null)
          },
          {
            type: 'freelancerContract',
            obj: this.request.freelancer_id && toUpdate.contract ? this.freelancerService.updateFreelancerContract({ id: this.request.freelancer_id, contract_type_identifier: toUpdate.contract.contract_type_identifier, obj: toUpdate.contract }) : of(null)
          },
          {
            type: 'freelancerGtc',
            obj: this.request.freelancer_id && toUpdate.gtc ? this.approvalRequestService.approveGtc({ id: this.data.id, gtc_id: toUpdate.gtc }) : of(null)
          },
          {
            type: 'freelancerGtcDoc',
            obj: this.request.freelancer_id && toUpdate.gtcDoc ? this.freelancerService.updateFreelancerGtcDocument({ id: toUpdate.gtcDoc.id, data: toUpdate.gtcDoc }) : of(null)
          }
        ];
      }
      if (this.message && this.message.content && this.message.subject) {
        req.push({
          type: 'message',
          obj: this.messageService.create(this.request.user.id, this.message)
        });
      }
      if (req.length > 0) {
        forkJoin(req.map(a => a.obj)).subscribe(res => {
          if (this.request) {
            this.approvalRequestService.closeRequest(this.request.id, !updateAccepted).subscribe(() => {
              this.toastrService.success(
                this.translateService.instant(
                  'notification.delete.requests.success'
                )
              );
              this.router.navigate(['/approval', this.type]);
            }, (error) => {
              this.toastrService.success(
                this.translateService.instant(
                  'notification.delete.requests.error'
                )
              );
            });
          }
        });
      }
    }
  }
  /**
     * converts document object to array
     * @param {string} type
     * @return {Array}
     */
  prepareDocument(type: any) {
    var documents = [];
    var doc = this.profile.documents[type];
    if (doc.id) {
      documents.push({
        document_id: doc.id,  // eslint-disable-line camelcase
        type: type
      });
    }
    return documents;
  }
}
