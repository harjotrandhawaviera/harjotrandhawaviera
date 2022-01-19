import * as fromPerformanceReview from './performance-review.reducer';
import * as fromRoot from '../../root-state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  performanceReviews: fromPerformanceReview.PerformanceReviewState;
}

const getPerformanceReviewFeatureState = createFeatureSelector<fromPerformanceReview.PerformanceReviewState>('performanceReviews');

export const getPerformanceReviewModel = createSelector(
  getPerformanceReviewFeatureState,
  state => state.resultList
);

export const getTimePeriod = createSelector(
  getPerformanceReviewFeatureState,
  state => state.timePeriod
);
