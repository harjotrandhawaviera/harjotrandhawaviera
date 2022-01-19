import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState, featureKey } from './dashboard.reducer';

export const getFeatureState = createFeatureSelector<DashboardState>(featureKey);

export const fromDashboard = {
  getAttendList: createSelector(getFeatureState, (state) => state.attendance),
  getOfferList: createSelector(getFeatureState, (state) => state.offers),
  getOfferJob: createSelector(getFeatureState, (state) => state.OfferJobs),
  getChangeList: createSelector(getFeatureState, (state) => state.changes),
  getTaskList: createSelector(getFeatureState, (state) => state.tasks),
  getMessage: createSelector(getFeatureState, (state) => state.message),
  getNewsList:  createSelector(getFeatureState, (state) => state.loadNews),
  getConsList: createSelector(getFeatureState, (state) => state.cons),
  getOnBoardList: createSelector(getFeatureState, (state) => state.onBoard),
  getOnJobsList: createSelector(getFeatureState, (state) => state.onJobs),
  getProjectList: createSelector(getFeatureState, (state) => state.project),
  getJobList: createSelector(getFeatureState, (state) => state.Jobs),
  getContractList: createSelector(getFeatureState, (state) => state.Contract),
  getCertificateList: createSelector(getFeatureState, (state) => state.Certificate),
  getUnsuitableJobList: createSelector(getFeatureState, (state) => state.unsuitableJob),
  getSuitableJobList: createSelector(getFeatureState, (state) => state.suitableJob),
  getInvitedJobList: createSelector(getFeatureState, (state) => state.invitedJobs),
  getAssignmentList: createSelector(getFeatureState, (state) => state.AssignmentList),
  getUnconfirmedAttendance: createSelector(getFeatureState, (state) => state.UnconfirmedAttendance)
};
