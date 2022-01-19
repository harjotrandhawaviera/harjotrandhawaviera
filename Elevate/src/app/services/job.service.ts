import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { JobDocumentResponse, JobResponse } from '../model/job.response';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { JobState } from '../jobs/state/job.reducer';
import { TenderResponse } from '../model/tender.response';

@Injectable({
  providedIn: 'root',
})
export class JobService extends BaseService {
  loggedRole: any;
  constructor(private http: HttpClient,
              private store: Store<JobState>) {
    super();
  }

  getJobs(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<JobResponse>> {
    return this.http.get<MultipleResponse<JobResponse>>(
      environment.api + this.getSearchURL('/jobs', searchRequest)
    );
  }

  getJobsByProjectId(
    searchRequest: SearchRequestVM, id?: number
  ): Observable<MultipleResponse<JobResponse>> {
    return this.http.get<MultipleResponse<JobResponse>>(
      environment.api + this.getSearchURL(id ? '/jobs?client_id='+id : '/jobs', searchRequest)
    );
  }

  getJobsByClientId(
    searchRequest: SearchRequestVM, id?: number
  ): Observable<MultipleResponse<JobResponse>> {
    return this.http.get<MultipleResponse<JobResponse>>(
      environment.api + this.getSearchURL(id ? '/jobs?client_id='+id : '/jobs', searchRequest)
    );
  }

  getJobAdvertisementById(
    searchRequest: SearchRequestVM, id?: number
  ): Observable<MultipleResponse<JobResponse>> {
    return this.http.get<MultipleResponse<JobResponse>>(
      environment.api + this.getSearchURL('/job-advertisements?include=site,project.client.contacts,contract_type&limit=12&job_id=' + id, searchRequest)
    );
  }

  getJobsLK(): Observable<MultipleResponse<JobResponse>> {
    return this.getJobs({
      limit: 100000,
      order_by: 'title',
      only_fields: ['job.id', 'job.title']
    });
  }

  deleteJob(id: string): Observable<HttpResponse<SingleResponse<JobResponse>>> {
    return this.http.delete(environment.api + `/jobs/${id}`, {
      observe: 'response',
    });
  }

  getJobById(idRequest: IdRequestVM): Observable<SingleResponse<JobResponse>> {
    return this.http.get<SingleResponse<JobResponse>>(
      environment.api + this.getByIdURL('/jobs', idRequest)
    );
  }

  createBulkJob(req: {
    job: JobResponse;
    projectId: number;
  }): Observable<HttpResponse<SingleResponse<JobResponse>>> {
    return this.http.put(
      environment.api + `/projects/${req.projectId}/jobs`,
      req.job,
      {
        observe: 'response',
      }
    );
  }

  updateJob(req: {
    job: JobResponse;
  }): Observable<HttpResponse<SingleResponse<JobResponse>>> {
    return this.http.post(environment.api + `/jobs/${req.job.id}`, req.job, {
      observe: 'response',
    });
  }

  createJobDocument(req: {
    jobId: number;
    document: JobDocumentResponse;
  }): Observable<HttpResponse<SingleResponse<JobDocumentResponse>>> {
    return this.http.post(
      environment.api + `/jobs/${req.jobId}/documents`,
      req.document,
      { observe: 'response' }
    );
  }
  updateJobDocument(req: {
    jobId: number;
    document: JobDocumentResponse;
  }): Observable<HttpResponse<SingleResponse<JobDocumentResponse>>> {
    return this.http.post(
      environment.api + `/jobs/${req.jobId}/documents/${req.document.id}`,
      req.document,
      { observe: 'response' }
    );
  }
  deleteJobDocument(req: {
    jobId: number;
    documentId: number;
  }): Observable<HttpResponse<SingleResponse<JobDocumentResponse>>> {
    return this.http.delete(
      environment.api + `/jobs/${req.jobId}/documents/${req.documentId}`,
      { observe: 'response' }
    );
  }
  getFreelancerJobOffer( params?: any): Observable<any> {
    let url = `/job-advertisements?include=site,project.client.contacts,contract_type&limit=12`;
    if (params?.search?.contractType) {
      url += '&contract_type_id=' + params?.search?.contractType;
    }
    if (params?.search?.certificate) {
      url += '&certificate_id=' + params?.search?.certificate;
    }
    if (params?.search?.page) {
      url += '&page=' + params?.search?.page;
    }
    if (params?.search?.search) {
      url += '&search=' + params?.search?.search;
    }
    if (params?.search?.zip_from) {
      url += '&zip_from=' + params?.search?.zip_from;
    }
    if (params?.search?.zip_to) {
      url += '&zip_to=' + params?.search?.zip_to;
    }
    if (params?.search?.value) {
      url += '';
    }
    if (params?.search?.is_matching) {
      url += '&is_matching=' + true;
    }
    if (params?.search?.is_match) {
      url += '&is_match=' + true;
    }
    if (params?.search?.is_not_matching) {
      url += '&is_not_matching=' + true ;
    }
    if (params?.search?.start) {
      url += '&date_from=' + params?.search?.start;
    }
    if (params?.search?.end) {
      url += '&date_to=' + params?.search?.end;
    }
    if (params?.search?.only_recommended) {
      url += '&only_recommended=' + params?.search?.only_recommended;
    }
    if (params?.search?.is_invited) {
      url += '&is_invited=' + params?.search?.is_invited;
    }
    return this.http.get(environment.api + url);
  }

  getFreelancerJobOfferDetails( params?: any): Observable<any>{
    const url = `/job-advertisements?include=site,project.client.contacts,tenders.certificates,certificates,contract_type&is_matching=true`;
    return this.http.get(environment.api + url);
  }

  getFreelancerJobOfferQuestion(params?: any, jobId?: number): Observable<any> {
    const url = `/jobs/${jobId}/messages`;
    return this.http.post(environment.api + url, params);
  }

  getFreelancerJobOfferSubmittedOffers(params?: any): Observable<any> {
    const url = `/offers`;
    return this.http.put(environment.api + url, params);
  }

  getFreelancerJobOfferRejectedOffers(params?: any): Observable<any> {
    const url = `/tenders/${params.tender_id}/denials`;
    return this.http.post(environment.api + url, params);
  }

  getJobAdvertise(params?: any): Observable<any> {
    const url = `/job-advertisements`;
    return this.http.put(environment.api + url, params);
  }

  getAdvertisementById(
    job_advertisement_id: any,
    staff_role_id: any,
    is_match: any,
    idRequest: IdRequestVM
  ): Observable<SingleResponse<TenderResponse>> {
    return this.http.get<SingleResponse<TenderResponse>>(
      `${environment.api}/job-advertisements/${job_advertisement_id}/roles/${staff_role_id}?include=tender&is_match=${is_match}`
    );
  }

  userList(page: any): Observable<any> {
    console.log(page)
    let url = '/admin/adminusers?creator=0&include=user.freelancer&only_fields=freelancer.id,freelancer.firstname,freelancer.lastname,freelancer.fullname,freelancer.zip,freelancer.city,freelancer.mobile,freelancer.avg_assignment_rating,freelancer.country,freelancer.face_picture_id,user.id,user.email,freelancer.gender,freelancer.birthdate,user.has_requested_account_delete,user.has_requested_password_reset,user.status,user.active_at,user.created_at,user.confirmed_at,freelancer.ready_for_active';
    if (page?.payload) {
      url += '&page=' + page?.payload?.page;
    }
    if (page?.payload && page.payload?.limit) {
      url += '&limit=' + page?.payload?.limit;
    }
    if (page?.payload && page.payload?.filters) {
      url += '&' + page?.payload?.filters;
    }
    if (page?.payload && page.payload?.agent) {
      url += '&agent_id=' + page?.payload?.agent;
    }
    if (page?.payload && page.payload?.state) {
      url += '&state=' + page?.payload?.state;
    }
    if (page?.payload && page.payload?.jobName) {
      url += '&job_id=' + page?.payload?.jobName;
    }
    if (page?.payload && page.payload?.dateFrom) {
      url += '&&date_from=' + page?.payload?.dateFrom;
    }
    if (page?.payload && page.payload?.dateTo) {
      url += '&date_to=' + page?.payload?.dateTo;
    }
    if (page?.payload && page.payload?.zipFrom) {
      url += '&zip_from=' + page?.payload?.zipFrom;
    }
    if (page?.payload && page.payload?.zipTo) {
      url += '&zip_to=' + page?.payload?.zipTo;
    }
    if (page?.payload && page.payload?.search) {
      url += '&search=' + page?.payload?.search;
    }
    // if (page?.payload && page.payload?.client) {
    //   url += '&client=' + page?.payload?.client;
    // }
    // if (page?.payload && page.payload?.job) {
    //   url += '&job_id=' + page?.payload?.job;
    // }
    // if (page?.payload && page.payload?.publishJob) {
    //   url += '&publishJob_id=' + page?.payload?.publishJob;
    // }
    if (page?.payload && page.payload?.city) {
      url += '&city=' + page?.payload?.city;
    }
    if (page?.payload && page.payload?.postcode) {
      url += '&postcode=' + page?.payload?.postcode;
    }
    if (page?.payload && page.payload?.gender) {
      url += '&gender=' + page?.payload?.gender;
    }
    if (page?.payload && page.payload?.age_group) {
      url += '&age_group=' + page?.payload?.age_group;
    }
    if (page?.payload && page.payload?.skill) {
      url += '&skill=' + page?.payload?.skill;
    }
    if (page?.payload && page.payload?.certificates) {
      url += '&certificates=' + page?.payload?.certificates;
    }
    if (page?.payload && page.payload?.language) {
      url += '&language=' + page?.payload?.language;
    }
    if (page?.payload && page.payload?.status) {
      url += '&status=' + page?.payload?.status;
    }
    return this.http.get(environment.api + url);
  }

  createInvite(search: any) {
    const url = `/job-invites`;
    return this.http.post(environment.api + url, search);
  }

  getJobInvite(updateValue: any): Observable<any>{
    let url = `/job-invites`;
    if (updateValue?.contractType) {
      url += '&contract_type=' + updateValue?.contractType;
    }
    return this.http.get(environment.api + url);
  }

  getShortlistOfferList(updateValue: any): Observable<any>{
    let url = `/shortlists?include=tender.contract_type,freelancer&limit=50&order_dir=asc&view=list&only_fields=`;
    if (updateValue?.agent) {
      url += '&agent_id=' + updateValue?.agent;
    }
    if (updateValue?.client) {
      url += '&client_id=' + updateValue?.client;
    }
    if (updateValue?.contractType) {
      url += '&contract_type_id=' + updateValue?.contractType;
    }
    if (updateValue?.project) {
      url += '&project=' + updateValue?.project;
    }
    if (updateValue?.site) {
      url += '&site=' + updateValue?.site;
    }
    if (updateValue?.job) {
      url += '&job=' + updateValue?.job;
    }
    if (updateValue?.freelancer) {
      url += '&freelancer=' + updateValue?.freelancer;
    }
    if (updateValue?.start) {
      url += '&date_from=' + updateValue?.start;
    }
    if (updateValue?.end) {
      url += '&date_to=' + updateValue?.end;
    }
    if (updateValue?.search) {
      url += '&search=' + updateValue?.search;
    }
    return this.http.get(environment.api + url);
  }

  getShortlistOfferDetail(id: number): Observable<any> {
    const url = `/shortlists/${id}?include=tender.contract_type`;
    return this.http.get(environment.api + url);
  }

  confirmOffer(data: any): Observable<any> {
    const url = `/freelancers/${data.fid}/assignments`;
    return this.http.post(environment.api + url, {
      offer_id: data?.offer_id,
      assignment_id: data?.assignment_id,
      checkin_survey: data?.checkin_survey,
      checkout_survey: data?.checkout_survey
    });
  }

  rejectOffer(data: any): Observable<any> {
    const url = `/offers/${data?.id}`;
    return this.http.delete(environment.api + url);
  }

  adminFreelancerData(data: any): Observable<any> {
    const url = `/freelancers/${data.fid}?include=user,requests`;
    return this.http.post(environment.api + url, {
      freelancer_id: data?.freelancer_id,
    });
  }

  confirmJobOffer(data: any): Observable<any> {
    const url = `/freelancers/${data.freelancer_id}/assignments`;
    return this.http.post(environment.api + url, {
      offer_id: data?.offer_id,
      assignment_id: data?.assignment_id,
    });
  }

}
