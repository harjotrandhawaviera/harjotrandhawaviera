import { IdRequestVM, ProjectSearchRequestVM, SearchRequestVM } from './../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectResponse } from '../model/project.response';
import { RevenueResponse } from '../model/revenue.response';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RevenueService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }
  getRevenues(searchRequest: SearchRequestVM): Observable<MultipleResponse<RevenueResponse>> {
    return this.http.get<MultipleResponse<RevenueResponse>>(environment.api + this.getSearchURL('/revenues', searchRequest));
  }
  updateFreelancerRevenue(freelancerId: any, id: any, data: any) {
    return this.http.post(environment.api + `/freelancers/${freelancerId}/revenues/${id}`, data, { observe: 'response' });
  }
  createFreelancerRevenue(freelancerId: any, data: any) {
    return this.http.post(environment.api + `/freelancers/${freelancerId}/revenues`, data, { observe: 'response' });
  }
  removeFreelancerRevenue(freelancerId: any, id: any) {
    return this.http.delete(environment.api + `/freelancers/${freelancerId}/revenues/${id}`, { observe: 'response' });
  }
  updateRevenue(id: any, data: any) {
    return this.http.post(environment.api + `/revenues/${id}`, data, { observe: 'response' });
  }
  createRevenue(data: any) {
    return this.http.post(environment.api + `/revenues`, data, { observe: 'response' });
  }
  removeRevenue(id: any) {
    return this.http.delete(environment.api + `/revenues/${id}`, { observe: 'response' });
  }
}
