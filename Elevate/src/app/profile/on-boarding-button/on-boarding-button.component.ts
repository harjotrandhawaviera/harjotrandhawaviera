import { Component, Input, OnInit } from '@angular/core';

import { FreelancerService } from './../../services/freelancer.service';
import { Router } from '@angular/router';
import { UserApprovalService } from './../../services/user-approval.service';
import { UserRequestService } from './../../services/user-request.service';
import { UserService } from './../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: '[app-on-boarding-button]',
  templateUrl: './on-boarding-button.component.html',
  styleUrls: ['./on-boarding-button.component.scss']
})
export class OnBoardingButtonComponent implements OnInit {
  requestOpen: boolean = false;
  available = false;
  inreview = false;
  approvals: any;
  @Input()
  alignment = 'end-xs';
  constructor(
    private userService: UserService,
    private userApprovalService: UserApprovalService,
    private userRequestService: UserRequestService,
    private router: Router,
    private freelancerService: FreelancerService) { }

  ngOnInit(): void {
    forkJoin([
      this.userApprovalService.getFreelancerApprovals(this.userService.user().roleId()),
      this.freelancerService.getFreelancerAllData(this.userService.user().roleId()),
    ]).subscribe((response) => {
      if (response) {
        const approvals = response[0] && response[0].data
          ? (response[0].data as any)
          : {};
        if (response[1] && response[1].data && response[1].data.requests && response[1].data.requests.data
          && response[1].data.requests.data.length) {
          this.requestOpen = response[1].data.requests.data.filter(a => a.type === 'freelancer-onboarding').length > 0;
        } else {
          this.requestOpen = false;
        }
        // const states: any = {};
        // if (approvals) {
        //   for (const key in approvals) {
        //     if (Object.prototype.hasOwnProperty.call(approvals, key)) {
        //       const element = approvals[key];
        //       states[element.state] = states[element.state] || 0;
        //       states[element.state]++;
        //     }
        //   }
        // }
        this.approvals = approvals;
        this.onApprovalStateChanged();
      }
    });
  }
  onApprovalStateChanged() {
    if (this.requestOpen) {
      // already an open request, no need to create a new request....
      this.available = false;
      this.inreview = true;
    } else {
      this.available = this.checkApprovalState();
      this.inreview = false;
    }
  }
  checkApprovalState() {
    if (this.userService.user().onboarding()) {
      const states: string[] = [];
      for (const key in this.approvals) {
        if (Object.prototype.hasOwnProperty.call(this.approvals, key)) {
          states.push(this.approvals[key].state);
        }
      }
      // create-profile button is available when no datapart is in state open or rejected and if one or more parts are saved
      return !!(!states.find(a => a === 'open') && !states.find(a => a === 'rejected') && states.find(a => a === 'saved'));
    }
    return false;
  }
  submit() {
    if (this.available) {
      const states: string[] = [];
      const req: any[] = [];
      for (const key in this.approvals) {
        if (Object.prototype.hasOwnProperty.call(this.approvals, key)) {
          if (this.approvals[key].state === 'saved') {
            req.push(this.freelancerService.submitApproval({ id: this.userService.user().roleId(), type: this.approvals[key].type, state: 'submitted', comment: undefined }));
          }
        }
      }
      forkJoin([
        this.userRequestService.submitRequest({
          freelancer_id: this.userService.user().roleId(),
          type: 'freelancer-onboarding',
          action: 'approve-freelancer-onboarding'
        }),
        ...req
      ]).subscribe(res => {
        this.router.navigate(['/profile/confirmation']);
        this.inreview = true;
      });
      // profileService.submitCreateProfile(user.roleId()).then(function () {
      //   $state.go('app.profile.confirmation', {}, { reload: true });
      //   vm.inreview = true;
      // });
    }
  }
}
