import { AdminBudgetActionTypes, AdminBudgetActions } from './admin-budget.actions';
import { BudgetSearchVM, BudgetVM } from './../../model/budget.model';

import { PaginationVM } from './../../model/pagination.model';

export interface BudgetState {
  searchModel?: BudgetSearchVM;
  resultList?: BudgetVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): BudgetState {
  const stored = localStorage.getItem('admin.budget.search');
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
  action: AdminBudgetActions
): BudgetState {
  switch (action.type) {
    case AdminBudgetActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case AdminBudgetActionTypes.LoadBudgetList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case AdminBudgetActionTypes.LoadBudgetListSuccess:
      if (state.searchModel) {
        localStorage.setItem('admin.budget.search', JSON.stringify(state.searchModel));
      } else {
        localStorage.removeItem('admin.budget.search');
      }
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case AdminBudgetActionTypes.LoadBudgetListFailed:
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
