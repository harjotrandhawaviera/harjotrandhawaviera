import { RouterModule, Routes } from '@angular/router';

import { AdminBudgetDetailComponent } from './admin-budget-detail/admin-budget-detail.component';
import { AdminBudgetEditComponent } from './admin-budget-edit/admin-budget-edit.component';
import { AdminBudgetListComponent } from './admin-budget-list/admin-budget-list.component';
import { AdminBudgetRecordCreateComponent } from './admin-budget-record-create/admin-budget-record-create.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: AdminBudgetListComponent
  },
  {
    path: 'edit/:id',
    component: AdminBudgetEditComponent,
    data: { mode: 'edit' }
  },
  {
    path: 'create',
    component: AdminBudgetEditComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id',
    component: AdminBudgetDetailComponent
  },
  {
    path: ':id/record',
    component: AdminBudgetRecordCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminBudgetsRoutingModule { }
