import { PagedResult, PaginationVM } from './../../model/pagination.model';
import { UserSearchVM, UserVM } from '../models/user.model';

import { Action } from "@ngrx/store";
import { AgentVM } from '../../model/agent.model';

export enum UserActionTypes {
  UpdateSearch = '[User] Update search',
  LoadUserList = '[User] Load user list',
  LoadUserListSuccess = '[User] Search success',
  LoadUserListFailed = '[User] Search failed',

  DeleteUser = '[User] Delete user',
  DeleteUserFailed = '[User] Delete user failed',

  CreateUser = '[User] Create user',
  CreateUserSuccess = '[User] Create user success',
  CreateUserFailed = '[User] Create user failed',

  LoadUserDetail = '[User] Load user detail',
  LoadUserDetailSuccess = '[User] Load user detail success',
  LoadUserDetailFailed = '[User] Load user detail failed',

  LoadBlockedByUser = '[User] Load blocked by user',
  LoadBlockedByUserSuccess = '[User] Load blocked by user success',
  LoadBlockedByUserFailed = '[User] Load blocked by user failed',

  DeactivateUser = '[User] Deactivate user',
  DeactivateUserSuccess = '[User] Deactivate user success',
  DeactivateUserFailed = '[User] Deactivate user failed',

  ActivateUser = '[User] Activate user',
  ActivateUserFailed = '[User] Activate user failed',

  DisableUser = '[User] Disable user',
  DisableUserFailed = '[User] Disable user failed',

  EnableUser = '[User] Enable user',
  EnableUserFailed = '[User] Enable user failed',

  ClearUserList = '[User] Clear User'
}
export class UpdateSearch implements Action {
  readonly type = UserActionTypes.UpdateSearch;
  constructor(public payload: UserSearchVM) { }
}
export class LoadUserList implements Action {
  readonly type = UserActionTypes.LoadUserList;
  constructor(public payload: UserSearchVM) { }
}
export class LoadUserListSuccess implements Action {
  readonly type = UserActionTypes.LoadUserListSuccess;
  constructor(public payload: PagedResult<UserVM>) { }
}
export class LoadUserListFailed implements Action {
  readonly type = UserActionTypes.LoadUserListFailed;
  constructor(public payload: any) { }
}

export class DeleteUser implements Action {
  readonly type = UserActionTypes.DeleteUser;
  constructor(public payload: number) { }
}
export class DeleteUserFailed implements Action {
  readonly type = UserActionTypes.DeleteUserFailed;
  constructor(public payload: any) { }
}

export class CreateUser implements Action {
  readonly type = UserActionTypes.CreateUser;
  constructor(public payload: { user: UserVM }) { }
}
export class CreateUserSuccess implements Action {
  readonly type = UserActionTypes.CreateUserSuccess;
  constructor(public payload: { id: number }) { }
}
export class CreateUserFailed implements Action {
  readonly type = UserActionTypes.CreateUserFailed;
  constructor(public payload: any) { }
}

export class LoadUserDetail implements Action {
  readonly type = UserActionTypes.LoadUserDetail;
  constructor(public payload: string) { }
}
export class LoadUserDetailSuccess implements Action {
  readonly type = UserActionTypes.LoadUserDetailSuccess;
  constructor(public payload: UserVM) { }
}
export class LoadUserDetailFailed implements Action {
  readonly type = UserActionTypes.LoadUserDetailFailed;
  constructor(public payload: any) { }
}

export class LoadBlockedByUser implements Action {
  readonly type = UserActionTypes.LoadBlockedByUser;
  constructor(public payload: string) { }
}
export class LoadBlockedByUserSuccess implements Action {
  readonly type = UserActionTypes.LoadBlockedByUserSuccess;
  constructor(public payload: UserVM) { }
}
export class LoadBlockedByUserFailed implements Action {
  readonly type = UserActionTypes.LoadBlockedByUserFailed;
  constructor(public payload: any) { }
}

export class DeactivateUser implements Action {
  readonly type = UserActionTypes.DeactivateUser;
  constructor(public payload: {id: string, reason: string}) { }
}
export class DeactivateUserFailed implements Action {
  readonly type = UserActionTypes.DeactivateUserFailed;
  constructor(public payload: any) { }
}

export class ActivateUser implements Action {
  readonly type = UserActionTypes.ActivateUser;
  constructor(public payload: string) { }
}
export class ActivateUserFailed implements Action {
  readonly type = UserActionTypes.ActivateUserFailed;
  constructor(public payload: any) { }
}

export class DisableUser implements Action {
  readonly type = UserActionTypes.DisableUser;
  constructor(public payload: {id: string, reason: string}) { }
}
export class DisableUserFailed implements Action {
  readonly type = UserActionTypes.DisableUserFailed;
  constructor(public payload: any) { }
}

export class EnableUser implements Action {
  readonly type = UserActionTypes.EnableUser;
  constructor(public payload: string) { }
}
export class EnableUserFailed implements Action {
  readonly type = UserActionTypes.EnableUserFailed;
  constructor(public payload: any) { }
}

export class ClearUserList implements Action {
  readonly type = UserActionTypes.ClearUserList;
  constructor() { }
}

export type UserActions = UpdateSearch
  | LoadUserList
  | LoadUserListSuccess
  | LoadUserListFailed

  | DeleteUser
  | DeleteUserFailed

  | CreateUser
  | CreateUserSuccess
  | CreateUserFailed

  | LoadUserDetail
  | LoadUserDetailSuccess
  | LoadUserDetailFailed

  | LoadBlockedByUser
  | LoadBlockedByUserSuccess
  | LoadBlockedByUserFailed

  | DeactivateUser
  | DeactivateUserFailed
  | ActivateUser
  | ActivateUserFailed

  | DisableUser
  | DisableUserFailed
  | EnableUser
  | EnableUserFailed

  | ClearUserList;
