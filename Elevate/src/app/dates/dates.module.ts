import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../core/core.module';
import { DateDetailComponent } from './date-detail/date-detail.component';
import { DateListComponent } from './date-list/date-list.component';
import { DatesEffect } from './state/dates.effect';
import { DatesRoutingModule } from './dates-routing.module';
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
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RouterModule } from '@angular/router';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/dates.reducer';

@NgModule({
  declarations: [DateListComponent, DateDetailComponent],
  imports: [
    CoreModule,
    CommonModule,
    StoreModule.forFeature('dates', reducer),
    EffectsModule.forFeature([DatesEffect]),
    DatesRoutingModule,
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
    NgxMaterialTimepickerModule
  ],
  providers: [CurrencyPipe],
})
export class DatesModule {}
