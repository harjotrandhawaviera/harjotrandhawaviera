import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ApprovalRequestMappingService } from './../../services/mapping-services/apparoval-request-mapping.service';
import { ApprovalRequestService } from './../../services/approval-request.service';
import { ApprovalRequestVM } from '../../model/approval-request.model';
import { FreelancerMappingService } from './../../services/mapping-services/freelancer-mapping.service';
import { FreelancerResponse } from '../../model/freelancer.response';
import { FreelancerService } from '../../services/freelancer.service';
import { SingleResponse } from '../../model/response';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { forkJoin } from 'rxjs';
import * as fromProfileAction from '../../profile/state/profile.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-approval-profile',
  templateUrl: './approval-profile.component.html',
  styleUrls: ['./approval-profile.component.scss']
})
export class ApprovalProfileComponent implements OnInit {
  requestId: string = '';
  request: ApprovalRequestVM | undefined;
  onboardingSteps = ['master', 'appearance', 'qualifications', 'employment', 'legal'];
  data: any;
  duplicatesWarning = {
    expanded: true,
    columns: [
      { id: 'fullname', class: 'text-left' },
      { id: 'personal', class: 'text-center' },
      { id: 'tax_number', class: 'text-center' },
      { id: 'iban', class: 'text-center' }
    ]
  };
  commentRequired = false;
  comment = '';
  currentTabIndex = 0;
  allStepsChecked = false;
  freelancerApprovals: any = {};
  freelancerId: number | undefined;
  showSummaryStep: boolean = false;
  type: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private approvalRequestService: ApprovalRequestService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private freelancerService: FreelancerService,
    private freelancerMappingService: FreelancerMappingService,
    private store: Store,
    private approvalRequestMappingService: ApprovalRequestMappingService) {

  }

  ngOnInit(): void {
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
  loadRequest() {
    if (this.requestId) {
      this.approvalRequestService.getRequest(this.requestId).subscribe(res => {
        if (res && res.data) {
          this.request = this.approvalRequestMappingService.approvalRequestResponseToVM(res.data);
          this.freelancerApprovals = this.request.profile.approvals;
          this.freelancerId = this.request.freelancer_id;
          this.currentTabIndex = 1;
          if (this.freelancerId) {
            this.store.dispatch(
              new fromProfileAction.LoadProfileDetail({ id: this.freelancerId, mode: '' })
            );
            forkJoin([this.freelancerService.getFreelancerAllData(this.freelancerId, true),
            this.freelancerService.getFreelancerGtcDocuments({ freelancerId: this.freelancerId, include: 'freelancer_documents' })])
              .subscribe(result => {
                const freelancerRes = result[0] as SingleResponse<FreelancerResponse>;
                const docRes = result[1];
                if (freelancerRes.data) {
                  this.data = this.freelancerMappingService.freelancerResponseToVM(
                    freelancerRes.data,
                    docRes
                  );
                  this.translateService.get('common.users.name-unavailable').subscribe(res => {
                    (this.data.duplicates || []).forEach((duplicate: any) => {
                      duplicate.fullname = duplicate.fullname || res;
                    });
                  })

                  this.initTabData(this.currentTabIndex);
                }
              })
          }
        }
      });
    }
  }
  initTabData(tabIndex: number) {
    this.allStepsChecked = !this.openApprovalsExist();
    if (!tabIndex || tabIndex === 0) {
      return;
    }

    var step = this.onboardingSteps[tabIndex - 1];
    this.commentRequired = false;
    this.comment = this.freelancerApprovals[step] && this.freelancerApprovals[step].comment;
  }
  submitStep(isApproved: boolean) {
    if (this.request && this.request.freelancer_id) {
      // send data to BE
      const part = this.onboardingSteps[this.currentTabIndex - 1];
      const state = isApproved ? 'approved' : 'rejected';
      const comment = this.comment;

      if (!isApproved && !comment) {
        this.commentRequired = true;
        return;
      }
      this.freelancerService.submitApproval(
        {
          type: part,
          id: this.request.freelancer_id,
          state: state,
          comment: comment
        }
      ).subscribe(() => {
        // update local approvals
        this.freelancerApprovals[part].state = state;
        this.freelancerApprovals[part].comment = comment;
        this.allStepsChecked = !this.openApprovalsExist();

        if (this.allStepsChecked) {
          // tab 0 = summary
          this.currentTabIndex = this.onboardingSteps.length + 1;
          this.showSummaryStep = true;
          return;
        }

        // go to next step
        if (this.currentTabIndex <= this.onboardingSteps.length) {
          this.currentTabIndex++;
        } else {
          // go to master data
          this.currentTabIndex = 1;
        }
        this.initTabData(this.currentTabIndex + 1);
      });
    }

  }
  selectedTabChange($event: any) {
    if ($event.index + 1 > 0 && $event.index + 1 <= this.onboardingSteps.length) {
      this.currentTabIndex = $event.index + 1;
      this.showSummaryStep = false;
      this.initTabData(this.currentTabIndex);
    }
  }
  openApprovalsExist() {
    var reviewed = 0;
    for (const key in this.freelancerApprovals) {
      if (Object.prototype.hasOwnProperty.call(this.freelancerApprovals, key)) {
        const approval = this.freelancerApprovals[key];
        if (approval.state === 'approved' || approval.state === 'rejected') {
          reviewed++;
        }
      }
    }
    return reviewed < this.onboardingSteps.length;
  }
  closeRequest() {
    if (this.request) {
      let declined = false;
      for (const key in this.freelancerApprovals) {
        if (Object.prototype.hasOwnProperty.call(this.freelancerApprovals, key)) {
          const approval = this.freelancerApprovals[key];
          if (approval.state === 'rejected') {
            declined = true;
          }
        }
      }

      this.approvalRequestService.closeRequest(
        this.request.id,
        declined
      ).subscribe(() => {
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
  }
}
