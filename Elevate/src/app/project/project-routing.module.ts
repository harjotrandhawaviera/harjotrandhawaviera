import { RouterModule, Routes } from '@angular/router';

import { JobEditComponent } from '../jobs/job-edit/job-edit.component';
import { NgModule } from '@angular/core';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent
  },
  {
    path: 'create',
    component: ProjectEditComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id',
    component: ProjectDetailComponent
  },
  {
    path: 'edit/:id',
    component: ProjectEditComponent,
    data: { mode: 'edit' }
  },
  {
    path: 'copy/:id',
    component: ProjectEditComponent,
    data: { mode: 'copy' }
  },
  {
    path: ':id/jobs',
    component: JobEditComponent,
    data: { mode: 'project-jobs' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
