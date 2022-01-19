import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReportAdminModel } from '../../model/report-admin.model';

@Injectable({
  providedIn: 'root',
})

export class ReportAdminService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  AdminFreelancerList(searchRequest: string): Observable<ReportAdminModel> {
    return this.http.get(environment.api + searchRequest);
  }
}
