import { PagedResult } from '../../model/pagination.model';
import { Action } from '@ngrx/store';
import { RoleSearchVM, RoleVM } from '../../model/role.model';

export enum RolesActionTypes {
  UpdateSearch = '[Roles] Update search',
  LoadRoleList = '[Roles] Load Role list',
  LoadRoleListSuccess = '[Roles] Search success',
  LoadRoleListFailed = '[Roles] Search failed',
}

export class UpdateSearch implements Action {
  readonly type = RolesActionTypes.UpdateSearch;
  constructor(public payload: RoleSearchVM) {}
}

export class LoadRoleList implements Action {
  readonly type = RolesActionTypes.LoadRoleList;
  constructor(public payload: RoleSearchVM) {}
}
export class LoadRoleListSuccess implements Action {
  readonly type = RolesActionTypes.LoadRoleListSuccess;
  constructor(public payload: PagedResult<RoleVM>) {}
}
export class LoadRoleListFailed implements Action {
  readonly type = RolesActionTypes.LoadRoleListFailed;
  constructor(public payload: any) {}
}

export type RoleActions =
  // load certificate list
  LoadRoleList | LoadRoleListSuccess | LoadRoleListFailed | UpdateSearch;
