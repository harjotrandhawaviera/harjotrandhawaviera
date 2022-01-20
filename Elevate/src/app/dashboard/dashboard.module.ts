import { featureKey, reducer } from './+state/dashboard.reducer';

import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardEffect } from './+state/dashboard.effect';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
    imports: [
        CommonModule,
        IonicModule,
        DashboardRoutingModule,
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature(
            [DashboardEffect]
        ),
        MatTableModule,
        MatCheckboxModule,
        CoreModule,
        MatDialogModule
    ]
})
export class DashboardModule { }
