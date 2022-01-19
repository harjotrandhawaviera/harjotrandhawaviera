import { createAction, props } from '@ngrx/store';
import { DashboardResponse, NewsList } from '../../model/dashboard.model';

const loadDashboardAttendance = createAction('[dashboard] Load Dashboard Attendance List', props<{ attend: string }>());
const loadDashboardAttendanceSuccess = createAction(
  '[dashboard] Load Dashboard Attendance List Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const loadDashboardJobOffer = createAction('[dashboard] Load Dashboard JobOffer List', props<{ attend: string }>());
const loadDashboardJobOfferSuccess = createAction(
  '[dashboard] Load Dashboard JobOffer List Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);

const loadDashboardOnBoarding = createAction('[dashboard] Load Dashboard OnBoarding List', props<{ onboard: string }>());
const loadDashboardOnBoardingSuccess = createAction(
  '[dashboard] Load Dashboard OnBoarding List Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);

const loadDashboardOffers = createAction('[dashboard] Load Dashboard Offers List', props<{ offer: string }>());
const loadDashboardOffersSuccess = createAction(
  '[dashboard] Load Dashboard Offers List Success',
  props<{ list: DashboardResponse[] | DashboardResponse}>()
);

const loadDashboardChanges = createAction('[dashboard] Load Dashboard Change List', props<{ change: string }>());
const loadDashboardChangeSuccess = createAction(
  '[dashboard] Load Dashboard Change List Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);

const loadDashboardTask = createAction('[dashboard] Load Dashboard Task List', props<{ task: string }>());
const loadDashboardTaskSuccess = createAction(
  '[dashboard] Load Dashboard Change Task Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);

const loadMessage = createAction('[news] Load Messages', props<{ msg: string }>());
const loadMessageSuccess = createAction(
  '[news] Load Messages Success',
  props<{ lists: NewsList[] | NewsList }>()
);
const newsList = createAction('[news] Load News List', props<{ msg: string }>());
const newsListSuccess = createAction(
  '[news] Load News List Success',
  props<{ lists: NewsList[] | NewsList }>()
);
const loadDashboardConsultants = createAction('[dashboard] Load Dashboard Cons List', props<{ cons: string }>());
const loadDashboardConsultantsSuccess = createAction(
  '[dashboard] Load Dashboard Change Cons Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);

const loadDashboardCurrentJobs = createAction('[dashboard] Load Dashboard CurrentJobs List', props<{ jobs: string }>());
const loadDashboardCurrentJobsSuccess = createAction(
  '[dashboard] Load Dashboard CurrentJobs List Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);

const loadDashboardProject = createAction('[dashboard] Load Dashboard Project List', props<{ attend: string }>());
const loadDashboardProjectSuccess = createAction(
  '[dashboard] Load Dashboard Project List Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);

const loadDashboardJobs = createAction('[dashboard] Load Dashboard Jobs List', props<{ attend: string }>());
const loadDashboardJobsSuccess = createAction(
  '[dashboard] Load Dashboard Jobs List Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const loadDashboardContract = createAction('[dashboard] Load Dashboard Contract List', props<{ attend: string }>());
const loadDashboardContractSuccess = createAction(
  '[dashboard] Load Dashboard Jobs Contract Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const loadDashboardCertificate = createAction('[dashboard] Load Dashboard Certificate', props<{ attend: string }>());
const loadDashboardCertificateSuccess = createAction(
  '[dashboard] Load Dashboard Certificate Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const loadDashboardUnsuitableJob = createAction('[dashboard] Load Dashboard Unsuitable Job', props<{ attend: string }>());
const loadDashboardUnsuitableJobSuccess = createAction(
  '[dashboard] Load Dashboard Unsuitable Job Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const loadJDashboardSuitableJob = createAction('[dashboard] Load Dashboard Suitable Job', props<{ attend: string }>());
const loadJDashboardSuitableJobSuccess = createAction(
  '[dashboard] Load Dashboard Suitable Job Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const loadDashboardInviteJob = createAction('[dashboard] Load Dashboard Invited Jobs', props<{ attend: string }>());
const loadDashboardInviteJobSuccess = createAction(
  '[dashboard] Load Dashboard Invited Jobs Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const loadDashboardAssignment = createAction('[dashboard] Load Dashboard Assignment ', props<{ attend: string }>());
const loadDashboardAssignmentSuccess = createAction(
  '[dashboard] Load Dashboard Assigment  Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const loadDashboardUnconfirmedAttendance = createAction('[dashboard] Load Dashboard Unconfirmed Attendance ', props<{ attends: string }>());
const loadDashboardUnconfirmedAttendanceSuccess = createAction(
  '[dashboard] Load Dashboard Unconfirmed Attendance Success',
  props<{ list: DashboardResponse[] | DashboardResponse }>()
);
const removeTender = createAction('[news] Remove Tender', props<{ questionId: number }>());
const removeTenderSuccess = createAction('[news] Remove Tender Success', props<{ questionId: number }>());


export const DashboardAction = {
  loadDashboardAttendance,
  loadDashboardAttendanceSuccess,
  loadDashboardOffers,
  loadDashboardOffersSuccess,
  loadDashboardChanges,
  loadDashboardChangeSuccess,
  loadDashboardTask,
  loadDashboardTaskSuccess,
  loadMessage,
  loadMessageSuccess,
  newsList,
  removeTender,
  removeTenderSuccess,
  newsListSuccess,
  loadDashboardConsultants,
  loadDashboardConsultantsSuccess,
  loadDashboardOnBoarding,
  loadDashboardOnBoardingSuccess,
  loadDashboardCurrentJobs,
  loadDashboardCurrentJobsSuccess,
  loadDashboardJobOffer,
  loadDashboardJobOfferSuccess,
  loadDashboardProject,
  loadDashboardProjectSuccess,
  loadDashboardJobs,
  loadDashboardJobsSuccess,
  loadDashboardContract,
  loadDashboardContractSuccess,
  loadDashboardCertificate,
  loadDashboardCertificateSuccess,
  loadDashboardUnsuitableJob,
  loadDashboardUnsuitableJobSuccess,
  loadJDashboardSuitableJob,
  loadJDashboardSuitableJobSuccess,
  loadDashboardInviteJob,
  loadDashboardInviteJobSuccess,
  loadDashboardAssignment,
  loadDashboardAssignmentSuccess,
  loadDashboardUnconfirmedAttendance,
  loadDashboardUnconfirmedAttendanceSuccess
};
