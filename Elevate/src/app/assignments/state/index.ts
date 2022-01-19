import * as fromAssignment from './assignment.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  assignments: fromAssignment.AssignmentState;
}

const getAssignmentFeatureState = createFeatureSelector<fromAssignment.AssignmentState>('assignments');

export const getSearchModel = createSelector(
  getAssignmentFeatureState,
  state => state.searchModel
);
export const getLoading = createSelector(
  getAssignmentFeatureState,
  state => state.loading
);
export const getSearchResult = createSelector(
  getAssignmentFeatureState,
  state => state.resultList ? state.resultList : []
);
export const getMetaData = createSelector(
  getAssignmentFeatureState,
  state => state.assignmentMeta ? state.assignmentMeta : undefined
);
export const getAssignmentDetail = createSelector(
  getAssignmentFeatureState,
  state => state.assignment
);
export const getBudgetDetail = createSelector(
  getAssignmentFeatureState,
  state => state.budget
);
export const getDatesDetail = createSelector(
  getAssignmentFeatureState,
  state => state.date
);

export const getTotalRecord = createSelector(
  getAssignmentFeatureState,
  state => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getAssignmentFeatureState,
  state => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getAssignmentFeatureState,
  state => (state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0)
);
export const getPageSize = createSelector(
  getAssignmentFeatureState,
  state => (state.pageInfo?.per_page ? state.pageInfo?.per_page : 0)
);
export const getNoRecords = createSelector(
  getAssignmentFeatureState,
  state => state.noRecord
);
export const getSurveyLink = createSelector(
  getAssignmentFeatureState,
  state => state.surveyLink
);
