import { RouterModule, Routes } from '@angular/router';

import { InvoiceCheckComponent } from './invoice-check/invoice-check.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoicePreparationEditComponent } from './invoice-preparation-edit/invoice-preparation-edit.component';
import { InvoicePreparationListComponent } from './invoice-preparation-list/invoice-preparation-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'list',
    component: InvoiceListComponent
  },
  {
    path: 'generator',
    component: InvoiceGeneratorComponent
  },
  {
    path: 'check/:id',
    component: InvoiceCheckComponent,
    data: { mode: 'edit' }
  },
  {
    path: 'edit/:id',
    component: InvoiceEditComponent,
    data: { mode: 'edit' }
  },
  {
    path: 'create',
    component: InvoiceEditComponent,
    data: { mode: 'create' }
  },
  {
    path: 'preparation',
    component: InvoicePreparationListComponent
  },
  {
    path: 'preparation/:id/:freelancerId',
    component: InvoicePreparationEditComponent
  },
  {
    path: ':id',
    component: InvoiceDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
