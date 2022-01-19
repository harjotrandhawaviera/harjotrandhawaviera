import { RouterModule, Routes } from '@angular/router';

import { FreelancerContractComponent } from './freelancer-contract/freelancer-contract.component';
import { FreelancerEmploymentInfoComponent } from './freelancer-employment-info/freelancer-employment-info.component';
import { NgModule } from '@angular/core';
import { OnBoardingSummaryComponent } from './on-boarding-summary/on-boarding-summary.component';
import { OnboardingWelcomeComponent } from './onboarding-welcome/onboarding-welcome.component';
import { ProfileAppearanceComponent } from './profile-appearance/profile-appearance.component';
import { ProfileConfirmationComponent } from './profile-confirmation/profile-confirmation.component';
import { ProfileContractFreelancerComponent } from './profile-contract-freelancer/profile-contract-freelancer.component';
import { ProfileContractTaxCardComponent } from './profile-contract-tax-card/profile-contract-tax-card.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { ProfileLegalComponent } from './profile-legal/profile-legal.component';
import { ProfileMasterComponent } from './profile-master/profile-master.component';
import { ProfileQualificationsComponent } from './profile-qualifications/profile-qualifications.component';

const routes: Routes = [
  {
    path: 'start',
    component: OnboardingWelcomeComponent,
  },
  {
    path: '',
    component: ProfileLayoutComponent,
    children: [
      {
        path: 'master',
        component: ProfileMasterComponent,
      },
      {
        path: 'appearance',
        component: ProfileAppearanceComponent,
      },
      {
        path: 'qualifications',
        component: ProfileQualificationsComponent,
      },
      {
        path: 'legal',
        component: ProfileLegalComponent,
      },
      // {
      //   path: 'contract_freelancer',
      //   component: ProfileContractFreelancerComponent
      // },
      {
        path: 'employment',
        component: FreelancerEmploymentInfoComponent
      },
      // {
      //   path: 'contract',
      //   component: FreelancerContractComponent
      // }
    ]
  },
  {
    path: 'summary',
    component: OnBoardingSummaryComponent
  },
  {
    path: 'confirmation',
    component: ProfileConfirmationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
