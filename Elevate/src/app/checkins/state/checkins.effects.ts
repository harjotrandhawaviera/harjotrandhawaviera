import * as fromCheckin from './index';
import * as fromCheckinAction from './checkins.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AssignmentMappingService } from '../../services/mapping-services/assignment-mapping.service';
import { AssignmentResponse } from '../../model/assignment.response';
import { AssignmentSearchVM } from '../../model/assignment.model';
import { AssignmentService } from '../../services/assignment.service';
import { Injectable } from '@angular/core';
import { MultipleResponse } from './../../model/response';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Injectable()
export class CheckinEffect {
  constructor(
    private assignmentService: AssignmentService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private store: Store<fromCheckin.State>,
    private actions$: Actions,
    private assignmentMappingService: AssignmentMappingService
  ) {}

  @Effect()
  loadCheckinList$: Observable<Action> = this.actions$.pipe(
    ofType(fromCheckinAction.CheckinsActionTypes.LoadCheckinsList),
    map((action: fromCheckinAction.LoadCheckinsList) => action.payload),
    switchMap((payload) =>
      this.assignmentService
        .getAssignments(
          this.assignmentMappingService.CheckinsSearchRequest(payload.search)
        )
        .pipe(
          map((res: MultipleResponse<AssignmentResponse>) => {
            return new fromCheckinAction.LoadCheckinsListSuccess(
              this.assignmentMappingService.assignmentMultipleResponseToVM(
                res,
                'searchAssignment'
              )
            );
          }),
          catchError((err) =>
            of(new fromCheckinAction.LoadCheckinsListFailed(err))
          )
        )
    )
  );

  // @Effect()
  // deleteAssignment$: Observable<Action> = this.actions$.pipe(
  //   ofType(fromCheckinAction.CheckinsActionTypes.DeleteCheckins),
  //   withLatestFrom(
  //     this.store.select(fromCheckin.getSearchModel),
  //     (
  //       action: fromCheckinAction.DeleteCheckins,
  //       model: AssignmentSearchVM
  //     ) => {
  //       return {
  //         id: action.payload,
  //         searchModel: model,
  //       };
  //     }
  //   ),
  //   switchMap((payload: any) =>
  //     forkJoin([
  //       this.assignmentService.deleteAssignment(payload.id),
  //       of(payload.searchModel),
  //     ])
  //   ),
  //   switchMap((payload: any) => {
  //     if (payload[0].status === 204) {
  //       this.toastrService.success(
  //         this.translateService.instant(
  //           'notification.delete.assignments.success'
  //         )
  //       );
  //       return of(
  //         new fromCheckinAction.LoadCheckinsList({ search: payload[1] })
  //       );
  //     } else {
  //       this.toastrService.success(
  //         this.translateService.instant(
  //           'notification.delete.assignments.success'
  //         )
  //       );
  //       return of(
  //         new fromCheckinAction.LoadCheckinsList({ search: payload[1] })
  //       );
  //     }
  //   })
  // );

  @Effect()
  updateCheckins$: Observable<Action> = this.actions$.pipe(
    ofType(fromCheckinAction.CheckinsActionTypes.UpdateCheckin),
    withLatestFrom(
      this.store.select(fromCheckin.getSearchModel),
      (
        action: fromCheckinAction.UpdateCheckin,
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
          new fromCheckinAction.LoadCheckinsList({ search: payload[1] })
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.checkins.error')
        );
        return of(
          new fromCheckinAction.LoadCheckinsList({ search: payload[1] })
        );
      }
    })
  );
}
