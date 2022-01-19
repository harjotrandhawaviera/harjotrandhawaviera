import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from '../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';

import { AssignmentDocumentResponse } from '../model/document.response';
import { AssignmentResponse } from '../model/assignment.response';
import { BaseService } from './base.service';
import { CheckinResponse } from '../model/checkin.response';
import { Injectable } from '@angular/core';
import { JobResponse } from '../model/job.response';
import { Observable } from 'rxjs';
import { RatingsResponse } from '../model/ratings.response';
import { environment } from '../../environments/environment';

@Injectable()
export class AssignmentService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAssignments(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<AssignmentResponse>> {
    return this.http.get<MultipleResponse<AssignmentResponse>>(
      environment.api + this.getSearchURL('/assignments', searchRequest)
    );
  }

  getAssignmentById(
    idRequest: IdRequestVM
  ): Observable<SingleResponse<AssignmentResponse>> {
    return this.http.get<SingleResponse<AssignmentResponse>>(
      environment.api + this.getByIdURL('/assignments', idRequest)
    );
  }

  createAssignment(req: {
    assignment: AssignmentResponse;
  }): Observable<HttpResponse<SingleResponse<AssignmentResponse>>> {
    return this.http.post(environment.api + `/assignments`, req.assignment, {
      observe: 'response',
    });
  }

  createAssignmentDocument(req: {
    assignmentId: number;
    document: AssignmentDocumentResponse;
  }): Observable<HttpResponse<SingleResponse<AssignmentDocumentResponse>>> {
    return this.http.post(
      environment.api + `/assignments/${req.assignmentId}/documents`,
      req.document,
      { observe: 'response' }
    );
  }

  updateAssignmentDocument(req: {
    assignmentId: number;
    document: AssignmentDocumentResponse;
  }): Observable<HttpResponse<SingleResponse<AssignmentDocumentResponse>>> {
    return this.http.post(
      environment.api +
      `/assignments/${req.assignmentId}/documents/${req.document.id}`,
      req.document,
      { observe: 'response' }
    );
  }

  deleteAssignmentDocument(req: {
    assignmentId: number;
    documentId: number;
  }): Observable<HttpResponse<SingleResponse<AssignmentDocumentResponse>>> {
    return this.http.delete(
      environment.api +
      `/assignments/${req.assignmentId}/documents/${req.documentId}`,
      { observe: 'response' }
    );
  }

  updateAssignment(req: {
    id: number,
    assignment: AssignmentResponse;
  }): Observable<HttpResponse<SingleResponse<AssignmentResponse>>> {
    return this.http.post(
      environment.api + `/assignments/${req.id}`,
      req.assignment,
      { observe: 'response' }
    );
  }

  updateCheckin(req: {
    id: number,
    checkin: CheckinResponse
  }): Observable<HttpResponse<SingleResponse<CheckinResponse>>> {
    return this.http.post(
      environment.api + `/checkins`,
      req.checkin,
      { observe: 'response' }
    );
  }

  deleteAssignment(
    id: string
  ): Observable<HttpResponse<SingleResponse<AssignmentResponse>>> {
    return this.http.delete(environment.api + `/assignments/${id}`, {
      observe: 'response',
    });
  }

  downloadAssignmentsUrl(
    filters: { key: string; value: string | number | boolean }[]
  ) {
    return (
      environment.api +
      this.getSearchURL('/assignments/evaluation/download', {
        filters: filters,
      })
    );
  }

  getAssignmentRatings(id: number): Observable<MultipleResponse<RatingsResponse>> {
    return this.http.get<MultipleResponse<RatingsResponse>>(
      environment.api + `/assignments/${id}/ratings`
    );
  }
  submitRatings(data: any) {
    return this.http.put(environment.api + `/assignments/ratings`, data, { observe: 'response' });
  }

  getFreelancerAssignment(freelancerId: any, assignmentId: any): Observable<SingleResponse<AssignmentDocumentResponse>>  {
    return this.http.get<SingleResponse<AssignmentDocumentResponse>>(environment.api + `/freelancers/${freelancerId}/assignments/${assignmentId}?include=date.job.site,documents.approval.updator,checkins,certificates,revenues.creator,revenues.updator,questionnaire`);
  }

  getSurveyLink(data: any): Observable<any> {
    const url = `/assignments/${data?.id}/freelancers/${data?.freelancer_id}`;
    return this.http.get(environment.api + url);
  }

  updateSurveyLink(data: any): Observable<any> {
    const url = `/assignments/${data?.assignment_id}/freelancers/${data?.freelancer_id}`;
    return this.http.put(environment.api + url, {
      checkin_survey: data?.checkin_survey,
      checkout_survey: data?.checkout_survey
    });
  }
  }
