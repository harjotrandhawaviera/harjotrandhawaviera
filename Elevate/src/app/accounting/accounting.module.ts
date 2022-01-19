import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountingListComponent } from './accounting-list/accounting-list.component';
import { AccountingRoutingModule } from './accounting-routing.module';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { CoreModule } from '../core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './+state/accounting.reducer';
import { AccountingEffects } from './+state/accounting.effects';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { AccountingDetailsComponent } from './accounting-details/accounting-details.component';
import { AccountingEditDetailsComponent } from './accounting-edit-details/accounting-edit-details.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AccountingExportListComponent } from './accounting-export-list/accounting-export-list.component';
import { AccountingFileListComponent } from './accounting-file-list/accounting-file-list.component';
import { InvoicePreparationComponent } from './invoice-preparation/invoice-preparation.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { AccountingRevenuesComponent } from './accounting-revenues/accounting-revenues.component';
import { SalesReportDetailsComponent } from './sales-report-details/sales-report-details.component';

@NgModule({
  declarations: [
    AccountingListComponent,
    AccountingDetailsComponent,
    AccountingEditDetailsComponent,
    AccountingFileListComponent,
    InvoicePreparationComponent,
    CreateInvoiceComponent,
    AccountingRevenuesComponent,
    SalesReportDetailsComponent,
    AccountingExportListComponent
  ],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    SearchPanelModule,
    CoreModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([AccountingEffects]),
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule
  ],
  providers: [MatDatepickerModule, DatePipe]
})
export class AccountingModule { }
