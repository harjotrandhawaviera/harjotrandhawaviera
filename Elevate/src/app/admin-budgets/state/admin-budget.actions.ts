import {
  BudgetSearchVM,
  BudgetVM,
} from './../../model/budget.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';

export enum AdminBudgetActionTypes {
  UpdateSearch = '[Admin Budget] Update search',
  LoadBudgetList = '[Admin Budget] Load Budget list',
  LoadBudgetListSuccess = '[Admin Budget] Search success',
  LoadBudgetListFailed = '[Admin Budget] Search failed',

  LoadBudgetDetail = '[Admin Budget] Load Budget Detail',
  LoadBudgetDetailSuccess = '[Admin Budget] Budget Detail success',
  LoadBudgetDetailFailed = '[Admin Budget] Budget Detail failed',

  ClearBudget = '[Admin Budget] Clear Budget',
  ClearSearchResult = '[Admin Budget] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = AdminBudgetActionTypes.UpdateSearch;
  constructor(public payload: BudgetSearchVM) {}
}

export class LoadBudgetList implements Action {
  readonly type = AdminBudgetActionTypes.LoadBudgetList;
  constructor(public payload: BudgetSearchVM) {}
}
export class LoadBudgetListSuccess implements Action {
  readonly type = AdminBudgetActionTypes.LoadBudgetListSuccess;
  constructor(public payload: PagedResult<BudgetVM>) {}
}
export class LoadBudgetListFailed implements Action {
  readonly type = AdminBudgetActionTypes.LoadBudgetListFailed;
  constructor(public payload: any) {}
}

export class ClearSearchResult implements Action {
  readonly type = AdminBudgetActionTypes.ClearSearchResult;
  constructor() {}
}

export class ClearBudget implements Action {
  readonly type = AdminBudgetActionTypes.ClearBudget;
  constructor() {}
}


export type AdminBudgetActions =
  | UpdateSearch
  // load certificate list
  | LoadBudgetList
  | LoadBudgetListSuccess
  | LoadBudgetListFailed
  // clear Budget detail
  | ClearBudget
  // clear Budget list
  | ClearSearchResult;
