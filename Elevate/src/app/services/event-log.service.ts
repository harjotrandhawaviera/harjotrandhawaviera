import { BaseService } from './base.service';
import { EventLogResponse } from './../model/event-log.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MultipleResponse } from './../model/response';
import { Observable } from 'rxjs';
import { SearchRequestVM } from '../model/search.model';
import { environment } from '../../environments/environment';

@Injectable()
export class EventLogService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getEventLogs(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<EventLogResponse>> {
    return this.http.get<MultipleResponse<EventLogResponse>>(
      environment.api + this.getSearchURL('/eventlogs', searchRequest)
    );
  }
}
