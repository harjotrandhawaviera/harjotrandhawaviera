import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { PerformanceReviewResponse } from "../../model/PerformanceReview.response";
import { MultipleResponse } from "../../model/response";
import { PerformanceReviewMappingService } from "../../services/mapping-services/performance-review-mapping.service";
import { PerformanceReviewService } from "../../services/performance-review.service";
import * as formPerformanceReviewAction from "./performance-review.actions";
import {Action} from "@ngrx/store";
import * as fromJobAction from "../../jobs/state/job.actions";

@Injectable()
export class PerformanceReviewEffect {

  constructor(
    private actions$: Actions,
    private performanceReviewService: PerformanceReviewService,
    private performanceReviewMappingService: PerformanceReviewMappingService
  ) { }

  @Effect()
  PerformanceReviewList$ = this.actions$.pipe(
    ofType(formPerformanceReviewAction.PerformanceReviewActionTypes.PerformanceReviewList),
    map((action: formPerformanceReviewAction.UpdatePerformanceReview) => action.payload),
    switchMap((payload) =>
      this.performanceReviewService
        .getPerformanceReviewsFreelancerList(payload.performanceReview)
        .pipe(
          map((performanceReviewsListRes: MultipleResponse<PerformanceReviewResponse>) => {
            return new formPerformanceReviewAction.PerformanceReviewListSuccess(performanceReviewsListRes)
          }),
          catchError((err) =>
            of(new formPerformanceReviewAction.PerformanceReviewListFailed(err))
          )
        )
    )
  );

  @Effect()
  UpdatePerformanceReview$ = this.actions$.pipe(
    ofType(formPerformanceReviewAction.PerformanceReviewActionTypes.UpdatePerformanceReview),
    map((action: formPerformanceReviewAction.UpdatePerformanceReview) => action.payload),
    switchMap((payload) =>
      this.performanceReviewService.updatePerformanceReview({
        performanceReview: this.performanceReviewMappingService.performanceReviewVMToResponse(
          payload.performanceReview
        ),
        })
    )
  );

  @Effect()
  TimePeriod$: Observable<Action> = this.actions$.pipe(
    ofType(formPerformanceReviewAction.PerformanceReviewActionTypes.LoadTimePeriod),
    mergeMap((action: any) => this.performanceReviewService.getTimePeriodList(action?.payload).pipe(
      (map(TimePeriodList => (new formPerformanceReviewAction.LoadTimePeriodSuccess({data: TimePeriodList}))))
    ))
  );
}
