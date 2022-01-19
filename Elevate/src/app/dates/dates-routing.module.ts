import { RouterModule, Routes } from '@angular/router';

import { DateDetailComponent } from './date-detail/date-detail.component';
import { DateListComponent } from './date-list/date-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: DateListComponent,
  },
  {
    path: ':id/:assign_id',
    component: DateDetailComponent,
    data: { mode: 'detail' },
  },
  {
    path: 'edit/:id',
    component: DateDetailComponent,
    data: { mode: 'edit' },
  },
  {
    path: ':id/create',
    component: DateDetailComponent,
    data: { mode: 'newDate' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatesRoutingModule { }
