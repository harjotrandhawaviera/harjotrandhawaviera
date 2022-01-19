import { HttpClient, HttpResponse } from '@angular/common/http';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReferncesResponse } from './../model/freelancer.response';
import { SingleResponse } from './../model/response';
import { environment } from '../../environments/environment';

@Injectable()
export class ReferenceService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  create(
    reference: ReferncesResponse
  ): Observable<HttpResponse<SingleResponse<ReferncesResponse>>> {
    return this.http.post(environment.api + `/references`, reference, {
      observe: 'response',
    });
  }
  update(req: {
    id: number;
    reference: ReferncesResponse;
  }): Observable<HttpResponse<SingleResponse<ReferncesResponse>>> {
    return this.http.post(
      environment.api + `/references/${req.id}`,
      req.reference,
      {
        observe: 'response',
      }
    );
  }
  upsert(
    reference: ReferncesResponse
  ): Observable<HttpResponse<SingleResponse<ReferncesResponse>>> {
    if (reference.id) {
      return this.update({ id: reference.id, reference: reference });
    } else {
      return this.create(reference);
    }
  }
  delete(
    id: number
  ): Observable<HttpResponse<SingleResponse<ReferncesResponse>>> {
    return this.http.delete(environment.api + `/references/${id}`, {
      observe: 'response',
    });
  }
}
