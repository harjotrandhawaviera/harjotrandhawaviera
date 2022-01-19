import { FreelancerAction } from './freelancer-assignment.action';

import { Action, createReducer, on } from '@ngrx/store';
import { freelancerAssignmentResponse } from '../../model/freelancer-assignment.model';

export const featureKey = 'freelancer-assignment';

export interface FreelancerAssignmentState {
  call: freelancerAssignmentResponse | freelancerAssignmentResponse[];
  FreelancerAssignmentDetail: freelancerAssignmentResponse | freelancerAssignmentResponse[];
  loading: boolean;
}

export const initialState: FreelancerAssignmentState = {
  call: [],
  FreelancerAssignmentDetail: [],
  loading: false,
};

export interface FreelancerAssignmentAppState {
  [featureKey]: FreelancerAssignmentState;
}

export const FreelancerAssignmentReducer = createReducer<FreelancerAssignmentState>(
  initialState,
  on(FreelancerAction.loadFreelancerAssignment, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(FreelancerAction.loadFreelancerAssignmentSuccess, (state,  { list} ) => ( {
    ...state,
    call: list,
    loading: false
  })),
  on(FreelancerAction.freelancerAssignmentDetail, (state, {paramId, updateFreelancerAssignmentValue}) => ({
    ...state,
    loading: true
  })),
  on(FreelancerAction.freelancerAssignmentDetailSuccess, (state, {list}) => ({
    ...state,
    loading: false,
    FreelancerAssignmentDetail: list
  })),
);

// tslint:disable-next-line:typedef
export function reducer(state: FreelancerAssignmentState | undefined, action: Action) {
  return FreelancerAssignmentReducer(state, action);
}
