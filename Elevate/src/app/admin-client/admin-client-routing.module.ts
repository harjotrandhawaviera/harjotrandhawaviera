import { ClientDetailComponent } from './client-detail/client-detail.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientListComponent } from './client-list/client-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: 'create',
    component: ClientEditComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id',
    component: ClientDetailComponent
  },
  {
    path: 'edit/:id',
    component: ClientEditComponent,
    data: { mode: 'edit' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminClientRoutingModule { }
