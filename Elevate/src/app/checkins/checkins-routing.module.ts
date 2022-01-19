import { RouterModule, Routes } from '@angular/router';

import { CheckinsListComponent } from './checkins-list/checkins-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CheckinsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinsRoutingModule { }
