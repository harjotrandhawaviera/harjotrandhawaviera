import {
  BudgetSearchVM,
  BudgetVM,
} from './../../model/budget.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';

export enum BudgetActionTypes {
  UpdateSearch = '[Budget] Update search',
  LoadBudgetList = '[Budget] Load Budget list',
  LoadBudgetListSuccess = '[Budget] Search success',
  LoadBudgetListFailed = '[Budget] Search failed',

  ClearBudget = '[Budget] Clear Budget',
  ClearSearchResult = '[Budget] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = BudgetActionTypes.UpdateSearch;
  constructor(public payload: BudgetSearchVM) {}
}

export class LoadBudgetList implements Action {
  readonly type = BudgetActionTypes.LoadBudgetList;
  constructor(public payload: BudgetSearchVM) {}
}
export class LoadBudgetListSuccess implements Action {
  readonly type = BudgetActionTypes.LoadBudgetListSuccess;
  constructor(public payload: PagedResult<BudgetVM>) {}
}
export class LoadBudgetListFailed implements Action {
  readonly type = BudgetActionTypes.LoadBudgetListFailed;
  constructor(public payload: any) {}
}

export class ClearSearchResult implements Action {
  readonly type = BudgetActionTypes.ClearSearchResult;
  constructor() {}
}

export class ClearBudget implements Action {
  readonly type = BudgetActionTypes.ClearBudget;
  constructor() {}
}


export type BudgetActions =
  | UpdateSearch
  // load certificate list
  | LoadBudgetList
  | LoadBudgetListSuccess
  | LoadBudgetListFailed
  // clear Budget detail
  | ClearBudget
  // clear Budget list
  | ClearSearchResult;
