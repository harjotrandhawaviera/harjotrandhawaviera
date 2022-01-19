import * as fromProfile from './profile.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  profile: fromProfile.ProfileState;
}

const getProfileFeatureState = createFeatureSelector<fromProfile.ProfileState>(
  'profile'
);
export const getLoading = createSelector(
  getProfileFeatureState,
  (state) => state.loading
);

export const getProfileDetail = createSelector(
  getProfileFeatureState,
  (state) => state.freelancer
);
export const getFreelancerAssignment = createSelector(
  getProfileFeatureState,
  (state) => state.freelancerAssignment
);
