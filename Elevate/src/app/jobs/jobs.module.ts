import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdditionalCostComponent } from './additional-cost/additional-cost.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ClientJobCreateComponent } from './client-job-create/client-job-create.component';
import { ClientJobListComponent } from './client-job-list/client-job-list.component';
import { ClientJobTileComponent } from './client-job-tile/client-job-tile.component';
import { CoreModule } from '../core/core.module';
import { CustomPropertiesValueComponent } from './custom-properties-value/custom-properties-value.component';
import { EffectsModule } from '@ngrx/effects';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { IonicModule } from '@ionic/angular';
import { JobDetailAllComponent } from './job-detail-all/job-detail-all.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobDetailFeedbackComponent } from './job-detail-feedback/job-detail-feedback.component';
import { JobDetailGeneralComponent } from './job-detail-general/job-detail-general.component';
import { JobDetailGeneralEditComponent } from './job-detail-general-edit/job-detail-general-edit.component';
import { JobDetailInfoDocumentComponent } from './job-detail-info-document/job-detail-info-document.component';
import { JobDetailProductsComponent } from './job-detail-products/job-detail-products.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobDocumentsComponent } from './job-documents/job-documents.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { JobEffect } from './state/job.effect';
import { JobInviteComponent } from './job-invite/job-invite.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobOffersComponent } from './job-offers/job-offers.component';
import { JobTendersCreateComponent } from './job-tenders-create/job-tenders-create.component';
import { JobUpdateComponent } from './job-update/job-update.component';
import { JobsInviteDetailComponent } from './jobs-invite-detail/jobs-invite-detail.component';
import { JobsRoutingModule } from './jobs-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RouterModule } from '@angular/router';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { ShortlistofferDetailsComponent } from './shortlistoffer-details/shortlistoffer-details.component';
import { ShortlistofferListComponent } from './shortlistoffer-list/shortlistoffer-list.component';
import { StoreModule } from '@ngrx/store';
import { TaskInfoComponent } from './taskinfo/taskinfo.component';
import { TeamInfoComponent } from './teaminfo/teaminfo.component';
import { reducer } from './state/job.reducer';

@NgModule({
  declarations: [
    JobListComponent,
    JobDetailComponent,
    JobDetailGeneralComponent,
    JobDetailProductsComponent,
    JobDetailFeedbackComponent,
    JobDetailInfoDocumentComponent,
    AdditionalCostComponent,
    JobEditComponent,
    JobDetailGeneralEditComponent,
    JobDocumentsComponent,
    JobUpdateComponent,
    CustomPropertiesValueComponent,
    JobOffersComponent,
    JobTendersCreateComponent,
    ClientJobListComponent,
    ClientJobTileComponent,
    ClientJobCreateComponent,
    JobDetailsComponent,
    JobDetailAllComponent,
    TeamInfoComponent,
    TaskInfoComponent,
    ShortlistofferListComponent,
    ShortlistofferDetailsComponent,
    JobInviteComponent,
    JobsInviteDetailComponent
  ],
    imports: [
        CoreModule,
        CommonModule,
        IonicModule,
        StoreModule.forFeature('jobs', reducer),
        EffectsModule.forFeature([JobEffect]),
        JobsRoutingModule,
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
        MatIconModule,
        AngularEditorModule,
        MatRadioModule
    ],
  exports: [JobEditComponent, TeamInfoComponent,
    TaskInfoComponent],
  providers: [CurrencyPipe, DatePipe],
})
export class JobsModule {}
