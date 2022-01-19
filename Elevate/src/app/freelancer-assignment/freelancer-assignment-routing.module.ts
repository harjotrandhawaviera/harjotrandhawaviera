import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreelancerAssignmentComponent } from './freelancer-assignment.component';
import { FreelancerAssignmentDetailsComponent } from './freelancer-assignment-details/freelancer-assignment-details.component';


const routes: Routes = [
  {
    path: '',
    component: FreelancerAssignmentComponent
  },
  {
    path: ':id',
    component: FreelancerAssignmentDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreelancerAssignmentRoutingModule {}
