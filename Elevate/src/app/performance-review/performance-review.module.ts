import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceReviewRoutingModule } from './performance-review-routing.module';
import { PerformanceReviewRatingComponent } from './performance-review-rating/performance-review-rating.component';
import { EffectsModule } from '@ngrx/effects';
import { PerformanceReviewEffect } from './state/performance-review.effect';
import { CoreModule } from '../core/core.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/performance-review.reducer';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BarRatingModule } from 'ngx-bar-rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PerformanceReviewRatingComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    PerformanceReviewRoutingModule,
    StoreModule.forFeature('performanceReviews', reducer),
    EffectsModule.forFeature([PerformanceReviewEffect]),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    BarRatingModule
  ]
})
export class PerformanceReviewModule { }
