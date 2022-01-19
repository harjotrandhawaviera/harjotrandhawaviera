import { AdminOrderActionTypes, AdminOrderActions } from './admin-order.actions';
import { OrderSearchVM, OrderVM } from './../../model/order.model';

import { PaginationVM } from './../../model/pagination.model';

export interface OrderState {
  searchModel?: OrderSearchVM;
  resultList?: OrderVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): OrderState {
  const stored = localStorage.getItem('admin.order.search');
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
  action: AdminOrderActions
): OrderState {
  switch (action.type) {
    case AdminOrderActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case AdminOrderActionTypes.LoadOrderList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case AdminOrderActionTypes.LoadOrderListSuccess:
      if (state.searchModel) {
        localStorage.setItem('admin.order.search', JSON.stringify(state.searchModel));
      } else {
        localStorage.removeItem('admin.order.search');
      }
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case AdminOrderActionTypes.LoadOrderListFailed:
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
