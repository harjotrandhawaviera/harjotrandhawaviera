import { AssignmentActionTypes, AssignmentActions } from './assignment.actions';
import { AssignmentSearchVM, AssignmentVM } from '../../model/assignment.model';

import { BudgetVM } from '../../model/budget.model';
import { DatesVM } from '../../model/dates.model';
import { PaginationVM } from './../../model/pagination.model';

export interface AssignmentState {
  searchModel?: AssignmentSearchVM;
  resultList?: AssignmentVM[];
  assignmentMeta?: any;
  assignment?: AssignmentVM;
  surveyLink?: [];
  budget?: BudgetVM;
  date?: DatesVM;
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): AssignmentState {
  const stored = localStorage.getItem('assignment.search');
  return {
    searchModel: stored !== null ? JSON.parse(stored) : undefined,
    resultList: [],
    surveyLink: [],
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
  action: AssignmentActions
): AssignmentState {
  switch (action.type) {
    case AssignmentActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };

    case AssignmentActionTypes.LoadAssignmentList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };
    case AssignmentActionTypes.LoadAssignmentListSuccess:
      localStorage.setItem(
        'assignment.search',
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
    case AssignmentActionTypes.LoadAssignmentListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };

    case AssignmentActionTypes.LoadAssignmentDetail:
      return {
        ...state,
        loading: true,
        assignment: undefined,
      };
    case AssignmentActionTypes.LoadAssignmentDetailSuccess:
      return {
        ...state,
        loading: true,
        assignment: action.payload,
      };
    case AssignmentActionTypes.LoadBudgetDetail:
      return {
        ...state,
        loading: true,
        budget: undefined,
      };
    case AssignmentActionTypes.LoadBudgetDetailSuccess:
      return {
        ...state,
        loading: false,
        budget: action.payload,
      };
    case AssignmentActionTypes.LoadBudgetDetailFailed:
      return {
        ...state,
        budget: undefined,
      };
    case AssignmentActionTypes.LoadDatesDetail:
      return {
        ...state,
        loading: true,
        date: undefined,
      };
    case AssignmentActionTypes.LoadDatesDetailSuccess:
      return {
        ...state,
        loading: true,
        date: action.payload,
      };
    case AssignmentActionTypes.LoadDatesDetailFailed:
      return {
        ...state,
        date: undefined,
      };
    case AssignmentActionTypes.GetSurveyLink:
      return {
        ...state,
        loading: true,
        surveyLink: []
      };

    case AssignmentActionTypes.GetSurveyLinkSuccess:
      return {
        ...state,
        loading: true,
        surveyLink: action.data
      };
    default:
      return state;
  }
}
