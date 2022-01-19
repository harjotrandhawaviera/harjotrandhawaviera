import * as fromDates from './dates.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  jobs: fromDates.DatesState;
}

const getDatesFeatureState = createFeatureSelector<fromDates.DatesState>('dates');

export const getSearchModel = createSelector(
  getDatesFeatureState,
  state => state.searchModel
);
export const getLoading = createSelector(
  getDatesFeatureState,
  state => state.loading
);
export const getSearchResult = createSelector(
  getDatesFeatureState,
  state => state.resultList ? state.resultList : []
);
export const getDatesDetail = createSelector(
  getDatesFeatureState,
  state => state.dates
);
export const getJobDetail = createSelector(
  getDatesFeatureState,
  state => state.job
);

export const getTotalRecord = createSelector(
  getDatesFeatureState,
  state => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getDatesFeatureState,
  state => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getDatesFeatureState,
  state => (state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0)
);
export const getPageSize = createSelector(
  getDatesFeatureState,
  state => (state.pageInfo?.per_page ? state.pageInfo?.per_page : 0)
);
export const getNoRecords = createSelector(
  getDatesFeatureState,
  state => state.noRecord
);
