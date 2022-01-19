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
import { IncentiveListComponent } from './incentive-list/incentive-list.component';
import { IncentiveRoutingModule } from './incentive-routing.module';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from '../administration/+state/administration.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdministrationEffects } from '../administration/+state/administration.effects';
import { ReactiveFormsModule } from '@angular/forms';
import { IncentiveDetailsComponent } from './incentive-details/incentive-details.component';
import { IncentiveEditComponent } from './incentive-edit/incentive-edit.component';

@NgModule({
  declarations: [
    IncentiveListComponent,
    IncentiveDetailsComponent,
    IncentiveEditComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    SearchPanelModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    IncentiveRoutingModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([AdministrationEffects]),
    ReactiveFormsModule,
  ]
})
export class IncentiveModule {
}
