import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdditionalCostComponent } from './additional-cost/additional-cost.component';
import { AssignmentsModule } from '../assignments/assignments.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { CreateTenderComponent } from './create-tender/create-tender.component';
import { CustomPropertiesValueComponent } from './custom-properties-value/custom-properties-value.component';
import { EffectsModule } from '@ngrx/effects';
import { FileUploadModule } from '../file-upload/file-upload.module';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RouterModule } from '@angular/router';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { TenderDetailComponent } from './tender-detail/tender-detail.component';
import { TenderEffect } from './state/tender.effect';
import { TendersListComponent } from './tenders-list/tenders-list.component';
import { TendersRoutingModule } from './tenders-routing.module';
import { TendersTileComponent } from './tenders-tile/tenders-tile.component';
import { reducer } from './state/tender.reducer';
import { EditTenderComponent } from './edit-tender/edit-tender.component';
import { OffersComponent } from './offers/offers.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import {MatIconModule} from '@angular/material/icon';
import { JobsModule } from '../jobs/jobs.module';

@NgModule({
  declarations: [
    TendersListComponent,
    TendersTileComponent,
    TenderDetailComponent,
    CreateTenderComponent,
    AdditionalCostComponent,
    CustomPropertiesValueComponent,
    EditTenderComponent,
    OffersComponent,
    OfferDetailsComponent,
  ],
    imports: [
        CoreModule,
        CommonModule,
        StoreModule.forFeature('tenders', reducer),
        EffectsModule.forFeature([TenderEffect]),
        TendersRoutingModule,
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
        AssignmentsModule,
        NgxMaterialTimepickerModule,
        MatIconModule,
        JobsModule
    ],
})
export class TendersModule {}
