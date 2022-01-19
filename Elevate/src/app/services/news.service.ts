import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { NewsResponse } from '../model/news.response';
import { environment } from '../../environments/environment';
import {AccountingResponse} from "../model/accounting.response";
import {UpdateInvoice} from "../model/accounting.model";
@Injectable({
  providedIn: 'root',
})
export class NewsService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }
  agentList(searchRequest: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(environment.api + searchRequest);
  }
  jobList(searchRequest: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(environment.api + searchRequest);
  }
  freelancer(searchRequest: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(environment.api + searchRequest);
  }
  message(searchRequest: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(environment.api + searchRequest);
  }
  loadNews(searchRequest: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(environment.api + searchRequest);
  }
  sendAnswer(paramId: string, sendAnswerValue: NewsResponse): Observable<NewsResponse> {
    return this.http.post(environment.api + `${paramId}`, sendAnswerValue);
  }
  removeTender(qId: number): Observable<NewsResponse> {
    return this.http.delete(environment.api + `/messages/${qId}`);
  }
}
