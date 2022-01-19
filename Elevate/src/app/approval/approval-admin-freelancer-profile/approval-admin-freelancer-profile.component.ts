import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FreelancerMappingService } from '../../services/mapping-services/freelancer-mapping.service';
import { FreelancerResponse } from '../../model/freelancer.response';
import { FreelancerService } from '../../services/freelancer.service';
import { FreelancerVM } from '../../model/freelancer.model';
import { SingleResponse } from '../../model/response';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-approval-admin-freelancer-profile',
  templateUrl: './approval-admin-freelancer-profile.component.html',
  styleUrls: ['./approval-admin-freelancer-profile.component.scss']
})
export class ApprovalAdminFreelancerProfileComponent implements OnInit {
  freelancerId: any;
  data: FreelancerVM | undefined = undefined;
  onboardingRequest: any;
  approvals: any;
  onboardingSteps = ['master', 'appearance', 'qualifications', 'employment', 'legal'];
  currentTabIndex = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private freelancerService: FreelancerService,
    private freelancerMappingService: FreelancerMappingService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      if (res.freelancerId) {
        this.freelancerId = res.freelancerId;
        forkJoin([this.freelancerService.getFreelancerAllData(this.freelancerId, true),
        this.freelancerService.getFreelancerGtcDocuments({ freelancerId: this.freelancerId, include: 'freelancer_documents' })])
          .subscribe(result => {
            const freelancerRes = result[0] as SingleResponse<FreelancerResponse>;
            const docRes = result[1];
            this.currentTabIndex = 1;
            if (freelancerRes.data) {
              this.data = this.freelancerMappingService.freelancerResponseToVM(
                freelancerRes.data,
                docRes
              );
              if (this.data) {
                this.onboardingRequest = this.data.requests && this.data.requests.filter(a => a.type === 'freelancer-onboarding').length > 0 ? this.data.requests.filter((a: any) => a.type === 'freelancer-onboarding')[0] : {};
                this.approvals = (this.data.approvals && this.transformApprovals(this.data.approvals)) || {};
              }
            }
          });
      }
    });
  }
  transformApprovals(approvals: any) {
    let approvalsObj: any = {};
    if (approvals) {
      approvals.forEach((approval: any) => {
        approvalsObj[approval.type] = approval;
      });
    }
    return approvalsObj;
  }
}
