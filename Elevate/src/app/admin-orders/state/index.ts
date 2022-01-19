import * as fromOrder from './admin-order.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  adminOrders: fromOrder.OrderState;
}

const getOrderFeatureState = createFeatureSelector<fromOrder.OrderState>(
  'admin-orders'
);

export const getSearchModel = createSelector(
  getOrderFeatureState,
  (state) => state.searchModel
);
export const getLoading = createSelector(
  getOrderFeatureState,
  (state) => state.loading
);
export const getSearchResult = createSelector(
  getOrderFeatureState,
  (state) => (state.resultList ? state.resultList : [])
);

export const getTotalRecord = createSelector(
  getOrderFeatureState,
  (state) => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getOrderFeatureState,
  (state) => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getOrderFeatureState,
  (state) =>
    state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0
);
export const getPageSize = createSelector(getOrderFeatureState, (state) =>
  state.pageInfo?.per_page ? state.pageInfo?.per_page : 0
);
export const getNoRecords = createSelector(
  getOrderFeatureState,
  (state) => state.noRecord
);
