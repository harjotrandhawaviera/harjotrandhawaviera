import { AssignmentSearchVM, AssignmentVM, CustomerAssignmentSearchVM } from '../../model/assignment.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';
import { BudgetVM } from '../../model/budget.model';
import { CheckinVM } from '../../model/checkin.model';

export enum CustomerAssignmentActionTypes {
  UpdateSearch = '[Customer Assignment] Update search',
  LoadCustomerAssignmentList = '[Customer Assignment] Load customer assignment list',
  LoadCustomerAssignmentListSuccess = '[Customer Assignment] Load customer assignment list success',
  LoadCustomerAssignmentListFailed = '[Customer Assignment] Load customer assignment list failed',

  DeleteCustomerAssignment = '[Customer Assignment] Delete customer assignment',
  DeleteCustomerAssignmentFailed = '[Customer Assignment] Delete customer assignment failed',

  UpdateCustomerAssignment = '[Customer Assignment] Update customer assignment',
  UpdateCustomerAssignmentSuccess = '[Customer Assignment] Update customer assignment success',
  UpdateCustomerAssignmentFailed = '[Customer Assignment] Update customer assignment failed',

  UpdateCheckin = '[Customer Assignment] Update checkin',
  UpdateCheckinSuccess = '[Customer Assignment] Update checkin success',
  UpdateCheckinFailed = '[Customer Assignment] Update checkin failed',

  LoadCustomerAssignmentDetail = '[Customer Assignment] Load assignment detail',
  LoadCustomerAssignmentDetailSuccess = '[Customer Assignment] Load assignment detail success',
  LoadCustomerAssignmentDetailFailed = '[Customer Assignment] Load assignment detail failed',

  LoadBudgetDetail = '[Customer Assignment] Load budget detail',
  LoadBudgetDetailSuccess = '[Customer Assignment] Load budget detail success',
  LoadBudgetDetailFailed = '[Customer Assignment] Load budget detail failed',

  ClearSearchResult = '[Customer Assignment] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = CustomerAssignmentActionTypes.UpdateSearch;
  constructor(public payload: CustomerAssignmentSearchVM) {}
}

export class LoadCustomerAssignmentList implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadCustomerAssignmentList;
  constructor(public payload: { search: CustomerAssignmentSearchVM }) {}
}
export class LoadCustomerAssignmentListSuccess implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadCustomerAssignmentListSuccess;
  constructor(public payload: PagedResult<AssignmentVM>) {}
}
export class LoadCustomerAssignmentListFailed implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadCustomerAssignmentListFailed;
  constructor(public payload: any) {}
}

export class DeleteCustomerAssignment implements Action {
  readonly type = CustomerAssignmentActionTypes.DeleteCustomerAssignment;
  constructor(public payload: number) {}
}
export class DeleteCustomerAssignmentFailed implements Action {
  readonly type = CustomerAssignmentActionTypes.DeleteCustomerAssignmentFailed;
  constructor(public payload: any) {}
}

export class UpdateCustomerAssignment implements Action {
  readonly type = CustomerAssignmentActionTypes.UpdateCustomerAssignment;
  constructor(public payload: { id: number; assignment: AssignmentVM }) {}
}
export class UpdateCustomerAssignmentSuccess implements Action {
  readonly type = CustomerAssignmentActionTypes.UpdateCustomerAssignmentSuccess;
  constructor(public payload: { id: number }) {}
}
export class UpdateCustomerAssignmentFailed implements Action {
  readonly type = CustomerAssignmentActionTypes.UpdateCustomerAssignmentFailed;
  constructor(public payload: any) {}
}

export class UpdateCheckin implements Action {
  readonly type = CustomerAssignmentActionTypes.UpdateCheckin;
  constructor(public payload: { id: number; checkin: CheckinVM }) {}
}
export class UpdateCheckinSuccess implements Action {
  readonly type = CustomerAssignmentActionTypes.UpdateCheckinSuccess;
  constructor(public payload: { id: number }) {}
}
export class UpdateCheckinFailed implements Action {
  readonly type = CustomerAssignmentActionTypes.UpdateCheckinFailed;
  constructor(public payload: any) {}
}

export class LoadCustomerAssignmentDetail implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadCustomerAssignmentDetail;
  constructor(public payload: string) {}
}
export class LoadCustomerAssignmentDetailSuccess implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadCustomerAssignmentDetailSuccess;
  constructor(public payload: AssignmentVM) {}
}
export class LoadCustomerAssignmentDetailFailed implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadCustomerAssignmentDetailFailed;
  constructor(public payload: any) {}
}

export class LoadBudgetDetail implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadBudgetDetail;
  constructor(public payload: number) {}
}
export class LoadBudgetDetailSuccess implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadBudgetDetailSuccess;
  constructor(public payload: BudgetVM) {}
}
export class LoadBudgetDetailFailed implements Action {
  readonly type = CustomerAssignmentActionTypes.LoadBudgetDetailFailed;
  constructor(public payload: any) {}
}

export class ClearSearchResult implements Action {
  readonly type = CustomerAssignmentActionTypes.ClearSearchResult;
  constructor() {}
}

export type CustomerAssignmentActions =
  | UpdateSearch
  | LoadCustomerAssignmentList
  | LoadCustomerAssignmentListSuccess
  | LoadCustomerAssignmentListFailed
  | DeleteCustomerAssignment
  | DeleteCustomerAssignmentFailed
  | UpdateCustomerAssignment
  | UpdateCustomerAssignmentSuccess
  | UpdateCustomerAssignmentFailed
  | UpdateCheckin
  | UpdateCheckinSuccess
  | UpdateCheckinFailed
  | LoadCustomerAssignmentDetail
  | LoadCustomerAssignmentDetailSuccess
  | LoadCustomerAssignmentDetailFailed
  | LoadBudgetDetail
  | LoadBudgetDetailSuccess
  | LoadBudgetDetailFailed;
