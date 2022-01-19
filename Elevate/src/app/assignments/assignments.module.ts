import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdditionalCostComponent } from './additional-cost/additional-cost.component';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AssignmentEffect } from './state/assignment.effects';
import { AssignmentJobComponent } from './assignment-job/assignment-job.component';
import { AssignmentJobFeedbackComponent } from './assignment-job-feedback/assignment-job-feedback.component';
import { AssignmentJobGeneralComponent } from './assignment-job-general/assignment-job-general.component';
import { AssignmentJobInfoDocumentComponent } from './assignment-job-info-document/assignment-job-info-document.component';
import { AssignmentJobProductsComponent } from './assignment-job-products/assignment-job-products.component';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { AssignmentRatingsComponent } from './assignment-ratings/assignment-ratings.component';
import { AssignmentsRoutingModule } from './assignments-routing.module';
import { ClientAssignmentListComponent } from './client-assignment-list/client-assignment-list.component';
import { ClientAssignmentTileComponent } from './client-assignment-tile/client-assignment-tile.component';
import { CoreModule } from '../core/core.module';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { CustomPropertiesValueComponent } from './custom-properties-value/custom-properties-value.component';
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import { EffectsModule } from '@ngrx/effects';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { InvoiceAdditionalComponent } from './invoice-additional/invoice-additional.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RevenueListComponent } from './revenue-list/revenue-list.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { RouterModule } from '@angular/router';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/assignment.reducer';
import {JobsModule} from '../jobs/jobs.module';

@NgModule({
  declarations: [
    AssignmentListComponent,
    ClientAssignmentListComponent,
    ClientAssignmentTileComponent,
    AssignmentDetailComponent,
    RevenueListComponent,
    InvoiceAdditionalComponent,
    AssignmentRatingsComponent,
    AssignmentJobComponent,
    AssignmentJobGeneralComponent,
    AssignmentJobFeedbackComponent,
    AssignmentJobInfoDocumentComponent,
    AssignmentJobProductsComponent,
    CustomPropertiesValueComponent,
    AdditionalCostComponent,
    CreateAssignmentComponent,
    EditAssignmentComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    StoreModule.forFeature('assignments', reducer),
    EffectsModule.forFeature([AssignmentEffect]),
    AssignmentsRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    SearchPanelModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    FileUploadModule,
    MatSlideToggleModule,
    NgxMaterialTimepickerModule,
    RoundProgressModule,
    MatTooltipModule,
    MatRadioModule,
    JobsModule,
  ],
  exports: [
    AssignmentJobComponent,
    AssignmentJobProductsComponent,
    AssignmentJobFeedbackComponent,
    AssignmentJobInfoDocumentComponent,
    AssignmentRatingsComponent
  ],
  providers: [CurrencyPipe],
})
export class AssignmentsModule {}
