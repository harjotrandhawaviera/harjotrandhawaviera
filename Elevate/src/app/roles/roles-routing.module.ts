import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleListComponent } from './role-list/role-list.component';

const routes: Routes = [
  {
    path: '',
    component: RoleListComponent,
  },
  {
    path: 'create',
    component: RoleEditComponent,
    data: { mode: 'create' },
  },
  {
    path: ':id',
    component: RoleEditComponent,
    data: { mode: 'edit' },
  },
  {
    path: ':id/detail',
    component: RoleDetailComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
