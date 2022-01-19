import * as fromApproval from './approval.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  approval: fromApproval.ApprovalState;
}

const getFreelancerFeatureState = createFeatureSelector<fromApproval.ApprovalState>(
  'approval'
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

export const getEventLogSearchModel = createSelector(
  getFreelancerFeatureState,
  (state) => state.eventLogSearchModel
);
export const getEventLogLoading = createSelector(
  getFreelancerFeatureState,
  (state) => state.eventLogLoading
);
export const getEventLogSearchResult = createSelector(
  getFreelancerFeatureState,
  (state) => (state.eventLogResultList ? state.eventLogResultList : [])
);

export const getEventLogTotalRecord = createSelector(
  getFreelancerFeatureState,
  (state) => state.eventLogPageInfo?.total
);
export const getEventLogCurrentPage = createSelector(
  getFreelancerFeatureState,
  (state) => state.eventLogPageInfo?.current_page
);
export const getEventLogCurrentIndex = createSelector(
  getFreelancerFeatureState,
  (state) =>
    state.eventLogPageInfo?.current_page ? state.eventLogPageInfo?.current_page - 1 : 0
);
export const getEventLogPageSize = createSelector(getFreelancerFeatureState, (state) =>
  state.eventLogPageInfo?.per_page ? state.eventLogPageInfo?.per_page : 0
);
export const getEventLogNoRecords = createSelector(
  getFreelancerFeatureState,
  (state) => state.eventLogNoRecord
);
export const getNewFreelancer = createSelector(
  getFreelancerFeatureState,
  (state) => state.freelancerList
);
export const getUserList = createSelector(
  getFreelancerFeatureState,
  (state) => state.userList
)
export const getUserEmail = createSelector(
  getFreelancerFeatureState,
  (state) => state.userEmail
);
