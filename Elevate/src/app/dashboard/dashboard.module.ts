import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StoreModule } from '@ngrx/store';
import { DashboardEffect } from './+state/dashboard.effect';
import { EffectsModule } from '@ngrx/effects';
import { featureKey, reducer } from './+state/dashboard.reducer';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreModule } from '../core/core.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
    imports: [
        CommonModule,
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
