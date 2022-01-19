import * as fromJob from './job.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  jobs: fromJob.JobState;
}

const getJobFeatureState = createFeatureSelector<fromJob.JobState>('jobs');

export const getSearchModel = createSelector(
  getJobFeatureState,
  state => state.searchModel
);
export const getLoading = createSelector(
  getJobFeatureState,
  state => state.loading
);
export const getSearchResult = createSelector(
  getJobFeatureState,
  state => state.resultList ? state.resultList : []
);
export const getJobDetail = createSelector(
  getJobFeatureState,
  state => state.job
);
export const getBudgetDetail = createSelector(
  getJobFeatureState,
  state => state.budget
);
export const getSaleSlots = createSelector(
  getJobDetail,
  state => state?.saleslots
);
export const getTeamInfo = createSelector(
  getJobDetail,
  state => state?.teaminfo
);
export const getTaskInfo = createSelector(
  getJobDetail,
  state => state?.taskinfo
);
export const getFeedbackQuestions = createSelector(
  getJobDetail,
  state => state?.feedback
);
export const getProject = createSelector(
  getJobFeatureState,
  state => state.project
);
export const CreatedJobs = createSelector(
  getJobFeatureState,
  state => state.siteIds
);
export const getJobOffer = createSelector(
  getJobFeatureState,
  state => state.jobOffer
);
export const CreatedJobTenders = createSelector(
  getJobFeatureState,
  state => state.dates
);

export const getTotalRecord = createSelector(
  getJobFeatureState,
  state => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getJobFeatureState,
  state => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getJobFeatureState,
  state => (state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0)
);
export const getPageSize = createSelector(
  getJobFeatureState,
  state => (state.pageInfo?.per_page ? state.pageInfo?.per_page : 0)
);
export const getNoRecords = createSelector(
  getJobFeatureState,
  state => state.noRecord
);
export const getFreelancerJobOffer = createSelector(
  getJobFeatureState,
  state => state.freelanceJobOfferList
);
export const getFreelancerJobOfferDetails = createSelector(
  getJobFeatureState,
  state => state.freelanceJobOfferDetailsList
);
export const getFreelancerJobOfferQuestion = createSelector(
  getJobFeatureState,
  state => state.Question
);
export const getFreelancerJobOfferSubject = createSelector(
  getJobFeatureState,
  state => state.Subject
);
export const getFreelancerJobOfferReject = createSelector(
  getJobFeatureState,
  state => state.Reject
);
export const getJobAdvertise = createSelector(
  getJobFeatureState,
  state => state.jobAdvertise
);
export const getShortlist = createSelector(
  getJobFeatureState,
  state => state.jobAdvertise
);
export const getUserList = createSelector(
  getJobFeatureState,
  (state) => state.userList
)
export const sendInvite = createSelector(
  getJobFeatureState,
  (state) => state.Email
);
export const getJobInvite = createSelector(
  getJobFeatureState,
  (state) => state.jobInvite
)
export const getShortlistOffer = createSelector(
  getJobFeatureState,
  (state) => state.shortlistOffer
)
export const getShortlistOfferDetails = createSelector(
  getJobFeatureState,
  (state) => state.shortlistOfferDetails
)
export const getAdminOfferDetail = createSelector(
  getJobFeatureState,
  state => state.adminOfferDetail
)
export const getAdminFreelancerDetail = createSelector(
  getJobFeatureState,
  state => state.adminFreelancerDetail
);
export const getNewJob = createSelector(
  getJobFeatureState,
  state => state.newJob
);
export const freelancerAllJobSubmit = createSelector(
  getJobFeatureState,
  state => state.Submit
);

