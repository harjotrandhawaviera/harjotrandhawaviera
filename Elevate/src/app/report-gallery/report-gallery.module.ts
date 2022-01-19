import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { CoreModule } from '../core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StoreModule } from '@ngrx/store';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportGalleryComponent } from './report-gallery/report-gallery.component';
import { ReportGalleryRoutingModule } from './report-gallery-routing.module';
import {ReportFilterModule} from '../report-filter/report-filter.module';
import {featureKey, reducer} from '../report-gallery/state/report-admin.reducer';
import {EffectsModule} from '@ngrx/effects';
import {ReportAdminEffects} from './state/report-admin.effects';
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [ReportGalleryComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([ReportAdminEffects]),
    ReportFilterModule,
    ReportGalleryRoutingModule,
    SearchPanelModule,
    CoreModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTableModule
  ],
  providers: [MatDatepickerModule, DatePipe]
})
export class ReportGalleryModule {
}
