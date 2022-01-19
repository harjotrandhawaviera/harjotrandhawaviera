import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../root-state';
import * as fromContact from './contact.reducer';
export interface State extends fromRoot.State {
  contacts: fromContact.ContactState;
}

const getContactFeatureState = createFeatureSelector<fromContact.ContactState>('contacts');

export const getSearchModel = createSelector(
  getContactFeatureState,
  state => state.searchModel
);
export const getLoading = createSelector(
  getContactFeatureState,
  state => state.loading
);
export const getSearchResult = createSelector(
  getContactFeatureState,
  state => state.resultList ? state.resultList : []
);

export const getTotalRecord = createSelector(
  getContactFeatureState,
  state => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getContactFeatureState,
  state => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getContactFeatureState,
  state => (state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0)
);
export const getPageSize = createSelector(
  getContactFeatureState,
  state => (state.pageInfo?.per_page ? state.pageInfo?.per_page : 0)
);
export const getNoRecords = createSelector(
  getContactFeatureState,
  state => state.noRecord
);
