import {
  InvoiceSearchVM,
  InvoiceVM,
} from './../../model/invoice.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';

export enum InvoiceActionTypes {
  UpdateSearch = '[Invoice] Update search',
  LoadInvoiceList = '[Invoice] Load Invoice list',
  LoadInvoiceListSuccess = '[Invoice] Search success',
  LoadInvoiceListFailed = '[Invoice] Search failed',

  ClearInvoice = '[Invoice] Clear Invoice',
  ClearSearchResult = '[Invoice] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = InvoiceActionTypes.UpdateSearch;
  constructor(public payload: InvoiceSearchVM) {}
}

export class LoadInvoiceList implements Action {
  readonly type = InvoiceActionTypes.LoadInvoiceList;
  constructor(public payload: InvoiceSearchVM) {}
}
export class LoadInvoiceListSuccess implements Action {
  readonly type = InvoiceActionTypes.LoadInvoiceListSuccess;
  constructor(public payload: PagedResult<InvoiceVM>) {}
}
export class LoadInvoiceListFailed implements Action {
  readonly type = InvoiceActionTypes.LoadInvoiceListFailed;
  constructor(public payload: any) {}
}

export class ClearSearchResult implements Action {
  readonly type = InvoiceActionTypes.ClearSearchResult;
  constructor() {}
}

export class ClearInvoice implements Action {
  readonly type = InvoiceActionTypes.ClearInvoice;
  constructor() {}
}


export type InvoiceActions =
  | UpdateSearch
  // load certificate list
  | LoadInvoiceList
  | LoadInvoiceListSuccess
  | LoadInvoiceListFailed
  // clear Invoice detail
  | ClearInvoice
  // clear Invoice list
  | ClearSearchResult;
