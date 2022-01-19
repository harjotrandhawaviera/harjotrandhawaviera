import { AssignmentVM, CheckinsSearchVM } from '../../model/assignment.model';
import { CheckinActions, CheckinsActionTypes } from './checkins.actions';

import { PaginationVM } from './../../model/pagination.model';

export interface CheckinState {
  searchModel?: CheckinsSearchVM;
  resultList?: AssignmentVM[];
  assignmentMeta?: any;
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): CheckinState {
  const stored = localStorage.getItem('checkin.search');
  return {
    searchModel: stored !== null ? JSON.parse(stored) : undefined,
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
  action: CheckinActions
): CheckinState {
  switch (action.type) {
    case CheckinsActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };

    case CheckinsActionTypes.LoadCheckinsList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };
    case CheckinsActionTypes.LoadCheckinsListSuccess:
      localStorage.setItem(
        'checkin.search',
        JSON.stringify(state.searchModel)
      );
      return {
        ...state,
        resultList: action.payload.list,
        assignmentMeta: action.payload.meta,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };
    case CheckinsActionTypes.LoadCheckinsListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };

    default:
      return state;
  }
}
