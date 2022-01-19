import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReportAdminState, featureKey } from './report-admin.reducer';
export const getFeatureState = createFeatureSelector<ReportAdminState>(featureKey);

export const fromReportAdmin = {
  getFreelancerList: createSelector(getFeatureState, (state) => state.freelancerList),
  getLoaderValue: createSelector(getFeatureState, (state) => state?.loading)
};
