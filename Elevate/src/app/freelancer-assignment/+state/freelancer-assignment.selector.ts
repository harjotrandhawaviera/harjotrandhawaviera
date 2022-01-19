import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FreelancerAssignmentState, featureKey } from './freelancer-assignment.reducer';

export const getFeatureState = createFeatureSelector<FreelancerAssignmentState>(featureKey);

export const fromFreelancerAssignment = {
  getCallList: createSelector(getFeatureState, (state) => state.call),
  getLoading: createSelector(getFeatureState, (state) => state.loading),
  getFreelancerDetails: createSelector(getFeatureState, (state) => state.FreelancerAssignmentDetail),
};
