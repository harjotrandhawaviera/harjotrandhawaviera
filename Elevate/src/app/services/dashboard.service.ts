import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsResponse } from '../model/news.response';
import { environment } from '../../environments/environment';
import { DashboardResponse } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  dashboardAttendList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardOfferList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardChangeList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardTaskList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardConList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardCertificateList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardUnsuitableJobList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardSuitableJobList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardInvitedJobList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardAssignmentList(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  dashboardUnconfirmedAttendance(searchRequest: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.api + searchRequest);
  }
  message(searchRequest: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(environment.api + searchRequest);
  }
  removeTender(qId: number): Observable<NewsResponse> {
    return this.http.delete(environment.api + `/messages/${qId}`);
  }
}
