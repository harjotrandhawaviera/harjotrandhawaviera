import { HttpClient, HttpResponse } from '@angular/common/http';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleResponse } from './../model/response';
import { environment } from '../../environments/environment';

@Injectable()
export class IdentityDocumentsService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  create(
    identityDocuments: any
  ): Observable<HttpResponse<SingleResponse<any>>> {
    return this.http.post(environment.api + `/identity-documents`, identityDocuments, {
      observe: 'response',
    });
  }
  update(req: {
    id: number;
    identityDocuments: any;
  }): Observable<HttpResponse<SingleResponse<any>>> {
    return this.http.post(
      environment.api + `/identity-documents/${req.id}`,
      req.identityDocuments,
      {
        observe: 'response',
      }
    );
  }
  upsert(
    identityDocuments: any
  ): Observable<HttpResponse<SingleResponse<any>>> {
    if (identityDocuments.id) {
      return this.update({ id: identityDocuments.id, identityDocuments: identityDocuments });
    } else {
      return this.create(identityDocuments);
    }
  }
  delete(
    id: number
  ): Observable<HttpResponse<SingleResponse<any>>> {
    return this.http.delete(environment.api + `/identity-documents/${id}`, {
      observe: 'response',
    });
  }
  deleteIdentityDocument(
    id: number
  ): Observable<HttpResponse<SingleResponse<any>>> {
    return this.http.delete(environment.api + `/identity-documents/${id}`, {
      observe: 'response',
    });
  }
}
