import { DatesActionTypes, DatesActions } from './dates.actions';
import { DatesSearchVM, DatesVM } from '../../model/dates.model';

import { JobVM } from '../../model/job.model';
import { PaginationVM } from './../../model/pagination.model';

export interface DatesState {
  searchModel?: DatesSearchVM;
  resultList?: DatesVM[];
  dates?: DatesVM;
  job?: JobVM;
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): DatesState {
  const stored = localStorage.getItem('dates.search');
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
  action: DatesActions
): DatesState {
  switch (action.type) {
    case DatesActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case DatesActionTypes.LoadDatesList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case DatesActionTypes.LoadDatesListSuccess:
      localStorage.setItem('dates.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case DatesActionTypes.LoadDatesListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };
    case DatesActionTypes.LoadDatesDetail:
      return {
        ...state,
        loading: true,
        dates: undefined,
      };
    case DatesActionTypes.LoadDatesDetailSuccess:
      return {
        ...state,
        loading: true,
        dates: action.payload,
      };
    case DatesActionTypes.LoadJobDetail:
      return {
        ...state,
        loading: true,
        job: undefined,
      };
    case DatesActionTypes.LoadJobDetailSuccess:
      return {
        ...state,
        loading: true,
        job: action.payload,
      };
    default:
      return state;
  }
}
