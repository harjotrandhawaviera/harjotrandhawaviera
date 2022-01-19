import { featureKey, reducer } from '../administration/+state/administration.reducer';

import { AdministrationEffects } from '../administration/+state/administration.effects';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { LogsComponent } from './logs.component';
import { LogsRoutingModule } from './logs-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatMenuModule
} from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [LogsComponent],
  imports: [
    CommonModule,
    CoreModule,
    LogsRoutingModule,
    SearchPanelModule,
    CoreModule,
    ReactiveFormsModule,
    // _MatMenuDirectivesModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([AdministrationEffects]),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ]
})
export class  LogsModule {}
