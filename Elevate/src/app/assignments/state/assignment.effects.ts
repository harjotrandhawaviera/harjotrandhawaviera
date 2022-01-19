import * as fromAssignment from './index';
import * as fromAssignmentAction from './assignment.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultipleResponse, SingleResponse } from './../../model/response';
import { Observable, forkJoin, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map, mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AssignmentMappingService } from '../../services/mapping-services/assignment-mapping.service';
import { AssignmentResponse } from '../../model/assignment.response';
import { AssignmentSearchVM } from '../../model/assignment.model';
import { AssignmentService } from '../../services/assignment.service';
import { BudgetMappingService } from '../../services/mapping-services/budget-mapping.service';
import { BudgetResponse } from '../../model/budget.response';
import { BudgetService } from '../../services/budget.service';
import { DatesMappingService } from '../../services/mapping-services/dates-mapping.service';
import { DatesResponse } from '../../model/dates.response';
import { DatesService } from '../../services/dates.service';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Injectable()
export class AssignmentEffect {
  constructor(
    private assignmentService: AssignmentService,
    private budgetService: BudgetService,
    private datesService: DatesService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private store: Store<fromAssignment.State>,
    private actions$: Actions,
    private assignmentMappingService: AssignmentMappingService,
    private budgetMappingService: BudgetMappingService,
    private datesMappingService: DatesMappingService
  ) {}

  @Effect()
  loadAssignmentsList$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.LoadAssignmentList),
    map((action: fromAssignmentAction.LoadAssignmentList) => action.payload),
    switchMap((payload) =>
      this.assignmentService
        .getAssignments(
          this.assignmentMappingService.searchRequest(
            payload.search,
            payload.view
          )
        )
        .pipe(
          map((res: MultipleResponse<AssignmentResponse>) => {
            return new fromAssignmentAction.LoadAssignmentListSuccess(
              this.assignmentMappingService.assignmentMultipleResponseToVM(
                res,
                'searchAssignment'
              )
            );
          }),
          catchError((err) =>
            of(new fromAssignmentAction.LoadAssignmentListFailed(err))
          )
        )
    )
  );

  @Effect()
  deleteAssignment$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.DeleteAssignment),
    withLatestFrom(
      this.store.select(fromAssignment.getSearchModel),
      (
        action: fromAssignmentAction.DeleteAssignment,
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
          new fromAssignmentAction.LoadAssignmentList({ search: payload[1] })
        );
      } else {
        this.toastrService.success(
          this.translateService.instant(
            'notification.delete.assignments.success'
          )
        );
        return of(
          new fromAssignmentAction.LoadAssignmentList({ search: payload[1] })
        );
      }
    })
  );

  @Effect()
  updateAssignment$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.UpdateAssignment),
    map((action: fromAssignmentAction.UpdateAssignment) => action.payload),
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
              return new fromAssignmentAction.UpdateAssignmentSuccess({
                id: res.body.data.id,
              });
            } else {
              this.toastrService.error(
                this.translateService.instant(
                  'notification.post.assignments.error'
                )
              );
              return new fromAssignmentAction.UpdateAssignmentFailed(res);
            }
          }),
          catchError((err) =>
            of(new fromAssignmentAction.UpdateAssignmentFailed(err))
          )
        )
    )
  );

  // @Effect({ dispatch: false })
  // updateAssignmentSuccess$ = this.actions$.pipe(
  //   ofType(fromAssignmentAction.AssignmentActionTypes.UpdateAssignmentSuccess),
  //   map(
  //     (action: fromAssignmentAction.UpdateAssignmentSuccess) => action.payload
  //   ),
  //   tap((payload) => {
  //     this.router.navigate(['assignments/', payload.id]);
  //   })
  // );

  @Effect()
  updateCheckins$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.UpdateCheckin),
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
          new fromAssignmentAction.LoadAssignmentList({ search: payload[1] })
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.checkins.error')
        );
        return of(
          new fromAssignmentAction.LoadAssignmentList({ search: payload[1] })
        );
      }
    })
  );

  @Effect()
  loadAssignmentDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.LoadAssignmentDetail),
    map((action: fromAssignmentAction.LoadAssignmentDetail) => action.payload),
    switchMap((payload) =>
      this.assignmentService
        .getAssignmentById(
          this.assignmentMappingService.getByIdRequest(payload)
        )
        .pipe(
          map((res: SingleResponse<AssignmentResponse>) => {
            if (res?.data) {
              return new fromAssignmentAction.LoadAssignmentDetailSuccess(
                this.assignmentMappingService.assignmentResponseToVM(res.data)
              );
            } else {
              return new fromAssignmentAction.LoadAssignmentDetailFailed(res);
            }
          }),
          catchError((err) =>
            of(new fromAssignmentAction.LoadAssignmentDetailFailed(err))
          )
        )
    )
  );

  @Effect()
  loadBudgetDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.LoadBudgetDetail),
    map((action: fromAssignmentAction.LoadBudgetDetail) => action.payload),
    switchMap((payload) =>
      this.budgetService
        .getBudgets(this.budgetMappingService.getBudgetRequest(payload))
        .pipe(
          map((res: BudgetResponse) => {
            if (res?.data) {
              return new fromAssignmentAction.LoadBudgetDetailSuccess(
                this.budgetMappingService.budgetResponseToVM(res)
              );
            } else {
              return new fromAssignmentAction.LoadBudgetDetailFailed(res);
            }
          }),
          catchError((err) =>
            of(new fromAssignmentAction.LoadBudgetDetailFailed(err))
          )
        )
    )
  );

  @Effect()
  loadDatesDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.LoadDatesDetail),
    map((action: fromAssignmentAction.LoadDatesDetail) => action.payload),
    switchMap((payload) =>
      this.datesService
        .getDatesById(this.datesMappingService.getByIdRequest(payload.id))
        .pipe(
          map((res: SingleResponse<DatesResponse>) => {
            if (res?.data) {
              return new fromAssignmentAction.LoadDatesDetailSuccess(
                this.datesMappingService.datesResponseToVM(res.data)
              );
            } else {
              return new fromAssignmentAction.LoadDatesDetailFailed(res);
            }
          }),
          catchError((err) =>
            of(new fromAssignmentAction.LoadDatesDetailFailed(err))
          )
        )
    )
  );

  @Effect()
  createAssignment$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.CreateAssignment),
    map((action: fromAssignmentAction.CreateAssignment) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.assignmentService.createAssignment({
          assignment: this.assignmentMappingService.assignmentVMToResponse(
            payload.assignment,
            'create'
          ),
        }),
      ])
    ),
    switchMap((payload) => {
      const originalPayload = payload[0];
      const createAssignmentResponse = payload[1];
      let newDocRequest: Observable<any>[] = [of([])];
      if (
        createAssignmentResponse &&
        createAssignmentResponse.status === 201 &&
        createAssignmentResponse.body &&
        createAssignmentResponse.body.data
      ) {
        const assignmentId = createAssignmentResponse.body.data.id;
        newDocRequest = originalPayload.documents.map((a) => {
          if (a.type !== 'template-questionnaire') {
            return this.assignmentService.createAssignmentDocument({
              assignmentId: Number(assignmentId),
              document: { ...a, document_id: a.id },
            })
          } else {
            return of([])
          }
        });
      }
      return forkJoin([
        of(originalPayload),
        of(createAssignmentResponse),
        ...newDocRequest,
      ]);
    }),
    switchMap((payload: any) => {
      const createAssignmentResponse = payload[1];
      if (
        createAssignmentResponse.body &&
        createAssignmentResponse.body.data &&
        createAssignmentResponse.body.data.id
      ) {
        this.toastrService.success(
          this.translateService.instant('notification.post.assignments.success')
        );
        return of(
          new fromAssignmentAction.CreateAssignmentSuccess({
            id: createAssignmentResponse.body.data.id,
          })
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.assignments.error')
        );
        return of(
          new fromAssignmentAction.CreateAssignmentFailed(createAssignmentResponse)
        );
      }
    })
  );

  @Effect({ dispatch: false })
  createAssignmentSuccess$ = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.CreateAssignmentSuccess),
    map((action: fromAssignmentAction.CreateAssignmentSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['assignments', payload.id]);
    })
  );

  @Effect()
  getSurveyLink$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.GetSurveyLink),
    mergeMap((action: any ) => {
        return this.assignmentService.getSurveyLink(action?.payload).pipe
        (map(surveyData => (new fromAssignmentAction.GetSurveyLinkSuccess({data: surveyData}))));
      }
    )
  );

  @Effect()
  UpdateSurveyLink$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssignmentAction.AssignmentActionTypes.UpdateSurveyLink),
    mergeMap((action: any ) => {
        return this.assignmentService.updateSurveyLink(action?.payload).pipe
        (map(surveyData => (new fromAssignmentAction.UpdateSurveyLinkSuccess({data: surveyData}))));
      }
    )
  );

}
