import * as fromFreelancer from './freelancer.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FreelancerVM } from '../../model/freelancer.model';

export interface State extends fromRoot.State {
  freelancers: fromFreelancer.FreelancerState;
}

const getFreelancerFeatureState = createFeatureSelector<fromFreelancer.FreelancerState>(
  'freelancers'
);

export const getSearchModel = createSelector(
  getFreelancerFeatureState,
  (state) => state.searchModel
);
export const getLoading = createSelector(
  getFreelancerFeatureState,
  (state) => state.loading
);
export const getSearchResult = createSelector(
  getFreelancerFeatureState,
  (state) => (state.resultList ? state.resultList : [])
);

export const getTotalRecord = createSelector(
  getFreelancerFeatureState,
  (state) => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getFreelancerFeatureState,
  (state) => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getFreelancerFeatureState,
  (state) =>
    state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0
);
export const getPageSize = createSelector(getFreelancerFeatureState, (state) =>
  state.pageInfo?.per_page ? state.pageInfo?.per_page : 0
);
export const getNoRecords = createSelector(
  getFreelancerFeatureState,
  (state) => state.noRecord
);

export const getUserList = createSelector(
  getFreelancerFeatureState,
  (state) => state.userList
)
