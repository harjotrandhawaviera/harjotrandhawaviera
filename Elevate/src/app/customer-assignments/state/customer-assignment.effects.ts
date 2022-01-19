import * as fromAssignment from './index';
import * as fromAssignmentAction from './customer-assignment.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultipleResponse, SingleResponse } from './../../model/response';
import { Observable, forkJoin, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';

import { AssignmentMappingService } from '../../services/mapping-services/assignment-mapping.service';
import { AssignmentResponse } from '../../model/assignment.response';
import { AssignmentSearchVM } from '../../model/assignment.model';
import { AssignmentService } from '../../services/assignment.service';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Injectable()
export class CustomerAssignmentEffect {
  constructor(
    private assignmentService: AssignmentService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private store: Store<fromAssignment.State>,
    private actions$: Actions,
    private assignmentMappingService: AssignmentMappingService,
  ) {}

  @Effect()
  loadCustomerAssignmentsList$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.CustomerAssignmentActionTypes.LoadCustomerAssignmentList),
    map((action: fromAssignmentAction.LoadCustomerAssignmentList) => action.payload),
    switchMap((payload) =>
      this.assignmentService
        .getAssignments(
          this.assignmentMappingService.customerAssignmentsearchRequest(
            payload.search
          )
        )
        .pipe(
          map((res: MultipleResponse<AssignmentResponse>) => {
            return new fromAssignmentAction.LoadCustomerAssignmentListSuccess(
              this.assignmentMappingService.assignmentMultipleResponseToVM(
                res,
                'searchAssignment'
              )
            );
          }),
          catchError((err) =>
            of(new fromAssignmentAction.LoadCustomerAssignmentListFailed(err))
          )
        )
    )
  );

  @Effect()
  deleteAssignment$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.CustomerAssignmentActionTypes.DeleteCustomerAssignment),
    withLatestFrom(
      this.store.select(fromAssignment.getSearchModel),
      (
        action: fromAssignmentAction.DeleteCustomerAssignment,
        model: AssignmentSearchVM
      ) => {
        return {
          id: action.payload,
          searchModel: model,
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([
        this.assignmentService.deleteAssignment(payload.id),
        of(payload.searchModel),
      ])
    ),
    switchMap((payload: any) => {
      if (payload[0].status === 204) {
        this.toastrService.success(
          this.translateService.instant(
            'notification.delete.assignments.success'
          )
        );
        return of(
          new fromAssignmentAction.LoadCustomerAssignmentList({ search: payload[1] })
        );
      } else {
        this.toastrService.success(
          this.translateService.instant(
            'notification.delete.assignments.success'
          )
        );
        return of(
          new fromAssignmentAction.LoadCustomerAssignmentList({ search: payload[1] })
        );
      }
    })
  );

  @Effect()
  updateAssignment$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.CustomerAssignmentActionTypes.UpdateCustomerAssignment),
    map((action: fromAssignmentAction.UpdateCustomerAssignment) => action.payload),
    exhaustMap((payload) =>
      this.assignmentService
        .updateAssignment({
          id: payload.id,
          assignment: this.assignmentMappingService.assignmentVMToResponse(
            payload.assignment
          ),
        })
        .pipe(
          map((res: HttpResponse<SingleResponse<AssignmentResponse>>) => {
            if (res.body && res.body.data && res.body.data.id) {
              this.toastrService.success(
                this.translateService.instant(
                  'notification.post.assignments.success'
                )
              );
              return new fromAssignmentAction.UpdateCustomerAssignmentSuccess({
                id: res.body.data.id,
              });
            } else {
              this.toastrService.error(
                this.translateService.instant(
                  'notification.post.assignments.error'
                )
              );
              return new fromAssignmentAction.UpdateCustomerAssignmentFailed(res);
            }
          }),
          catchError((err) =>
            of(new fromAssignmentAction.UpdateCustomerAssignmentFailed(err))
          )
        )
    )
  );

  // @Effect({ dispatch: false })
  // updateAssignmentSuccess$ = this.actions$.pipe(
  //   ofType(fromAssignmentAction.CustomerAssignmentActionTypes.UpdateAssignmentSuccess),
  //   map(
  //     (action: fromAssignmentAction.UpdateAssignmentSuccess) => action.payload
  //   ),
  //   tap((payload) => {
  //     this.router.navigate(['assignments/', payload.id]);
  //   })
  // );

  @Effect()
  updateCheckins$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.CustomerAssignmentActionTypes.UpdateCheckin),
    withLatestFrom(
      this.store.select(fromAssignment.getSearchModel),
      (
        action: fromAssignmentAction.UpdateCheckin,
        model: AssignmentSearchVM
      ) => {
        return {
          req: action.payload,
          searchModel: model,
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([
        this.assignmentService.updateCheckin({
          id: payload.req.id,
          checkin: this.assignmentMappingService.checkinVMToResponse(
            payload.req.checkin
          ),
        }),
        of(payload.searchModel),
      ])
    ),
    switchMap((payload: any) => {
      if (payload[0].body && payload[0].body.data && payload[0].body.data.id) {
        this.toastrService.success(
          this.translateService.instant('notification.post.checkins.success')
        );
        return of(
          new fromAssignmentAction.LoadCustomerAssignmentList({ search: payload[1] })
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.checkins.error')
        );
        return of(
          new fromAssignmentAction.LoadCustomerAssignmentList({ search: payload[1] })
        );
      }
    })
  );
}
