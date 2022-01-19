import { AssignmentSearchVM, AssignmentVM } from '../../model/assignment.model';
import { CustomerAssignmentActionTypes, CustomerAssignmentActions } from './customer-assignment.actions';

import { BudgetVM } from '../../model/budget.model';
import { PaginationVM } from './../../model/pagination.model';

export interface AssignmentState {
  searchModel?: AssignmentSearchVM;
  resultList?: AssignmentVM[];
  assignmentMeta?: any;
  assignment?: AssignmentVM;
  budget?: BudgetVM;
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): AssignmentState {
  const stored = localStorage.getItem('customer-assignment.search');
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
  action: CustomerAssignmentActions
): AssignmentState {
  switch (action.type) {
    case CustomerAssignmentActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };

    case CustomerAssignmentActionTypes.LoadCustomerAssignmentList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };
    case CustomerAssignmentActionTypes.LoadCustomerAssignmentListSuccess:
      localStorage.setItem(
        'customer-assignment.search',
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
    case CustomerAssignmentActionTypes.LoadCustomerAssignmentListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };

    case CustomerAssignmentActionTypes.LoadCustomerAssignmentDetail:
      return {
        ...state,
        loading: true,
        assignment: undefined,
      };
    case CustomerAssignmentActionTypes.LoadCustomerAssignmentDetailSuccess:
      return {
        ...state,
        loading: true,
        assignment: action.payload,
      };
    case CustomerAssignmentActionTypes.LoadBudgetDetail:
      return {
        ...state,
        loading: true,
        budget: undefined,
      };
    case CustomerAssignmentActionTypes.LoadBudgetDetailSuccess:
      return {
        ...state,
        loading: false,
        budget: action.payload,
      };
    case CustomerAssignmentActionTypes.LoadBudgetDetailFailed:
      return {
        ...state,
        budget: undefined,
      };

    default:
      return state;
  }
}
