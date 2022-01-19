import * as fromRoot from '../../root-state';
import * as fromUser from './user.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  users: fromUser.UserState;
}

const getUserFeatureState = createFeatureSelector<fromUser.UserState>('users');

export const getSearchModel = createSelector(
  getUserFeatureState,
  state => state.searchModel
);
export const getLoading = createSelector(
  getUserFeatureState,
  state => state.loading
);
export const getSearchResult = createSelector(
  getUserFeatureState,
  state => state.resultList ? state.resultList : []
);

export const getUserDetail = createSelector(
  getUserFeatureState,
  state => state.userDetail
);
export const getBlockedByUser = createSelector(
  getUserFeatureState,
  state => state.blockedByUser
);

export const getTotalRecord = createSelector(
  getUserFeatureState,
  state => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getUserFeatureState,
  state => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getUserFeatureState,
  state => (state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0)
);
export const getPageSize = createSelector(
  getUserFeatureState,
  state => (state.pageInfo?.per_page ? state.pageInfo?.per_page : 0)
);
