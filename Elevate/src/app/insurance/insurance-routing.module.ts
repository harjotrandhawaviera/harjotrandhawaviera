import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { InsuranceEditComponent } from './insurance-edit/insurance-edit.component';

const routes: Routes = [
  {
    path: '',
    component: InsuranceListComponent
  },
  {
    path: 'create',
    component: InsuranceEditComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id',
    component: InsuranceDetailsComponent
  },
  {
    path: 'edit/:id',
    component: InsuranceEditComponent,
    data: { mode: 'edit' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule {
}
