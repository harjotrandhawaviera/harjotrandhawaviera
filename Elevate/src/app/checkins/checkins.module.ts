import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssignmentsRoutingModule } from '../assignments/assignments-routing.module';
import { CheckinEffect } from './state/checkins.effects';
import { CheckinsListComponent } from './checkins-list/checkins-list.component';
import { CheckinsRoutingModule } from './checkins-routing.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
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
import { reducer } from './state/checkins.reducer';
import { CheckinsTileComponent } from './checkins-tile/checkins-tile.component';

@NgModule({
  declarations: [CheckinsListComponent, CheckinsTileComponent],
  imports: [
    CoreModule,
    CommonModule,
    CheckinsRoutingModule,
    StoreModule.forFeature('checkins', reducer),
    EffectsModule.forFeature([CheckinEffect]),
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
    MatTooltipModule,
  ]
})
export class CheckinsModule { }
