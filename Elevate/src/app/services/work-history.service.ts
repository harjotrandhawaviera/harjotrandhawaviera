import { HttpClient, HttpResponse } from '@angular/common/http';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReferncesResponse } from './../model/freelancer.response';
import { SingleResponse } from './../model/response';
import { environment } from '../../environments/environment';

@Injectable()
export class WorkHistoryService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  create(
    workHistory: any
  ): Observable<HttpResponse<SingleResponse<any>>> {
    return this.http.post(environment.api + `/work-histories`, workHistory, {
      observe: 'response',
    });
  }
  update(req: {
    id: number;
    workHistory: any;
  }): Observable<HttpResponse<SingleResponse<any>>> {
    return this.http.post(
      environment.api + `/work-histories/${req.id}`,
      req.workHistory,
      {
        observe: 'response',
      }
    );
  }
  upsert(
    workHistory: any
  ): Observable<HttpResponse<SingleResponse<any>>> {
    if (workHistory.id) {
      return this.update({ id: workHistory.id, workHistory: workHistory });
    } else {
      return this.create(workHistory);
    }
  }
  delete(
    id: number
  ): Observable<HttpResponse<SingleResponse<any>>> {
    return this.http.delete(environment.api + `/work-histories/${id}`, {
      observe: 'response',
    });
  }
}
