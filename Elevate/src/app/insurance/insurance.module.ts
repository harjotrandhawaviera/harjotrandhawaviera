import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsuranceRoutingModule } from './insurance-routing.module';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from '../administration/+state/administration.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdministrationEffects } from '../administration/+state/administration.effects';
import { ReactiveFormsModule } from '@angular/forms';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { InsuranceEditComponent } from './insurance-edit/insurance-edit.component';


@NgModule({
  declarations: [
    InsuranceListComponent,
    InsuranceDetailsComponent,
    InsuranceEditComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    InsuranceRoutingModule,
    SearchPanelModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([AdministrationEffects]),
    ReactiveFormsModule,
  ]
})
export class InsuranceModule {
}
