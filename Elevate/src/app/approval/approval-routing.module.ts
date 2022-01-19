import { RouterModule, Routes } from '@angular/router';

import { ApprovalChangeComponent } from './approval-change/approval-change.component';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { ApprovalLogsListComponent } from './approval-logs-list/approval-logs-list.component';
import { ApprovalProfileComponent } from './approval-profile/approval-profile.component';
import { NgModule } from '@angular/core';
import { ApprovalAdminFreelancerProfileComponent } from './approval-admin-freelancer-profile/approval-admin-freelancer-profile.component';
import { ApprovalNewFreelancerComponent } from './approval-new-freelancer/approval-new-freelancer.component';

const routes: Routes = [
  {
    path: 'logs',
    component: ApprovalLogsListComponent
  },
  {
    path: 'freelancer-approved/:freelancerId',
    component: ApprovalAdminFreelancerProfileComponent
  },
  {
    path: 'freelancer-approved',
    component: ApprovalNewFreelancerComponent
  },
  {
    path: ':type',
    component: ApprovalListComponent
  },
  {
    path: ':type/:requestId',
    component: ApprovalProfileComponent
  },
  {
    path: ':type/:requestId/change',
    component: ApprovalChangeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
