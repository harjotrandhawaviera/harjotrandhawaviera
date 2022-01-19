import { ApprovalRequestSearchVM, ApprovalRequestVM } from './../../model/approval-request.model';
import { EventLogSearchVM, EventLogVM } from './../../model/event-log.model';

import { Action } from '@ngrx/store';
import { PagedResult } from './../../model/pagination.model';

export enum ApprovalActionTypes {
  UpdateSearch = '[Approval] Update search',
  LoadApprovalList = '[Approval] Load Approval list',
  LoadApprovalListSuccess = '[Approval] Search success',
  LoadApprovalListFailed = '[Approval] Search failed',

  UpdateEventLogSearch = '[Event Log] Update Event Log search',
  LoadEventLogList = '[Event Log] Load Event Log list',
  LoadEventLogListSuccess = '[Event Log] Search success',
  LoadEventLogListFailed = '[Event Log] Search failed',

  ClearApproval = '[Approval] Clear Approval',
  ClearSearchResult = '[Approval] Clear search result',

  SendEmail = '[Approval] Send Email ',
  SendEmailSuccess = '[Approval] Send Email Success ',

  LoadUserList = '[Approval] Load User list',
  LoadUserListSuccess = '[Approval] Load User list success',

  UserEmailVerify = '[Approval] User Email Verify',
  UserEmailVerifySuccess = '[Approval] User Email Verify Success ',
}
export class UpdateSearch implements Action {
  readonly type = ApprovalActionTypes.UpdateSearch;
  constructor(public payload: ApprovalRequestSearchVM) { }
}

export class LoadApprovalList implements Action {
  readonly type = ApprovalActionTypes.LoadApprovalList;
  constructor(public payload: ApprovalRequestSearchVM) { }
}
export class LoadApprovalListSuccess implements Action {
  readonly type = ApprovalActionTypes.LoadApprovalListSuccess;
  constructor(public payload: PagedResult<ApprovalRequestVM>) { }
}
export class LoadApprovalListFailed implements Action {
  readonly type = ApprovalActionTypes.LoadApprovalListFailed;
  constructor(public payload: any) { }
}

export class UpdateEventLogSearch implements Action {
  readonly type = ApprovalActionTypes.UpdateEventLogSearch;
  constructor(public payload: EventLogSearchVM) { }
}

export class LoadEventLogList implements Action {
  readonly type = ApprovalActionTypes.LoadEventLogList;
  constructor(public payload: EventLogSearchVM) { }
}
export class LoadEventLogListSuccess implements Action {
  readonly type = ApprovalActionTypes.LoadEventLogListSuccess;
  constructor(public payload: PagedResult<EventLogVM>) { }
}
export class LoadEventLogListFailed implements Action {
  readonly type = ApprovalActionTypes.LoadEventLogListFailed;
  constructor(public payload: any) { }
}

export class ClearSearchResult implements Action {
  readonly type = ApprovalActionTypes.ClearSearchResult;
  constructor() { }
}

export class ClearApproval implements Action {
  readonly type = ApprovalActionTypes.ClearApproval;
  constructor() { }
}

export class SendEmail implements Action{
  readonly type = ApprovalActionTypes.SendEmail;
  constructor(public payload: any) {  }
}

export class SendEmailSuccess implements Action{
  readonly type = ApprovalActionTypes.SendEmailSuccess;
  constructor(public payload: any) {}
}

export class LoadUserList implements Action {
  readonly type = ApprovalActionTypes.LoadUserList;
  constructor(public payload?: any) {}
}
export class LoadUserListSuccess implements Action {
  readonly type = ApprovalActionTypes.LoadUserListSuccess;
  constructor(public payload: any) {}
}

export class UserEmailVerify implements Action{
  readonly type = ApprovalActionTypes.UserEmailVerify;
  constructor(public payload: { id: string }) {  }
}

export class UserEmailVerifySuccess implements Action{
  readonly type = ApprovalActionTypes.UserEmailVerifySuccess;
  constructor(public id: any) {}
}


export type ApprovalActions =
  | UpdateSearch
  | LoadApprovalList
  | LoadApprovalListSuccess
  | LoadApprovalListFailed
  | UpdateEventLogSearch
  | LoadEventLogList
  | LoadEventLogListSuccess
  | LoadEventLogListFailed
  | ClearApproval
  | ClearSearchResult
  | SendEmail
  | SendEmailSuccess
  | LoadUserList
  | LoadUserListSuccess
  | UserEmailVerify
  | UserEmailVerifySuccess;
