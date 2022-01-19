import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class UserRequestService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  submitRequest(data: any): Observable<any> {
    return this.http.post(environment.api + `/requests`, data, {
      observe: 'response',
    });
  }
}
