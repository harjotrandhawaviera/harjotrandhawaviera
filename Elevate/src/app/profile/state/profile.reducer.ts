import { FreelancerVM, FreelancerAssignmentVM } from './../../model/freelancer.model';
import { ProfileActions, ProfileActionTypes } from './profile.actions';


export interface ProfileState {
  freelancer?: FreelancerVM;
  freelancerAssignment?: FreelancerAssignmentVM;
  loading: boolean;
}
function initialState(): ProfileState {
  return {
    freelancer: undefined,
    freelancerAssignment: undefined,
    loading: false,
  };
}
export function reducer(
  state = initialState(),
  action: ProfileActions
): ProfileState {
  switch (action.type) {
    case ProfileActionTypes.LoadProfileDetail:
      return {
        ...state,
        freelancer: undefined,
        loading: true,
      };
    case ProfileActionTypes.LoadProfileDetailSuccess: {
      const freelancer = action.payload.profile;
      const mode = action.payload.mode;
      return {
        ...state,
        freelancer: freelancer,
      };
    }
    case ProfileActionTypes.LoadFreelancerAssignment:
      return {
        ...state,
        freelancerAssignment: undefined,
        loading: true,
      };
    case ProfileActionTypes.LoadFreelancerAssignmentSuccess: {
      const freelancerAssignment = action.payload.freelancerAssignment;
      const mode = action.payload.mode;
      return {
        ...state,
        freelancerAssignment: freelancerAssignment,
      };
    }
    default:
      return state;
  }
}
