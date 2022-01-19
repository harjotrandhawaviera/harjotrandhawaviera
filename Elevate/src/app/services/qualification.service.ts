import { HttpClient, HttpResponse } from '@angular/common/http';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QualificationsResponse } from './../model/freelancer.response';
import { SingleResponse } from './../model/response';
import { environment } from '../../environments/environment';

@Injectable()
export class QualificationService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  create(
    qualification: QualificationsResponse
  ): Observable<HttpResponse<SingleResponse<QualificationsResponse>>> {
    return this.http.post(environment.api + `/qualifications`, qualification, {
      observe: 'response',
    });
  }
  update(req: {
    id: number;
    qualification: QualificationsResponse;
  }): Observable<HttpResponse<SingleResponse<QualificationsResponse>>> {
    return this.http.post(
      environment.api + `/qualifications/${req.id}`,
      req.qualification,
      {
        observe: 'response',
      }
    );
  }
  upsert(
    reference: QualificationsResponse
  ): Observable<HttpResponse<SingleResponse<QualificationsResponse>>> {
    if (reference.id) {
      return this.update({ id: reference.id, qualification: reference });
    } else {
      return this.create(reference);
    }
  }
  delete(
    id: number
  ): Observable<HttpResponse<SingleResponse<QualificationsResponse>>> {
    return this.http.delete(environment.api + `/qualifications/${id}`, {
      observe: 'response',
    });
  }
}
