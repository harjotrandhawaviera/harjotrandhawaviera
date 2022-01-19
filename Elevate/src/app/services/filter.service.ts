import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { BaseService } from "./base.service";

@Injectable()
export class FilterService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  userList(page: any): Observable<any> {
    let url = '/admin/adminusers?creator=0&include=user.freelancer&only_fields=freelancer.id,freelancer.firstname,freelancer.lastname,freelancer.fullname,freelancer.zip,freelancer.city,freelancer.mobile,freelancer.avg_assignment_rating,freelancer.country,freelancer.face_picture_id,user.id,user.email,freelancer.gender,freelancer.birthdate,user.has_requested_account_delete,user.has_requested_password_reset,user.status,user.active_at,user.created_at,user.confirmed_at,freelancer.ready_for_active,freelancer.mobile_dial_code';
    if (page?.payload) {
      url += '&page=' + page?.payload?.page;
    }
    if (page?.payload && page.payload?.limit) {
        url += '&limit=' + page?.payload?.limit;
      }
    if (page?.payload && page.payload?.filters) {
        url += '&'+page?.payload?.filters;
    }
    return this.http.get(environment.api + url);
  }

  getMasterFilters(): Observable<any> {
    return this.http.get(environment.api + '/admin/searchmaster');
  }
}