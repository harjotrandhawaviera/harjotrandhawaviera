import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RightsComponent } from './rights/rights.component';
import { CoreModule } from '../core/core.module';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RightsRoutingModule } from './rights-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from '../administration/+state/administration.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdministrationEffects } from '../administration/+state/administration.effects';

@NgModule({
  declarations: [
    RightsComponent
  ],
    imports: [
        CoreModule,
        CommonModule,
        RightsRoutingModule,
        SearchPanelModule,
        MatSelectModule,
        MatTableModule,
        MatMenuModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([AdministrationEffects]),
    ]
})
export class RightsModule {}
