import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssignmentDocumentComponent } from './assignment-document/assignment-document.component';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { AssignmentRevenueComponent } from './assignment-revenue/assignment-revenue.component';
import { AssignmentsModule } from './../assignments/assignments.module';
import { AssignmentsRatingsComponent } from './assignments-ratings/assignments-ratings.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { EllipsisModule } from 'ngx-ellipsis';
import { FileUploadModule } from './../file-upload/file-upload.module';
import { InvoiceCheckComponent } from './invoice-check/invoice-check.component';
import { InvoiceDetailsAdditionalComponent } from './invoice-details-additional/invoice-details-additional.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoiceEffect } from './state/invoice.effect';
import { InvoiceGeneratorAssignmentDetailComponent } from './invoice-generator-assignment-detail/invoice-generator-assignment-detail.component';
import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
import { InvoiceGeneratorGeneralComponent } from './invoice-generator-general/invoice-generator-general.component';
import { InvoiceGeneratorJobComponent } from './invoice-generator-job/invoice-generator-job.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceMappingService } from './../services/mapping-services/invoice-mapping.service';
import { InvoicePreparationAssignmentTileComponent } from './invoice-preparation-assignment-tile/invoice-preparation-assignment-tile.component';
import { InvoicePreparationEditComponent } from './invoice-preparation-edit/invoice-preparation-edit.component';
import { InvoicePreparationListComponent } from './invoice-preparation-list/invoice-preparation-list.component';
import { InvoiceReportRevenueComponent } from './invoice-report-revenue/invoice-report-revenue.component';
import { InvoiceService } from './../services/invoice.service';
import { InvoiceTileComponent } from './invoice-tile/invoice-tile.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgModule } from '@angular/core';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { SurveysModule } from './../surveys/surveys.module';
import { reducer } from './state/invoice.reducer';

@NgModule({
  declarations: [InvoiceListComponent, InvoiceTileComponent, InvoiceDetailsComponent, InvoiceEditComponent, AssignmentListComponent, InvoiceDetailsAdditionalComponent, InvoiceReportRevenueComponent, InvoiceCheckComponent, AssignmentsRatingsComponent, InvoicePreparationListComponent, InvoicePreparationAssignmentTileComponent, InvoicePreparationEditComponent, AssignmentDocumentComponent, AssignmentRevenueComponent, InvoiceGeneratorComponent, InvoiceGeneratorJobComponent, InvoiceGeneratorAssignmentDetailComponent, InvoiceGeneratorGeneralComponent],
  imports: [
    CoreModule,
    CommonModule,
    InvoicesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('invoices', reducer),
    EffectsModule.forFeature([InvoiceEffect]),
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SearchPanelModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    FileUploadModule,
    MatTableModule,
    MatTooltipModule,
    SurveysModule,
    AssignmentsModule,
    MatTabsModule,
    NgImageSliderModule,
    EllipsisModule
  ],
  providers: [InvoiceService, InvoiceMappingService]
})
export class InvoicesModule { }
