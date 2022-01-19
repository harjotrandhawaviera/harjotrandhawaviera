import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncentiveListComponent } from './incentive-list/incentive-list.component';
import { IncentiveDetailsComponent } from './incentive-details/incentive-details.component';
import { IncentiveEditComponent } from './incentive-edit/incentive-edit.component';

const routes: Routes = [
  {
    path: '',
    component: IncentiveListComponent
  },
  {
    path: ':id',
    component: IncentiveDetailsComponent
  },
  {
    path: 'edit/:id',
    component: IncentiveEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncentiveRoutingModule {
}
