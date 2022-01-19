import {
  OrderSearchVM,
  OrderVM,
} from './../../model/order.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';

export enum AdminOrderActionTypes {
  UpdateSearch = '[Admin Order] Update search',
  LoadOrderList = '[Admin Order] Load Order list',
  LoadOrderListSuccess = '[Admin Order] Search success',
  LoadOrderListFailed = '[Admin Order] Search failed',

  LoadOrderDetail = '[Admin Order] Load Order Detail',
  LoadOrderDetailSuccess = '[Admin Order] Order Detail success',
  LoadOrderDetailFailed = '[Admin Order] Order Detail failed',

  ClearOrder = '[Admin Order] Clear Order',
  ClearSearchResult = '[Admin Order] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = AdminOrderActionTypes.UpdateSearch;
  constructor(public payload: OrderSearchVM) {}
}

export class LoadOrderList implements Action {
  readonly type = AdminOrderActionTypes.LoadOrderList;
  constructor(public payload: OrderSearchVM) {}
}
export class LoadOrderListSuccess implements Action {
  readonly type = AdminOrderActionTypes.LoadOrderListSuccess;
  constructor(public payload: PagedResult<OrderVM>) {}
}
export class LoadOrderListFailed implements Action {
  readonly type = AdminOrderActionTypes.LoadOrderListFailed;
  constructor(public payload: any) {}
}

export class ClearSearchResult implements Action {
  readonly type = AdminOrderActionTypes.ClearSearchResult;
  constructor() {}
}

export class ClearOrder implements Action {
  readonly type = AdminOrderActionTypes.ClearOrder;
  constructor() {}
}


export type AdminOrderActions =
  | UpdateSearch
  // load certificate list
  | LoadOrderList
  | LoadOrderListSuccess
  | LoadOrderListFailed
  // clear Order detail
  | ClearOrder
  // clear Order list
  | ClearSearchResult;
