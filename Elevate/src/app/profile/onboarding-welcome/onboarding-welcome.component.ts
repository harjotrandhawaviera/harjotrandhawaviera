import * as fromUser from './../../root-state/user-state';

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AssetsConfig } from './../../constant/assets.constant';
import { FreelancerService } from '../../services/freelancer.service';
import { FreelancerVM } from './../../model/freelancer.model';
import { UserApprovalService } from '../../services/user-approval.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-onboarding-welcome',
  templateUrl: './onboarding-welcome.component.html',
  styleUrls: ['./onboarding-welcome.component.scss'],
})
export class OnboardingWelcomeComponent implements OnInit {
  isInReview = false;
  isDataEntered = false;
  missingContractTypes = false;
  onboardingVideoUrl: string = '';
  isLoaded = false;
  constructor(
    private userStore: Store<fromUser.State>,
    private userApprovalService: UserApprovalService,
    private freelancerService: FreelancerService
  ) { }

  ngOnInit(): void {
    this.onboardingVideoUrl = AssetsConfig.onboardingVideo.url;
    this.userStore.pipe(select(fromUser.getUserRoleId)).subscribe((res) => {
      if (res) {
        forkJoin([
          this.userApprovalService.getFreelancerApprovals(res),
          this.freelancerService.getFreelancerAllData(res),
          this.freelancerService.getFreelancerContractType(res),
        ]).subscribe((response) => {
          if (response) {
            const approvals =
              response[0] && response[0].data
                ? (response[0].data as any)
                : undefined;
            const requestData: any =
              response[1] && response[1].data ? response[1].data : {};
            const contractTypes =
              response[2] && response[2].data ? response[2].data : [];
            const states: any = {};
            if (approvals) {
              for (const key in approvals) {
                if (Object.prototype.hasOwnProperty.call(approvals, key)) {
                  const element = approvals[key];
                  states[element.state] = states[element.state] || 0;
                  states[element.state]++;
                }
              }
            }
            this.isDataEntered =
              contractTypes.length > 0 &&
              !states.open &&
              !states.rejected &&
              states.saved > 0;
            this.missingContractTypes =
              contractTypes.length === 0 &&
              !states.open &&
              !states.rejected &&
              states.saved > 0;
            if (requestData && requestData.requests && requestData.requests.data
              && requestData.requests.data.length) {
              this.isInReview = requestData.requests.data.filter((a: any) => a.type === 'freelancer-onboarding').length > 0
            }
          }
          this.isLoaded = true;
        });
      }
    });
  }
}
