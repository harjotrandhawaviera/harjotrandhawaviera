import { RouterModule, Routes } from '@angular/router';

import { ClientJobCreateComponent } from './client-job-create/client-job-create.component';
import { ClientJobListComponent } from './client-job-list/client-job-list.component';
import { JobDetailAllComponent } from './job-detail-all/job-detail-all.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobOffersComponent } from './job-offers/job-offers.component';
import { JobTendersCreateComponent } from './job-tenders-create/job-tenders-create.component';
import { JobUpdateComponent } from './job-update/job-update.component';
import { NgModule } from '@angular/core';
import { ShortlistofferListComponent } from './shortlistoffer-list/shortlistoffer-list.component';
import { ShortlistofferDetailsComponent } from './shortlistoffer-details/shortlistoffer-details.component';
import { JobInviteComponent } from './job-invite/job-invite.component';
import {JobsInviteDetailComponent} from './jobs-invite-detail/jobs-invite-detail.component';

const routes: Routes = [
  {
    path: '',
    component: JobListComponent,
  },
  {
    path: 'client',
    component: ClientJobListComponent,
  },
  {
    path: 'shortlist',
    component: ShortlistofferListComponent,
  },
  {
    path: 'shortlist/:id',
    component: ShortlistofferDetailsComponent,
  },
  {
    path: 'create',
    component: JobEditComponent,
    data: { mode: 'create' },
  },
  {
    path: 'client/create',
    component: ClientJobCreateComponent,
    data: { mode: 'createClientJob' },
  },
  {
    path: ':id',
    component: JobDetailComponent,
  },
  {
    path: 'freelancer/recommended',
    component: JobDetailComponent,
  },
  {
    path: 'freelancer/all',
    component: JobDetailComponent,
  },
  {
    path: 'freelancer/invite',
    component: JobInviteComponent,
  },
  {
    path: 'freelancer/invite/:id/role/:role_id',
    component: JobsInviteDetailComponent,
  },
  {
    path: 'client/:id',
    component: JobDetailComponent,
    data: { mode: 'clientJob' },
  },
  {
    path: 'edit/:id',
    component: JobUpdateComponent,
    data: { mode: 'edit' },
  },
  {
    path: ':id/offers',
    component: JobOffersComponent,
  },
  {
    path: ':id/tenders/create',
    component: JobTendersCreateComponent,
  },
  {
    path: 'client/:id/tenders/create',
    component: JobTendersCreateComponent,
    data: { mode: 'clientJobTender' },
  },
  {
    path: 'freelancers/:id',
    component: JobDetailsComponent,
  },
  {
    path: 'adv/:id/role/:role_id',
    component: JobDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsRoutingModule {}
