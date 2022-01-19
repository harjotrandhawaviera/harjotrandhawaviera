import { RouterModule, Routes } from '@angular/router';

import { AdminOrderDetailComponent } from './admin-order-detail/admin-order-detail.component';
import { AdminOrderEditComponent } from './admin-order-edit/admin-order-edit.component';
import { AdminOrdersListComponent } from './admin-orders-list/admin-orders-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: AdminOrdersListComponent
  },
  {
    path: 'create',
    component: AdminOrderEditComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id',
    component: AdminOrderDetailComponent,
    data: { mode: 'edit' }
  },
  {
    path: 'edit/:id',
    component: AdminOrderEditComponent,
    data: { mode: 'edit' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOrdersRoutingModule { }
