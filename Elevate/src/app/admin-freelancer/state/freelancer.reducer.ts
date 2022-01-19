import { FreelancerActionTypes, FreelancerActions } from './freelancer.actions';
import { FreelancerSearchVM, FreelancerVM } from './../../model/freelancer.model';

import { PaginationVM } from './../../model/pagination.model';

export interface FreelancerState {
  searchModel?: FreelancerSearchVM;
  resultList?: FreelancerVM[];
  loading: boolean;
  noRecord: boolean;
  userList?: [];
  pageInfo?: PaginationVM;
}

function initialState(): FreelancerState {
  const stored = localStorage.getItem('freelancer.search');
  return {
    searchModel: stored !== null && stored !== undefined && stored !== 'null' && stored !== 'undefined' ? JSON.parse(stored) : undefined,
    resultList: [],
    loading: false,
    noRecord: false,
    pageInfo: {
      total: 0,
      current_page: 1,
      total_pages: 0,
    },
  };
}
export function reducer(
  state = initialState(),
  action: FreelancerActions
): FreelancerState {
  switch (action.type) {
    case FreelancerActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case FreelancerActionTypes.LoadFreelancerList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case FreelancerActionTypes.LoadFreelancerListSuccess:
      localStorage.setItem('freelancer.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case FreelancerActionTypes.LoadFreelancerListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };

    case FreelancerActionTypes.LoadUserList:
      return  {
        ...state,
        loading: true,
        userList: [],
      };

    case FreelancerActionTypes.LoadUserListSuccess:
      return {
        ...state,
        userList: action.payload
      };

    // case FreelancerActionTypes.LoadFreelancerDetail:
    //   return {
    //     ...state,
    //     freelancer: undefined,
    //   };
    // case FreelancerActionTypes.LoadFreelancerDetailSuccess: {

    // }
    // case FreelancerActionTypes.LoadFreelancerDetailFailed:
    //   return {
    //     ...state,
    //     freelancer: undefined,
    //   };
    // case FreelancerActionTypes.NewFreelancerDetail:
    //   return {
    //     ...state,
    //     freelancer: {},
    //   };
    default:
      return state;
  }
}
