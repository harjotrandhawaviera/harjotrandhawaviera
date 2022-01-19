import { InvoiceActionTypes, InvoiceActions } from './invoice.actions';
import { InvoiceSearchVM, InvoiceVM } from './../../model/invoice.model';

import { PaginationVM } from './../../model/pagination.model';

export interface InvoiceState {
  searchModel?: InvoiceSearchVM;
  resultList?: InvoiceVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): InvoiceState {
  const stored = localStorage.getItem('invoice.search');
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
  action: InvoiceActions
): InvoiceState {
  switch (action.type) {
    case InvoiceActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case InvoiceActionTypes.LoadInvoiceList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case InvoiceActionTypes.LoadInvoiceListSuccess:
      if (state.searchModel) {
        localStorage.setItem('admin.invoice.search', JSON.stringify(state.searchModel));
      } else {
        localStorage.removeItem('admin.invoice.search');
      }
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case InvoiceActionTypes.LoadInvoiceListFailed:
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
