import { createAction, props } from '@ngrx/store';
import { ReportAdminList } from '../../model/report-admin';

const loadAdminFreelancerList = createAction('[Report Admin] Load Admin Freelancer List', props<{ params: string }>());
const loadAdminFreelancerListSuccess = createAction(
  '[Report Admin] Load Admin Freelancer Success',
  props<{ lists: ReportAdminList[] | ReportAdminList }>()
);

export const ReportAdminActions = {
  loadAdminFreelancerList,
  loadAdminFreelancerListSuccess
}
