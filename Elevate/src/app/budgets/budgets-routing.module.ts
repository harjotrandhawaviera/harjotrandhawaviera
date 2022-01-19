import { RouterModule, Routes } from '@angular/router';

import { BudgetListComponent } from './budget-list/budget-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'client',
    component: BudgetListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsRoutingModule { }
