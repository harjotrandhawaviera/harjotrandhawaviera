import { ClientVM } from "../../model/client.model";
import { PaginationVM } from "../../model/pagination.model";
import { PerformanceReviewResponse } from "../../model/PerformanceReview.response";
import { PerformanceReviewActionTypes, PerformanceReviewActions } from "./performance-review.actions";
import {JobActionTypes} from "../../jobs/state/job.actions";

export interface PerformanceReviewState {
    searchModel?: ClientVM;
    resultList?: PerformanceReviewResponse[];
    timePeriod: [];
    loading: boolean;
    noRecord: boolean;
    pageInfo?: PaginationVM;
}

function initialState(): PerformanceReviewState {
    const stored = localStorage.getItem('performanceReview.search');
    return {
        searchModel: stored !== null ? JSON.parse(stored) : undefined,
        resultList: [],
        timePeriod: [],
        loading: false,
        noRecord: false,
        pageInfo: {
            total: 0,
            current_page: 1,
            total_pages: 0,
        },
    };
}

export function reducer(
    state = initialState(),
    action: PerformanceReviewActions
) {
    switch (action.type) {
        case PerformanceReviewActionTypes.PerformanceReviewList:
            return { ...state };

        case PerformanceReviewActionTypes.PerformanceReviewListSuccess:
            return { ...state, list: action.payload };

        case PerformanceReviewActionTypes.PerformanceReviewListFailed:
            return { ...state, list: action.payload };

      case PerformanceReviewActionTypes.LoadTimePeriod:
        return  {
          ...state,
          timePeriod: action.payload,
        };

      case PerformanceReviewActionTypes.LoadTimePeriodSuccess:
        return {
          ...state,
          timePeriod: action.payload
        };

        default:
            return state;
    }
}
