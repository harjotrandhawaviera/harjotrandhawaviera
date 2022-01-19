import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { freelancerAssignmentResponse } from '../model/freelancer-assignment.model';
import { AdministrationModel } from '../model/administartion.model';

@Injectable({
  providedIn: 'root',
})

export class FreelancerAssignmentServices extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  freelancerAssignmentList(searchRequest: string): Observable<freelancerAssignmentResponse> {
    return this.http.get<freelancerAssignmentResponse>(environment.api + searchRequest);
  }

  freelancerAssignmentDetails(paramId: number, updateFreelancerAssignmentData: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + `${updateFreelancerAssignmentData}/${paramId}`);
  }
}
