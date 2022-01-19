
import { Action } from '@ngrx/store';
import { performanceReviewVM } from '../../model/performanceReview.model';


export enum PerformanceReviewActionTypes {
    UpdatePerformanceReview = '[PerformanceReview] Update PerformanceReview',
    UpdatePerformanceReviewSuccess = '[PerformanceReview] Update Performance Review success',
    UpdatePerformanceReviewFailed = '[PerformanceReview] Update Performance Review failed',

    PerformanceReviewList = '[PerformanceReview] PerformanceReview List',
    PerformanceReviewListSuccess = '[PerformanceReview] PerformanceReview List success',
    PerformanceReviewListFailed = '[PerformanceReview] PerformanceReview List failed',

    LoadTimePeriod = '[PerformanceReview] Load TimePeriod',
    LoadTimePeriodSuccess = '[PerformanceReview] Load TimePeriod Success',

}

export class UpdatePerformanceReview implements Action {
    readonly type = PerformanceReviewActionTypes.UpdatePerformanceReview;
    constructor(
      public payload: { performanceReview: performanceReviewVM }
    ) {}
  }
  export class UpdatePerformanceReviewSuccess implements Action {
    readonly type = PerformanceReviewActionTypes.UpdatePerformanceReviewSuccess;
    constructor(public payload: { id: number }) {}
  }
  export class UpdatePerformanceReviewFailed implements Action {
    readonly type = PerformanceReviewActionTypes.UpdatePerformanceReviewFailed;
    constructor(public payload: any) {}
  }

  export class PerformanceReviewList implements Action {
      readonly type = PerformanceReviewActionTypes.PerformanceReviewList;
      constructor(public payload: { performanceReview: performanceReviewVM }) {}
  }

  export class PerformanceReviewListSuccess implements Action {
    readonly type = PerformanceReviewActionTypes.PerformanceReviewListSuccess;
    constructor( public payload: any) {}
}

export class PerformanceReviewListFailed implements Action {
    readonly type = PerformanceReviewActionTypes.PerformanceReviewListFailed;
    constructor( public payload: Error ) {}
}

export class LoadTimePeriod implements Action {
  readonly type = PerformanceReviewActionTypes.LoadTimePeriod;
  constructor(public payload: any) {}
}

export class LoadTimePeriodSuccess implements Action {
  readonly type = PerformanceReviewActionTypes.LoadTimePeriodSuccess;
  constructor( public payload: any) {}
}

  export type PerformanceReviewActions =
    | UpdatePerformanceReview
    | UpdatePerformanceReviewSuccess
    | UpdatePerformanceReviewFailed
    | PerformanceReviewList
    | PerformanceReviewListSuccess
    | PerformanceReviewListFailed
    | LoadTimePeriod
    | LoadTimePeriodSuccess
