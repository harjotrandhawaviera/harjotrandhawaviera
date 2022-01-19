import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from '../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';
import { RightsResponse, UserResponse } from '../model/user.response';

import { AgentResponse } from '../model/agent.response';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleResponse } from '../model/role.response';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getUsers(searchRequest: SearchRequestVM): Observable<MultipleResponse<UserResponse>> {
    return this.http.get<MultipleResponse<UserResponse>>(environment.api + this.getSearchURL('/users', searchRequest));
  }

  getUsersByRoleLK(role: string): Observable<MultipleResponse<UserResponse>> {
    return this.getUsers({
      limit: 100000,
      include: role === 'freelancer' ? ['freelancer'] : role === 'agent' ? ['agent'] : ['contact'],
      filters: [{ key: 'role', value: role }],
    });
  }

  getRolesLK(searchRequest: SearchRequestVM): Observable<MultipleResponse<RoleResponse>> {
    return this.http.get<MultipleResponse<RoleResponse>>(environment.api + this.getSearchURL('/roles', searchRequest));
  }

  getRights(searchRequest: SearchRequestVM): Observable<MultipleResponse<RightsResponse>> {
    return this.http.get<MultipleResponse<RightsResponse>>(environment.api + this.getSearchURL('/rights', searchRequest));
  }

  getRightsPerRole(searchRequest: SearchRequestVM, role: string): Observable<MultipleResponse<RightsResponse>> {
    return this.http.get<MultipleResponse<RightsResponse>>(environment.api + this.getSearchURL(`/roles/${role}/rights`, searchRequest));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(environment.api + `/users/${id}`, { observe: 'response' });
  }

  createUser(req: { user: UserResponse }): Observable<HttpResponse<SingleResponse<UserResponse>>> {
    return this.http.post(environment.api + `/users`, req.user, { observe: 'response' });
  }

  updateUser(req: { user: UserResponse }): Observable<HttpResponse<SingleResponse<UserResponse>>> {
    return this.http.post(environment.api + `/users/${req.user.id}`, req.user, { observe: 'response' });
  }

  updateAgent(req: { id: number, agent: AgentResponse }): Observable<HttpResponse<SingleResponse<AgentResponse>>> {
    return this.http.post(environment.api + `/agents/${req.id}`, req.agent, { observe: 'response' });
  }

  getPictureURL(id: number): any {
    return this.http.get<any>(environment.api + this.getSearchURL(`/pictures/${id}/icon/squared`, {}));
  }

  getUserById(idRequest: IdRequestVM): Observable<SingleResponse<UserResponse>> {
    return this.http.get<SingleResponse<UserResponse>>(environment.api + this.getByIdURL('/users', idRequest));
  }

  disableUser(id: string, reason: string): Observable<any> {
    return this.http.post(environment.api + `/users/${id}/disable`, { disabled_reason: reason }, { observe: 'response' });
  }

  enableUser(id: string): Observable<any> {
    return this.http.post(environment.api + `/users/${id}/enable`, { observe: 'response' });
  }

  deactivateUser(id: string, reason: string): Observable<any> {
    return this.http.post(environment.api + `/users/${id}/deactivate`, { deactivated_reason: reason }, { observe: 'response' });
  }

  activateUser(id: string): Observable<any> {
    return this.http.post(environment.api + `/users/${id}/reactivate`, { observe: 'response' });
  }


  // TODO: Code refactoring
  agentsNameList(withUser: boolean, onlyActive: boolean): Observable<any> {
    const params = {
      limit: 100000,
      include: withUser ? 'user' : '',
      only_active: onlyActive || '',
    };
    const only = {
      agent: ['id', 'lastname', 'firstname'],
      user: ['id'],
    };
    return this.getAgents(params, only).pipe(
      map((res: any) => {
        return res.data
          .map((a: any) => {
            return this.transformAgent(a);
          })
          .map((agent: any) => {
            return {
              id: agent.roleId,
              userId: agent.userId,
              name: agent.lastname + ' ' + agent.firstname,
            };
          });
      })
    );
  }
  getAgents(data: any, only: any): Observable<any> {
    var path = this.query('/agents', ['limit', 'include', 'only_active'], data);
    return this.http.get(
      environment.api + this.transformPath(path, data, only)
    );
  }


  /**
   * Transforms agent data
   *
   * @param {object} data
   * @returns {object}
   */
  transformAgent(data: any) {
    return {
      ...data,
      ...(data.user && data.user.data ? data.user.data : {}),
      roleId: data.id,
      userId: data.user ? data.user.data.id : null,
    };
  }
  updateRating(freelancerId: string, data: any): Observable<HttpResponse<any>> {
    data = { ...data, ...{ freelancer_id: data.id ? undefined : freelancerId } };
    if (data.id) {
      return this.http.post(environment.api + `/ratings/${data.id}?include=creator`, data, { observe: 'response' });
    } else {
      return this.http.post(environment.api + `/ratings?include=creator`, data, { observe: 'response' });
    }

  }
}
