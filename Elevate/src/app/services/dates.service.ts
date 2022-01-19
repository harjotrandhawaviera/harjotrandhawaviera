import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { JobDocumentResponse, JobResponse } from '../model/job.response';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { DatesResponse } from '../model/dates.response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatesService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getDates(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<DatesResponse>> {
    return this.http.get<MultipleResponse<DatesResponse>>(
      environment.api + this.getSearchURL('/dates', searchRequest)
    );
  }

  deleteDates(
    id: string
  ): Observable<HttpResponse<SingleResponse<DatesResponse>>> {
    return this.http.delete(environment.api + `/dates/${id}`, {
      observe: 'response',
    });
  }

  getDatesById(
    idRequest: IdRequestVM
  ): Observable<SingleResponse<DatesResponse>> {
    return this.http.get<SingleResponse<DatesResponse>>(
      environment.api + this.getByIdURL('/dates', idRequest)
    );
  }

  createDate(req: {
    date: DatesResponse;
  }): Observable<HttpResponse<SingleResponse<DatesResponse>>> {
    return this.http.post(environment.api + `/dates`, req.date, {
      observe: 'response',
    });
  }

  createDates(req: {
    dates: DatesResponse[];
  }): Observable<HttpResponse<SingleResponse<DatesResponse>>> {
    return this.http.put(environment.api + `/dates`, req.dates, {
      observe: 'response',
    });
  }

  updateDate(req: {
    date: DatesResponse;
  }): Observable<HttpResponse<SingleResponse<DatesResponse>>> {
    return this.http.post(environment.api + `/dates/${req.date.id}`, req.date, {
      observe: 'response',
    });
  }
}
