import * as fromBudget from './budget.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BudgetVM } from '../../model/budget.model';

export interface State extends fromRoot.State {
  budgets: fromBudget.BudgetState;
}

const getBudgetFeatureState = createFeatureSelector<fromBudget.BudgetState>(
  'budgets'
);

export const getSearchModel = createSelector(
  getBudgetFeatureState,
  (state) => state.searchModel
);
export const getLoading = createSelector(
  getBudgetFeatureState,
  (state) => state.loading
);
export const getSearchResult = createSelector(
  getBudgetFeatureState,
  (state) => (state.resultList ? state.resultList : [])
);

export const getTotalRecord = createSelector(
  getBudgetFeatureState,
  (state) => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getBudgetFeatureState,
  (state) => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getBudgetFeatureState,
  (state) =>
    state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0
);
export const getPageSize = createSelector(getBudgetFeatureState, (state) =>
  state.pageInfo?.per_page ? state.pageInfo?.per_page : 0
);
export const getNoRecords = createSelector(
  getBudgetFeatureState,
  (state) => state.noRecord
);
