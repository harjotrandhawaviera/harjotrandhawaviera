import { RouterModule, Routes } from '@angular/router';

import { CustomerAssignmentListComponent } from './customer-assignment-list/customer-assignment-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'assignments',
    component: CustomerAssignmentListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerAssignmentsRoutingModule {}
