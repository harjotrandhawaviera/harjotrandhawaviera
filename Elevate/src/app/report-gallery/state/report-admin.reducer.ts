import { Action, createReducer, on } from '@ngrx/store';
import { ReportAdminActions } from './report-admin.actions';
import { ReportAdminList } from '../../model/report-admin';

export const featureKey = 'Report Admin';

export interface ReportAdminState {
  freelancerList: ReportAdminList | ReportAdminList[];
  loading: boolean;
}

export interface ReportAdminAppState {
  [featureKey]: ReportAdminState;
}

export const initialState: ReportAdminState = {
  freelancerList: [],
  loading: false
};

export const ReportAdminReducer = createReducer<ReportAdminState>(
  initialState,
  on(ReportAdminActions.loadAdminFreelancerList, (state, { params } ) => ({
    ...state,
    loading: true
  })),
  on(ReportAdminActions.loadAdminFreelancerListSuccess, (state, { lists } ) => ({
    ...state,
    freelancerList: lists,
    loading: false
  })),
);

// tslint:disable-next-line:typedef
export function reducer(state: ReportAdminState | undefined, action: Action) {
  return ReportAdminReducer(state, action);
}
