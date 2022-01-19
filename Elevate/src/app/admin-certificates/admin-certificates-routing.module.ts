import { RouterModule, Routes } from '@angular/router';

import { CertificateDetailsComponent } from './certificate-details/certificate-details.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CertificateListComponent
  },
  {
    path: ':id',
    component: CertificateDetailsComponent,
    data: { type: 'detail' }
  },
  {
    path: 'legal/:id',
    component: CertificateDetailsComponent,
    data: { type: 'legal' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCertificatesRoutingModule { }
