import { AgentResponse } from '../model/agent.response';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MultipleResponse } from '../model/response';
import { Observable } from 'rxjs';
import { SearchRequestVM } from '../model/search.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgentService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAgents(searchRequest: SearchRequestVM): Observable<MultipleResponse<AgentResponse>> {
    return this.http.get<MultipleResponse<AgentResponse>>(environment.api + this.getSearchURL('/agents', searchRequest));
  }
  getAgentsLK(): Observable<MultipleResponse<AgentResponse>> {
    return this.getAgents({
      limit: 100000,
      only_fields: ['agent.id', 'agent.firstname', 'agent.lastname', 'user.id']
    });
  }
}
