import { RouterModule, Routes } from '@angular/router';

import { CertificateDetailsComponent } from './certificate-details/certificate-details.component';
import { CertificateDetailsPassedComponent } from './certificate-details-passed/certificate-details-passed.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'all',
    component: CertificateListComponent,
    data: { type: 'all' }
  },
  {
    path: 'my',
    component: CertificateListComponent,
    data: { type: 'my' }
  },
  {
    path: 'my/:id',
    component: CertificateDetailsPassedComponent
  },
  {
    path: 'details/:id',
    component: CertificateDetailsComponent
  },
  {
    path: 'exclusive',
    component: CertificateListComponent,
    data: { type: 'exclusive' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificatesRoutingModule { }
