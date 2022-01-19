import { createAction, props } from '@ngrx/store';
import { freelancerAssignmentResponse } from '../../model/freelancer-assignment.model';


const loadFreelancerAssignment  = createAction('[FreelancerAssignment] Load Freelancer Assignment  ', props<{ attend: string }>());
const loadFreelancerAssignmentSuccess = createAction(
  '[FreelancerAssignment] Load Freelancer Assignment Success',
  props<{ list: freelancerAssignmentResponse[] | freelancerAssignmentResponse }>()
);

const freelancerAssignmentDetail = createAction('[FreelancerAssignment] Freelancer Assignment Details', props<{ paramId: number, updateFreelancerAssignmentValue: string }>());
const freelancerAssignmentDetailSuccess = createAction(
  '[FreelancerAssignment]  Freelancer Assignment Details Success',
  props<{ list: freelancerAssignmentResponse[] | freelancerAssignmentResponse }>()
);


export const FreelancerAction = {
  loadFreelancerAssignment,
  loadFreelancerAssignmentSuccess,
  freelancerAssignmentDetail,
  freelancerAssignmentDetailSuccess
};
