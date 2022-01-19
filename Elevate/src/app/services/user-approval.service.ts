import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { SingleResponse } from './../model/response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserApprovalResponse } from '../model/user-approval.response';
import { environment } from '../../environments/environment';

@Injectable()
export class UserApprovalService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getFreelancerApprovals(
    id: number
  ): Observable<SingleResponse<UserApprovalResponse>> {
    return this.http.get<SingleResponse<UserApprovalResponse>>(
      environment.api + `/freelancers/${id}/approvals`
    );
  }
}
