import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssignmentsRoutingModule } from '../assignments/assignments-routing.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { CustomerAssignmentEffect } from './state/customer-assignment.effects';
import { CustomerAssignmentListComponent } from './customer-assignment-list/customer-assignment-list.component';
import { CustomerAssignmentsRoutingModule } from './customer-assignments-routing.module';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { RouterModule } from '@angular/router';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { UsersMappingService } from '../services/mapping-services/user-mapping.service';
import { reducer } from './state/customer-assignment.reducer';

@NgModule({
  declarations: [CustomerAssignmentListComponent],
  imports: [
    CoreModule,
    CommonModule,
    CustomerAssignmentsRoutingModule,
    StoreModule.forFeature('assignments', reducer),
    EffectsModule.forFeature([CustomerAssignmentEffect]),
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
  ],
  providers: [UsersMappingService]
})
export class CustomerAssignmentsModule { }
