import * as fromRole from './roles.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  roles: fromRole.RoleState;
}

const getRoleFeatureState =
  createFeatureSelector<fromRole.RoleState>('roles');

export const getSearchModel = createSelector(
  getRoleFeatureState,
  (state) => state.searchModel
);
export const getLoading = createSelector(
  getRoleFeatureState,
  (state) => state.loading
);
export const getSearchResult = createSelector(getRoleFeatureState, (state) =>
  state.resultList ? state.resultList : []
);

export const getTotalRecord = createSelector(
  getRoleFeatureState,
  (state) => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getRoleFeatureState,
  (state) => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(getRoleFeatureState, (state) =>
  state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0
);
export const getPageSize = createSelector(getRoleFeatureState, (state) =>
  state.pageInfo?.per_page ? state.pageInfo?.per_page : 0
);
export const getNoRecords = createSelector(
  getRoleFeatureState,
  (state) => state.noRecord
);
