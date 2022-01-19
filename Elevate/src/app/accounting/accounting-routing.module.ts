import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingDetailsComponent } from './accounting-details/accounting-details.component';
import { AccountingEditDetailsComponent } from './accounting-edit-details/accounting-edit-details.component';
import { AccountingExportListComponent } from './accounting-export-list/accounting-export-list.component';
import { AccountingFileListComponent } from './accounting-file-list/accounting-file-list.component';
import { AccountingListComponent } from './accounting-list/accounting-list.component';
import { AccountingRevenuesComponent } from './accounting-revenues/accounting-revenues.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoicePreparationComponent } from './invoice-preparation/invoice-preparation.component';
import { SalesReportDetailsComponent } from './sales-report-details/sales-report-details.component';

const routes: Routes = [
  {
    path: 'invoices',
    component: AccountingListComponent
  },
  {
    path: 'invoices/:id',
    component: AccountingDetailsComponent
  },
  {
    path: 'invoices/edit/:id',
    component: AccountingEditDetailsComponent
  },
  {
    path: 'export',
    component: AccountingExportListComponent
  },
  {
    path: 'preparation',
    component: InvoicePreparationComponent
  },
  {
    path: 'create',
    component: CreateInvoiceComponent
  },
  {
    path:  'revenues',
    component: AccountingRevenuesComponent
  },
  {
    path:  'revenues/:id',
    component: SalesReportDetailsComponent
  },
  {
    path: 'file',
    component: AccountingFileListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
