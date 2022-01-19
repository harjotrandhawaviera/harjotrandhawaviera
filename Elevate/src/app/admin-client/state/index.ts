import * as fromClient from './client.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  clients: fromClient.ClientState;
}

const getClientFeatureState = createFeatureSelector<fromClient.ClientState>('clients');

export const getSearchModel = createSelector(
  getClientFeatureState,
  state => state.searchModel
);
export const getLoading = createSelector(
  getClientFeatureState,
  state => state.loading
);
export const getSearchResult = createSelector(
  getClientFeatureState,
  state => state.resultList ? state.resultList : []
);

export const getTotalRecord = createSelector(
  getClientFeatureState,
  state => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getClientFeatureState,
  state => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getClientFeatureState,
  state => (state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0)
);
export const getPageSize = createSelector(
  getClientFeatureState,
  state => (state.pageInfo?.per_page ? state.pageInfo?.per_page : 0)
);
export const newSavedClient = createSelector(
  getClientFeatureState, state => state.successCreateClient
);


export const getClientDetail = createSelector(
  getClientFeatureState,
  state => state.client
);

export const getClientDetailSalesSlots = createSelector(
  getClientDetail,
  state => state?.saleslots
);

export const getClientContacts = createSelector(
  getClientFeatureState,
  state => state.clientContacts
);

export const getClient = createSelector(
  getClientFeatureState,
  state => state.createClient
);

export const getClientId = createSelector(
  getClientDetail,
  state => state ? state.id : undefined
);

export const getContactMode = createSelector(
  getClientFeatureState,
  state => state.contactMode
);

export const getContact = createSelector(
  getClientFeatureState,
  state => state.contact
);

export const getParentOption = createSelector(
  getContact,
  getClientContacts,
  (contact, list) => list ? (contact && contact.id ? list.filter(a => !a.contact_id && a.id !== contact.id) : list) : []
);
export const getNoRecords = createSelector(
  getClientFeatureState,
  state => state.noRecord
);
