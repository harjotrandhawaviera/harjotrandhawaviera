import { DashboardAction } from './dashboard.action';
import { DashboardResponse, NewsList } from '../../model/dashboard.model';
import { Action, createReducer, on } from '@ngrx/store';

export const featureKey = 'dashboard';

export interface DashboardState {
  attendance: DashboardResponse | DashboardResponse[];
  offers: DashboardResponse | DashboardResponse[];
  changes: DashboardResponse | DashboardResponse[];
  tasks: DashboardResponse | DashboardResponse[];
  message: NewsList | NewsList[];
  loadNews: NewsList | NewsList[];
  cons: DashboardResponse | DashboardResponse[];
  onBoard: DashboardResponse | DashboardResponse[];
  onJobs: DashboardResponse | DashboardResponse[];
  OfferJobs: DashboardResponse | DashboardResponse[];
  project: DashboardResponse | DashboardResponse[];
  Jobs: DashboardResponse | DashboardResponse[];
  Contract: DashboardResponse | DashboardResponse[];
  Certificate: DashboardResponse | DashboardResponse[];
  unsuitableJob: DashboardResponse | DashboardResponse[];
  suitableJob: DashboardResponse | DashboardResponse[];
  invitedJobs: DashboardResponse | DashboardResponse[];
  AssignmentList: DashboardResponse | DashboardResponse[];
  UnconfirmedAttendance: DashboardResponse | DashboardResponse[];
}
export const initialState: DashboardState = {
  attendance: [],
  offers: [],
  changes: [],
  tasks: [],
  message: [],
  loadNews: [],
  cons: [],
  onBoard: [],
  onJobs: [],
  OfferJobs: [],
  project: [],
  Jobs: [],
  Contract: [],
  Certificate: [],
  unsuitableJob: [],
  suitableJob: [],
  invitedJobs: [],
  AssignmentList: [],
  UnconfirmedAttendance: []
};

export interface DashboardAppState {
  [featureKey]: DashboardState;
}

export const dashboardReducer = createReducer<DashboardState>(
  initialState,
  on(DashboardAction.loadDashboardAttendance, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardAttendanceSuccess, (state,  { list} ) => ( {
    ...state,
    attendance: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardJobOffer, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardJobOfferSuccess, (state,  { list} ) => ( {
    ...state,
    OfferJobs: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardOffers, (state,  { offer } ) => ( {
  ...state,
  loading: true
})),
  on(DashboardAction.loadDashboardOffersSuccess, (state,  { list} ) => ( {
    ...state,
    offers: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardChanges, (state,  { change } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardChangeSuccess, (state,  { list} ) => ( {
    ...state,
    changes: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardTask, (state,  { task } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardTaskSuccess, (state,  { list} ) => ( {
    ...state,
    tasks: list,
    loading: false
  })),
  on(DashboardAction.loadMessage, (state,  { msg } ) => ({
    ...state,
    loading: true
  })),
  on(DashboardAction.loadMessageSuccess, (state, { lists} ) => ({
    ...state,
    message: lists,
    loading: false
  })),
  on(DashboardAction.newsList, (state, { msg } ) => ({
    ...state,
    loading: true
  })),
  on(DashboardAction.newsListSuccess, (state, { lists } ) => ({
    ...state,
    loading: false,
    loadNews: lists
  })),
  on(DashboardAction.loadDashboardConsultants, (state,  { cons } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardConsultantsSuccess, (state,  { list} ) => ( {
    ...state,
    cons: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardOnBoarding, (state,  { onboard } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardOnBoardingSuccess, (state,  { list } ) => ( {
    ...state,
    loading: false,
    onBoard: list,
  })),
  on(DashboardAction.loadDashboardCurrentJobs, (state,  { jobs } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardCurrentJobsSuccess, (state,  { list } ) => ( {
    ...state,
    loading: false,
    onJobs: list,
  })),
  on(DashboardAction.loadDashboardProject, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardProjectSuccess, (state,  { list} ) => ( {
    ...state,
    project: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardJobs, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardJobsSuccess, (state,  { list} ) => ( {
    ...state,
    Jobs: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardContract, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardContractSuccess, (state,  { list} ) => ( {
    ...state,
    Contract: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardCertificate, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardCertificateSuccess, (state,  { list} ) => ( {
    ...state,
    Certificate: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardUnsuitableJob, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardUnsuitableJobSuccess, (state,  { list} ) => ( {
    ...state,
    unsuitableJob: list,
    loading: false
  })),
  on(DashboardAction.loadJDashboardSuitableJob, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadJDashboardSuitableJobSuccess, (state,  { list} ) => ( {
    ...state,
    suitableJob: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardInviteJob, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardInviteJobSuccess, (state,  { list} ) => ( {
    ...state,
    invitedJobs: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardAssignment, (state,  { attend } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardAssignmentSuccess, (state,  { list} ) => ( {
    ...state,
    AssignmentList: list,
    loading: false
  })),
  on(DashboardAction.loadDashboardUnconfirmedAttendance, (state,  { attends } ) => ( {
    ...state,
    loading: true
  })),
  on(DashboardAction.loadDashboardUnconfirmedAttendanceSuccess, (state,  { list} ) => ( {
    ...state,
    UnconfirmedAttendance: list,
    loading: false
  })),
  on(DashboardAction.removeTenderSuccess, (state, { questionId }) => ({
    ...state,
    loading: false
  })),
);


// tslint:disable-next-line:typedef
export function reducer(state: DashboardState | undefined, action: Action) {
  return dashboardReducer(state, action);
}
