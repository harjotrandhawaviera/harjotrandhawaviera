import { AssignmentVM, CheckinsSearchVM } from '../../model/assignment.model';

import { Action } from '@ngrx/store';
import { CheckinVM } from '../../model/checkin.model';
import { PagedResult } from './../../model/pagination.model';

export enum CheckinsActionTypes {
  UpdateSearch = '[Checkins] Update search',
  LoadCheckinsList = '[Checkins] Load checkins list',
  LoadCheckinsListSuccess = '[Checkins] Load checkins list success',
  LoadCheckinsListFailed = '[Checkins] Load checkins list failed',

  // DeleteCheckins = '[Checkins] Delete checkins',
  // DeleteCheckinsFailed = '[Checkins] Delete checkins failed',

  UpdateCheckin = '[Checkins] Update checkin',
  UpdateCheckinSuccess = '[Checkins] Update checkin success',
  UpdateCheckinFailed = '[Checkins] Update checkin failed',

  ClearSearchResult = '[Checkins] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = CheckinsActionTypes.UpdateSearch;
  constructor(public payload: CheckinsSearchVM) {}
}

export class LoadCheckinsList implements Action {
  readonly type = CheckinsActionTypes.LoadCheckinsList;
  constructor(public payload: { search: CheckinsSearchVM }) {}
}
export class LoadCheckinsListSuccess implements Action {
  readonly type = CheckinsActionTypes.LoadCheckinsListSuccess;
  constructor(public payload: PagedResult<AssignmentVM>) {}
}
export class LoadCheckinsListFailed implements Action {
  readonly type = CheckinsActionTypes.LoadCheckinsListFailed;
  constructor(public payload: any) {}
}

// export class DeleteCheckins implements Action {
//   readonly type = CheckinsActionTypes.DeleteCheckins;
//   constructor(public payload: number) {}
// }
// export class DeleteCheckinsFailed implements Action {
//   readonly type = CheckinsActionTypes.DeleteCheckinsFailed;
//   constructor(public payload: any) {}
// }

export class UpdateCheckin implements Action {
  readonly type = CheckinsActionTypes.UpdateCheckin;
  constructor(public payload: { id: number; checkin: CheckinVM }) {}
}
export class UpdateCheckinSuccess implements Action {
  readonly type = CheckinsActionTypes.UpdateCheckinSuccess;
  constructor(public payload: { id: number }) {}
}
export class UpdateCheckinFailed implements Action {
  readonly type = CheckinsActionTypes.UpdateCheckinFailed;
  constructor(public payload: any) {}
}

export class ClearSearchResult implements Action {
  readonly type = CheckinsActionTypes.ClearSearchResult;
  constructor() {}
}

export type CheckinActions =
  | UpdateSearch
  | LoadCheckinsList
  | LoadCheckinsListSuccess
  | LoadCheckinsListFailed
  // | DeleteCheckins
  // | DeleteCheckinsFailed
  | UpdateCheckin
  | UpdateCheckinSuccess
  | UpdateCheckinFailed;
