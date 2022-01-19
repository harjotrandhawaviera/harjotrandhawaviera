import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrameworkAgreementListComponent } from './framework-agreement-list/framework-agreement-list.component';
import { FrameworkAgreementEditComponent } from './framework-agreement-edit/framework-agreement-edit.component';

const routes: Routes = [
  {
    path: '',
    component: FrameworkAgreementListComponent
  },
  {
    path: 'create',
    component: FrameworkAgreementEditComponent
  },
  {
    path: 'edit/:id',
    component: FrameworkAgreementEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrameworkAgreementRoutingModule {
}
