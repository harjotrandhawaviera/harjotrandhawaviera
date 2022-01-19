import { UserActionTypes, UserActions } from './user.actions';
import { UserSearchVM, UserVM } from '../models/user.model';

import { PaginationVM } from './../../model/pagination.model';

export interface UserState {
  searchModel?: UserSearchVM;
  resultList?: UserVM[];
  userDetail?: UserVM;
  blockedByUser?: UserVM;
  loading: boolean;
  pageInfo?: PaginationVM;
}
function initialState(): UserState {
  const stored = localStorage.getItem('user.search');
  return {
    searchModel: stored !== null ? JSON.parse(stored) : undefined,
    resultList: [],
    loading: false,
    pageInfo: {
      total: 0,
      current_page: 1,
      total_pages: 0,
    },
  };
}
export function reducer(
  state = initialState(),
  action: UserActions
): UserState {
  switch (action.type) {
    case UserActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case UserActionTypes.LoadUserList:
      return {
        ...state,
        loading: true,
      };
    case UserActionTypes.LoadUserListSuccess:
      localStorage.setItem('user.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        loading: false,
      };
    case UserActionTypes.LoadUserListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };
    case UserActionTypes.LoadUserDetail:
      return {
        ...state,
        loading: true,
        userDetail: undefined,
      };
    case UserActionTypes.LoadUserDetailSuccess:
      return {
        ...state,
        loading: true,
        userDetail: action.payload,
      };
    case UserActionTypes.LoadBlockedByUser:
      return {
        ...state,
        loading: true,
        blockedByUser: undefined,
      };
    case UserActionTypes.LoadBlockedByUserSuccess:
      return {
        ...state,
        loading: true,
        blockedByUser: action.payload,
      };
    case UserActionTypes.LoadUserDetailFailed:
      return {
        ...state,
        userDetail: undefined,
        loading: false,
      };
    case UserActionTypes.LoadBlockedByUserFailed:
      return {
        ...state,
        blockedByUser: undefined,
        loading: false,
      };
    case UserActionTypes.ClearUserList:
      return {
        ...state,
        resultList: [],
        userDetail: undefined,
        blockedByUser: undefined,
        loading: false,
      };
    default:
      return state;
  }
}
