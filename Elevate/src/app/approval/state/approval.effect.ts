import * as fromApprovalAction from './approval.actions';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap
} from 'rxjs/operators';

import { Action } from '@ngrx/store';
import { ApprovalRequestMappingService } from './../../services/mapping-services/apparoval-request-mapping.service';
import { ApprovalRequestResponse } from './../../model/approval-request.response';
import { ApprovalRequestService } from './../../services/approval-request.service';
import { EventLogMappingService } from './../../services/mapping-services/event-log-mapping.service';
import { EventLogResponse } from './../../model/event-log.response';
import { EventLogService } from './../../services/event-log.service';
import { Injectable } from '@angular/core';
import { MultipleResponse } from './../../model/response';

@Injectable()
export class ApprovalEffect {
  constructor(
    private approvalRequestService: ApprovalRequestService,
    private eventLogService: EventLogService,
    private actions$: Actions,
    private approvalRequestMappingService: ApprovalRequestMappingService,
    private eventLogMappingService: EventLogMappingService
  ) {}

  @Effect()
  loadRequestList$: Observable<Action> = this.actions$.pipe(
    ofType(fromApprovalAction.ApprovalActionTypes.LoadApprovalList),
    map((action: fromApprovalAction.LoadApprovalList) => action.payload),
    switchMap((payload) =>
      this.approvalRequestService
        .getApprovalRequests(this.approvalRequestMappingService.searchRequest(payload))
        .pipe(
          map((approvalRes: MultipleResponse<ApprovalRequestResponse>) => {
            return new fromApprovalAction.LoadApprovalListSuccess(
              this.approvalRequestMappingService.approvalRequestMultipleResponseToVM(
                approvalRes
              )
            );
          }),
          catchError((err) =>
            of(new fromApprovalAction.LoadApprovalListFailed(err))
          )
        )
    )
  );
  @Effect()
  loadEventLogList$: Observable<Action> = this.actions$.pipe(
    ofType(fromApprovalAction.ApprovalActionTypes.LoadEventLogList),
    map((action: fromApprovalAction.LoadEventLogList) => action.payload),
    switchMap((payload) =>
      this.eventLogService
        .getEventLogs(this.eventLogMappingService.searchRequest(payload))
        .pipe(
          map((approvalRes: MultipleResponse<EventLogResponse>) => {
            return new fromApprovalAction.LoadEventLogListSuccess(
              this.eventLogMappingService.eventLogMultipleResponseToVM(
                approvalRes
              )
            );
          }),
          catchError((err) =>
            of(new fromApprovalAction.LoadEventLogListFailed(err))
          )
        )
    )
  );

  @Effect()
  SendEmail$: Observable<Action> = this.actions$.pipe(
    ofType(fromApprovalAction.ApprovalActionTypes.SendEmail),
    mergeMap((action: any ) => this.approvalRequestService.approveFreelancer(action?.payload).pipe(
      (map(newFreelancers => (new fromApprovalAction.SendEmailSuccess({data: newFreelancers})))))
  )
  );

  @Effect()
  userList$: Observable<Action> = this.actions$.pipe(
    ofType(fromApprovalAction.ApprovalActionTypes.LoadUserList),
    mergeMap((page) => this.approvalRequestService.userList(page).pipe(
      (map(userList => (new fromApprovalAction.LoadUserListSuccess({data: userList}))))
    ))
  );

  @Effect()
  UserEmailVerify$: Observable<Action> = this.actions$.pipe(
    ofType(fromApprovalAction.ApprovalActionTypes.UserEmailVerify),
    mergeMap((action: any ) => this.approvalRequestService.getUserEmail(action?.payload?.id).pipe(
      (map(email => (new fromApprovalAction.UserEmailVerifySuccess({data: email})))))
    )
  );
}
