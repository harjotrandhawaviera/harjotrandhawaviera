import * as fromProject from './project.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ProjectVM } from '../../model/project.model';

export interface State extends fromRoot.State {
  projects: fromProject.ProjectState;
}

const getProjectFeatureState = createFeatureSelector<fromProject.ProjectState>('projects');

export const getSearchModel = createSelector(
  getProjectFeatureState,
  state => state.searchModel
);
export const getLoading = createSelector(
  getProjectFeatureState,
  state => state.loading
);
export const getSearchResult = createSelector(
  getProjectFeatureState,
  state => state.resultList ? state.resultList : []
);

export const getTotalRecord = createSelector(
  getProjectFeatureState,
  state => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getProjectFeatureState,
  state => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getProjectFeatureState,
  state => (state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0)
);
export const getPageSize = createSelector(
  getProjectFeatureState,
  state => (state.pageInfo?.per_page ? state.pageInfo?.per_page : 0)
);
export const getNoRecords = createSelector(
  getProjectFeatureState,
  state => state.noRecord
);


export const getProjectDetail = createSelector(
  getProjectFeatureState,
  state => state.project
);
export const getProjectSummary = createSelector(
  getProjectDetail,
  state => state?.summary
);
export const getProjectName = createSelector(
  getProjectDetail,
  state => state?.name
);
export const getProjectSalesSlots = createSelector(
  getProjectDetail,
  state => state && state.saleslots ? state.saleslots : []
);
export const getProjectFreelancerRating = createSelector(
  getProjectDetail,
  state => state && state.freelancer_ratings ? state.freelancer_ratings : []
);
export const getProjectFeedbackQuestion = createSelector(
  getProjectDetail,
  state => state && state.feedback ? state.feedback : []
);
export const getProjectDocument = createSelector(
  getProjectDetail,
  (project: ProjectVM | undefined, props: { type?: string }) => {
    return project && project.documents && props.type ? project.documents.filter(a => a.type === props.type) : []
  }
);
