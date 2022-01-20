/* eslint-disable @typescript-eslint/member-ordering */

import * as fromUser from './../../root-state/user-state';
import * as userActions from './../../root-state/user-state/user.actions';

import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { FreelancerService } from '../../services/freelancer.service';
import { MenuConfig } from '../../constant/menu.constant';
import { StorageService } from '../../services/storage.service';
import { UserApprovalService } from './../../services/user-approval.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-onboarding-menu',
  templateUrl: './onboarding-menu.component.html',
  styleUrls: ['./onboarding-menu.component.scss'],
})
export class OnboardingMenuComponent implements OnInit {
  approvals: any = {};
  requestOpen = false;
  steps = ['basic_info', 'appearance', 'qualifications', 'employment','legal'];
  enableCertificates = false;
  constructor(
    private storageService: StorageService,
    private freelancerService: FreelancerService,
    private userApprovalService: UserApprovalService,
    private userStore: Store<fromUser.State>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.enableCertificates = this.checkPermission('app.certificates');
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => {
        this.loadStatus();
      })
    ).subscribe();

    this.loadStatus();
  }

  private loadStatus() {
    this.userStore.pipe(select(fromUser.getUserRoleId)).subscribe((res) => {
      if (res) {
        forkJoin([
          this.userApprovalService.getFreelancerApprovals(res),
          this.freelancerService.getFreelancerAllData(res),
        ]).subscribe((response) => {
          if (response) {
            const approvals = response[0] && response[0].data
              ? (response[0].data as any)
              : undefined;
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
          }
        });
      }
    });
  }

  logOut() {
    this.storageService.clearAll();
    this.userStore.dispatch(userActions.UserLogoutSuccess());
    this.router.navigate(['/login']);
  }
  checkPermission(stateName: string) {
    const certificatesConfig = MenuConfig.find(a => a.name === stateName);
    return !!(certificatesConfig && certificatesConfig.permission && certificatesConfig.permission.includes('ONBOARDING'));
  }
}
