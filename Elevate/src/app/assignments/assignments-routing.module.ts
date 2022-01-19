import { RouterModule, Routes } from '@angular/router';

import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: AssignmentListComponent,
  },
  {
    path: 'create',
    component: CreateAssignmentComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id',
    component: AssignmentDetailComponent,
  },
  {
    path: 'edit/:id',
    component: EditAssignmentComponent,
    data: { mode: 'edit' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentsRoutingModule {}
