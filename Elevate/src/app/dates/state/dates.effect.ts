import * as fromDates from './index';
import * as fromDatesAction from './dates.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultipleResponse, SingleResponse } from './../../model/response';
import { Observable, forkJoin, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { DatesMappingService } from '../../services/mapping-services/dates-mapping.service';
import { DatesResponse } from '../../model/dates.response';
import { DatesSearchVM } from '../../model/dates.model';
import { DatesService } from '../../services/dates.service';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobMappingService } from '../../services/mapping-services/job-mapping.service';
import { JobResponse } from '../../model/job.response';
import { JobService } from '../../services/job.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Injectable()
export class DatesEffect {
  constructor(
    private jobService: JobService,
    private datesService: DatesService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private store: Store<fromDates.State>,
    private actions$: Actions,
    private datesMappingService: DatesMappingService,
    private jobMappingService: JobMappingService
  ) {}

  @Effect()
  loadDatesList$: Observable<Action> = this.actions$.pipe(
    ofType(fromDatesAction.DatesActionTypes.LoadDatesList),
    map((action: fromDatesAction.LoadDatesList) => action.payload),
    switchMap((payload) =>
      this.datesService
        .getDates(this.datesMappingService.searchRequest(payload))
        .pipe(
          map((datesRes: MultipleResponse<DatesResponse>) => {
            return new fromDatesAction.LoadDatesListSuccess(
              this.datesMappingService.datesSearchResponseToVM(datesRes)
            );
          }),
          catchError((err) => of(new fromDatesAction.LoadDatesListFailed(err)))
        )
    )
  );

  @Effect()
  deleteDates$: Observable<Action> = this.actions$.pipe(
    ofType(fromDatesAction.DatesActionTypes.DeleteDates),
    withLatestFrom(
      this.store.select(fromDates.getSearchModel),
      (action: fromDatesAction.DeleteDates, model: DatesSearchVM) => {
        return {
          id: action.payload,
          searchModel: model,
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([
        this.datesService.deleteDates(payload.id).pipe(
          map((res) => {}),
          catchError(async (err) => {
            this.toastrService.error(
              '<b>' +
                this.translateService.instant(
                  'notification.delete.dates.error'
                ) +
                '</b>' +
                '<br/>' +
                err.error.message
            );
          })
        ),
        of(payload.searchModel),
      ])
    ),
    switchMap((payload: any) => {
      if (payload[0] && payload[0].status === 204) {
        this.toastrService.success(
          this.translateService.instant('notification.delete.jobs.success')
        );
        return of(new fromDatesAction.LoadDatesList(payload[1]));
      } else {
        return of(new fromDatesAction.LoadDatesList(payload[1]));
      }
    })
  );

  @Effect()
  loadDatesDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromDatesAction.DatesActionTypes.LoadDatesDetail),
    map((action: fromDatesAction.LoadDatesDetail) => action.payload),
    switchMap((payload) =>
      this.datesService
        .getDatesById(this.datesMappingService.getByIdRequest(payload.id, payload.assignment_id))
        .pipe(
          map((res: SingleResponse<DatesResponse>) => {
            if (res?.data) {
              return new fromDatesAction.LoadDatesDetailSuccess(
                this.datesMappingService.datesResponseToVM(res.data)
              );
            } else {
              return new fromDatesAction.LoadDatesDetailFailed(res);
            }
          }),
          catchError((err) =>
            of(new fromDatesAction.LoadDatesDetailFailed(err))
          )
        )
    )
  );

  @Effect()
  updateDate$: Observable<Action> = this.actions$.pipe(
    ofType(fromDatesAction.DatesActionTypes.UpdateDate),
    map((action: fromDatesAction.UpdateDate) => action.payload),
    exhaustMap((payload) =>
      this.datesService
        .updateDate({
          date: this.datesMappingService.dateVMToResponse(payload),
        })
        .pipe(
          map((res: HttpResponse<SingleResponse<DatesResponse>>) => {
            if (res.body && res.body.data && res.body.data.id) {
              this.toastrService.success(
                this.translateService.instant('notification.put.dates.success')
              );
              return new fromDatesAction.UpdateDateSuccess({
                id: res.body.data.id,
              });
            } else {
              this.toastrService.error(
                this.translateService.instant('notification.put.dates.error')
              );
              return new fromDatesAction.UpdateDateFailed(res);
            }
          }),
          catchError((err) => of(new fromDatesAction.UpdateDateFailed(err)))
        )
    )
  );

  @Effect({ dispatch: false })
  updateDateSuccess$ = this.actions$.pipe(
    ofType(fromDatesAction.DatesActionTypes.UpdateDateSuccess),
    map((action: fromDatesAction.UpdateDateSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['dates', payload.id]);
    })
  );

  @Effect()
  loadJobDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromDatesAction.DatesActionTypes.LoadJobDetail),
    map((action: fromDatesAction.LoadJobDetail) => action.payload),
    switchMap((payload) =>
      this.jobService
        .getJobById(
          this.jobMappingService.getByIdRequest(payload.id, payload.mode)
        )
        .pipe(
          map((res: SingleResponse<JobResponse>) => {
            if (res?.data) {
              return new fromDatesAction.LoadJobDetailSuccess(
                this.jobMappingService.jobResponseToVM(res.data)
              );
            } else {
              return new fromDatesAction.LoadJobDetailFailed(res);
            }
          }),
          catchError((err) => of(new fromDatesAction.LoadJobDetailFailed(err)))
        )
    )
  );

  @Effect()
  CreateDates$: Observable<Action> = this.actions$.pipe(
    ofType(fromDatesAction.DatesActionTypes.CreateDates),
    map((action: fromDatesAction.CreateDates) => action.payload),
    exhaustMap((payload) =>
      this.datesService
        .createDates({
          dates: this.datesMappingService.datesVMToResponseArr(payload),
        })
        .pipe(
          map((res: HttpResponse<SingleResponse<DatesResponse>>) => {
            if (res.status === 204) {
              this.toastrService.success(
                this.translateService.instant('notification.put.dates.success')
              );
              return new fromDatesAction.CreateDatesSuccess({});
            } else {
              this.toastrService.error(
                this.translateService.instant('notification.put.dates.error')
              );
              return new fromDatesAction.CreateDatesFailed(res);
            }
          }),
          catchError((err) => of(new fromDatesAction.CreateDatesFailed(err)))
        )
    )
  );

  @Effect({ dispatch: false })
  createDatesSuccess$ = this.actions$.pipe(
    ofType(fromDatesAction.DatesActionTypes.CreateDatesSuccess),
    map((action: fromDatesAction.CreateDatesSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['/dates']);
    })
  );
}
