import { RouterModule, Routes } from '@angular/router';

import { FreelancerListComponent } from './freelancer-list/freelancer-list.component';
import { FreelancerOnboardingProfileComponent } from './freelancer-onboarding-profile/freelancer-onboarding-profile.component';
import { NgModule } from '@angular/core';
import { UserDetailComponent } from '../admin-user/user-detail/user-detail.component';
import { FreelancerAdvanceListComponent } from './freelancer-advance-list/freelancer-advance-list.component';

const routes: Routes = [
  {
    path: '',
    component: FreelancerListComponent,
  },
  {
    path: 'advance',
    component: FreelancerAdvanceListComponent,
  },
  {
    path: ':id',
    component: UserDetailComponent,
    data: { backTo: '/administration/freelancers' }
  },
  {
    path: 'profile/:id',
    component: FreelancerOnboardingProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminFreelancerRoutingModule {}
