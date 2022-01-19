import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { performanceReviewVM } from '../model/performanceReview.model';
import { PerformanceReviewResponse } from '../model/PerformanceReview.response';
import { MultipleResponse, SingleResponse } from '../model/response';

@Injectable({
  providedIn: 'root'
})
export class PerformanceReviewService {
  constructor(
    private http: HttpClient
  ) { }

  getPerformanceReviewsFreelancerList(params: {}): Observable<MultipleResponse<PerformanceReviewResponse>> {
    return this.http.get(
      environment.api +'/performance-reviews', {params: params}
      );
  }

  getTimePeriodList( params?: any): Observable<any>{
    const url = `/performance-reviews/get/timeperiod`;
    return this.http.get(environment.api + url);
  }

  updatePerformanceReview(req: {
    performanceReview: performanceReviewVM;
  }): Observable<HttpResponse<SingleResponse<performanceReviewVM>>> {
    return this.http.post(environment.api + `/performance-reviews`, req.performanceReview, {
      observe: 'response',
    });
  }
}
