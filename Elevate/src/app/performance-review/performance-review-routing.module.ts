import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceReviewRatingComponent } from './performance-review-rating/performance-review-rating.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceReviewRatingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceReviewRoutingModule { }
