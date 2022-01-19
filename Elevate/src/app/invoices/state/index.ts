import * as fromInvoice from './invoice.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { InvoiceVM } from '../../model/invoice.model';

export interface State extends fromRoot.State {
  invoices: fromInvoice.InvoiceState;
}

const getInvoiceFeatureState = createFeatureSelector<fromInvoice.InvoiceState>(
  'invoices'
);

export const getSearchModel = createSelector(
  getInvoiceFeatureState,
  (state) => state.searchModel
);
export const getLoading = createSelector(
  getInvoiceFeatureState,
  (state) => state.loading
);
export const getSearchResult = createSelector(
  getInvoiceFeatureState,
  (state) => (state.resultList ? state.resultList : [])
);

export const getTotalRecord = createSelector(
  getInvoiceFeatureState,
  (state) => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getInvoiceFeatureState,
  (state) => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getInvoiceFeatureState,
  (state) =>
    state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0
);
export const getPageSize = createSelector(getInvoiceFeatureState, (state) =>
  state.pageInfo?.per_page ? state.pageInfo?.per_page : 0
);
export const getNoRecords = createSelector(
  getInvoiceFeatureState,
  (state) => state.noRecord
);
