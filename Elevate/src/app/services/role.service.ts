import { HttpClient } from '@angular/common/http';
import { SearchRequestVM } from './../model/search.model';
import { MultipleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleResponse } from '../model/role.response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  getRoles(searchRequest: SearchRequestVM): Observable<any> {
    return this.http.get<any>(
      environment.api + this.getSearchURL('/staff-roles', searchRequest)
    );
  }

  getRegions(): Observable<any> {
    return this.http.get<any>(environment.api + '/regions');
  }

  addRole(roleBody: {
    identifier: string;
    label: string;
    region: number;
    skills: number;
    description: string;
  }) {
    return this.http.post<any>(environment.api + '/staff-roles', {
      identifier: roleBody.identifier,
      label: roleBody.label,
      skill_ids: roleBody.skills || [],
      region_ids: roleBody.region || [],
      description: roleBody.description
    });
  }

  updateRole(
    roleBody: {
      identifier: string;
      region: number;
      label: string;
      skills: number;
      description: string;
    },
    roleId: string
  ) {
    return this.http.post<any>(environment.api + '/staff-roles/' + roleId, {
      identifier: roleBody.identifier,
      label: roleBody.label,
      skill_ids: roleBody.skills || [],
      region_ids: roleBody.region || [],
      description: roleBody.description
    });
  }

  getRoleDetail(roleId: string): Observable<any> {
    return this.http
      .get<any>(environment.api + '/staff-roles/' + roleId)
      .pipe(map((roleRes: any) => roleRes.data));
  }

  removeRole(roleId: string) {
    return this.http.delete<any>(environment.api + '/staff-roles/' + roleId);
  }
}
