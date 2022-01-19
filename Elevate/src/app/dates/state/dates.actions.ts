import { DatesSearchVM, DatesVM } from '../../model/dates.model';

import { Action } from '@ngrx/store';
import { JobVM } from '../../model/job.model';
import { PagedResult } from './../../model/pagination.model';

export enum DatesActionTypes {
  UpdateSearch = '[Dates] Update search',
  LoadDatesList = '[Dates] Load dates list',
  LoadDatesListSuccess = '[Dates] Load dates list success',
  LoadDatesListFailed = '[Dates] Load dates list failed',

  DeleteDates = '[Dates] Delete dates',
  DeleteDatesFailed = '[Dates] Delete dates failed',

  LoadDatesDetail = '[Dates] Load dates detail',
  LoadDatesDetailSuccess = '[Dates] Load dates detail success',
  LoadDatesDetailFailed = '[Dates] Load dates detail failed',

  LoadJobDetail = '[Dates] Load job detail',
  LoadJobDetailSuccess = '[Dates] Load job detail success',
  LoadJobDetailFailed = '[Dates] Load job detail failed',

  UpdateDate = '[Date] Update date',
  UpdateDateSuccess = '[Date] Update date success',
  UpdateDateFailed = '[Date] Update date failed',

  CreateDates = '[Date] Create dates',
  CreateDatesSuccess = '[Date] Create dates success',
  CreateDatesFailed = '[Date] Create dates failed',

  ClearSearchResult = '[Dates] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = DatesActionTypes.UpdateSearch;
  constructor(public payload: DatesSearchVM) {}
}

export class LoadDatesList implements Action {
  readonly type = DatesActionTypes.LoadDatesList;
  constructor(public payload: DatesSearchVM) {}
}
export class LoadDatesListSuccess implements Action {
  readonly type = DatesActionTypes.LoadDatesListSuccess;
  constructor(public payload: PagedResult<DatesVM>) {}
}
export class LoadDatesListFailed implements Action {
  readonly type = DatesActionTypes.LoadDatesListFailed;
  constructor(public payload: any) {}
}
export class ClearSearchResult implements Action {
  readonly type = DatesActionTypes.ClearSearchResult;
  constructor() {}
}

export class DeleteDates implements Action {
  readonly type = DatesActionTypes.DeleteDates;
  constructor(public payload: number) {}
}
export class DeleteDatesFailed implements Action {
  readonly type = DatesActionTypes.DeleteDatesFailed;
  constructor(public payload: any) {}
}

export class LoadDatesDetail implements Action {
  readonly type = DatesActionTypes.LoadDatesDetail;
  constructor(public payload: { id: string; mode: string; assignment_id: string }) {}
}
export class LoadDatesDetailSuccess implements Action {
  readonly type = DatesActionTypes.LoadDatesDetailSuccess;
  constructor(public payload: DatesVM) {}
}
export class LoadDatesDetailFailed implements Action {
  readonly type = DatesActionTypes.LoadDatesDetailFailed;
  constructor(public payload: any) {}
}

export class LoadJobDetail implements Action {
  readonly type = DatesActionTypes.LoadJobDetail;
  constructor(public payload: { id: string; mode: string }) {}
}
export class LoadJobDetailSuccess implements Action {
  readonly type = DatesActionTypes.LoadJobDetailSuccess;
  constructor(public payload: JobVM) {}
}
export class LoadJobDetailFailed implements Action {
  readonly type = DatesActionTypes.LoadJobDetailFailed;
  constructor(public payload: any) {}
}

export class UpdateDate implements Action {
  readonly type = DatesActionTypes.UpdateDate;
  constructor(public payload: DatesVM) {}
}
export class UpdateDateSuccess implements Action {
  readonly type = DatesActionTypes.UpdateDateSuccess;
  constructor(public payload: { id: number } ) {}
}
export class UpdateDateFailed implements Action {
  readonly type = DatesActionTypes.UpdateDateFailed;
  constructor(public payload: any) {}
}

export class CreateDates implements Action {
  readonly type = DatesActionTypes.CreateDates;
  constructor(public payload: DatesVM[]) {}
}
export class CreateDatesSuccess implements Action {
  readonly type = DatesActionTypes.CreateDatesSuccess;
  constructor(public payload: {}) {}
}
export class CreateDatesFailed implements Action {
  readonly type = DatesActionTypes.CreateDatesFailed;
  constructor(public payload: any) {}
}

export type DatesActions =
  | UpdateSearch
  | LoadDatesList
  | LoadDatesListSuccess
  | LoadDatesListFailed
  | ClearSearchResult
  | DeleteDates
  | DeleteDatesFailed
  | LoadDatesDetail
  | LoadDatesDetailSuccess
  | LoadDatesDetailFailed
  | LoadJobDetail
  | LoadJobDetailSuccess
  | LoadJobDetailFailed
  | UpdateDate
  | UpdateDateSuccess
  | UpdateDateFailed
  | CreateDates
  | CreateDatesSuccess
  | CreateDatesFailed;
