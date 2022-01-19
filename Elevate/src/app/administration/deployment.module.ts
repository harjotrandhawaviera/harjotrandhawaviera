import { NgModule } from '@angular/core';
import { DeploymentLocationComponent } from './deployment-location/deployment-location.component';
import { CoreModule } from '../core/core.module';
import { DeploymentRoutingModule } from './deployment-routing.module';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from '../administration/+state/administration.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdministrationEffects } from '../administration/+state/administration.effects';
import { DeploymentLocationDetailsComponent } from './deployment-location-details/deployment-location-details.component';
import { DeploymentEditDetailsComponent } from './deployment-edit-details/deployment-edit-details.component';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DeploymentLocationComponent,
    DeploymentLocationDetailsComponent,
    DeploymentEditDetailsComponent
  ],
    imports: [
        CoreModule,
        SearchPanelModule,
        MatSelectModule,
        MatTableModule,
        MatMenuModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        DeploymentRoutingModule,
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([AdministrationEffects]),
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
    ]
})
export class DeploymentModule {
}
