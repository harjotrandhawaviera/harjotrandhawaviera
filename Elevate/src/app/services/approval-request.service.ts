import { MultipleResponse, SingleResponse } from './../model/response';

import { ApprovalRequestResponse } from '../model/approval-request.response';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchRequestVM } from '../model/search.model';
import { UserApprovalResponse } from '../model/user-approval.response';
import { environment } from '../../environments/environment';

@Injectable()
export class ApprovalRequestService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getApprovalRequests(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<ApprovalRequestResponse>> {
    return this.http.get<MultipleResponse<ApprovalRequestResponse>>(
      environment.api + this.getSearchURL('/requests', searchRequest)
    );
  }
  getRequest(id: string): Observable<SingleResponse<ApprovalRequestResponse>> {
    return this.http.get<SingleResponse<ApprovalRequestResponse>>(
      environment.api + `/requests/${id}?include=user.freelancer.approvals,user.freelancer.pictures,user.freelancer.documents`
    );
  }
  closeRequest(requestId: any, declined: boolean) {
    if (declined) {
      return this.http.delete(environment.api + `/requests/${requestId}?declined=1`);
    } else {
      return this.http.delete(environment.api + `/requests/${requestId}`);
    }

  }
  getGtc(id: any): Observable<MultipleResponse<any>> {
    return this.http.get<MultipleResponse<any>>(environment.api + `/gtcs/${id}?include=documents.document,contract_type`);
  }
  approveGtc(req: { id: number, gtc_id: any }): Observable<MultipleResponse<any>> {
    return this.http.post(environment.api + `/freelancers/${req.id}/gtcs`, { gtc_id: req.gtc_id });
  }

  approveFreelancer(search: any): Observable<any> {
    const url = `/auth/admin-register`;
    return this.http.post(environment.api + url, search);
  }

  userList(page: any): Observable<any> {
    let url = '/admin/adminusers?limit=10&include=user.freelancer&only_fields=freelancer.id,freelancer.firstname,freelancer.lastname,freelancer.fullname,freelancer.zip,freelancer.city,freelancer.mobile,freelancer.avg_assignment_rating,freelancer.country,freelancer.face_picture_id,user.id,user.email,user.has_requested_account_delete,user.has_requested_password_reset,user.status,user.active_at,user.created_at,user.confirmed_at,freelancer.ready_for_active';
    if (page?.payload) {
      url += '&page=' + page?.payload?.page;
    }
    if (page?.payload.contractType) {
      url += '&contract_type_id=' + page?.payload?.contractType;
    }
    if (page?.payload.postcodesMin) {
      url += '&zip_from=' + page?.payload?.postcodesMin;
    }
    if (page?.payload.postcodesMax) {
      url += '&zip_to=' + page?.payload?.postcodesMax;
    }
    if (page?.payload.search) {
      url += '&search=' + page?.payload?.search;
    }
    return this.http.get(environment.api + url);
  }

  getUserEmail(id: number): Observable<any> {
    const url = `freelancers/verify-email/${id}`;
    return this.http.post(environment.api + url, id);
  }
}
