import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';
import { TenderRequest, TenderResponse } from '../model/tender.response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobResponse } from '../model/job.response';

@Injectable({
  providedIn: 'root',
})
export class TenderService extends BaseService {
  loggedRole: any;
  constructor(private http: HttpClient) {
    super();
  }

  getTenders(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<TenderResponse>> {
    return this.http.get<MultipleResponse<TenderResponse>>(
      environment.api + this.getSearchURL('/job-advertisements', searchRequest)
    );
  }

  getJobTender(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<TenderResponse>> {
    return this.http.get<MultipleResponse<TenderResponse>>(
      environment.api + this.getSearchURL('/tenders', searchRequest)
    );
  }

  createBulkTenderAssignments(req: {
    tender: TenderRequest;
    jobId: number;
  }): Observable<HttpResponse<SingleResponse<any>>> {
    return this.http.put(environment.api + `/jobs/${req.jobId}`, req.tender, {
      observe: 'response',
    });
  }

  getTenderById(
    idRequest: IdRequestVM
  ): Observable<SingleResponse<TenderResponse>> {
    return this.http.get<SingleResponse<TenderResponse>>(
      environment.api + this.getByIdURL('/tenders', idRequest)
    );
  }

  getAdvertisementById(
    job_advertisement_id: any,
    staff_role_id: any,
    idRequest: IdRequestVM
  ): Observable<SingleResponse<TenderResponse>> {
    return this.http.get<SingleResponse<TenderResponse>>(
      `${environment.api}/job-advertisements/${job_advertisement_id}/roles/${staff_role_id}?include=tender`
    );
  }

  createTender(req: {
    tender: any;
  }): Observable<HttpResponse<SingleResponse<TenderResponse>>> {
    return this.http.post(environment.api + `/tenders`, req.tender, {
      observe: 'response',
    });
  }

  updateTender(req: {
    id: number;
    tender: TenderResponse;
  }): Observable<HttpResponse<SingleResponse<TenderResponse>>> {
    return this.http.post(environment.api + `/tenders/${req.id}`, req.tender, {
      observe: 'response',
    });
  }

  deleteTender(
    job_advertisement_id: string,
    staff_role_id: string
  ): Observable<HttpResponse<SingleResponse<TenderResponse>>> {
    return this.http.delete(`${environment.api}/job-advertisements/${job_advertisement_id}/roles/${staff_role_id}`, {
      observe: 'response',
    });
  }

  getOffers(params: any): Observable<any> {
    let url =
      '/offers?include=tender.contract_type,freelancer&limit=50&order_by=expired_at&order_dir=asc&view=list&only_fields=';
    if (!params) {
      url += `&page=1`;
    }
    if (params?.agent) {
      url += `&agent_id=${params.agent}`;
    }
    if (params?.client) {
      url += `&client_id=${params.client}`;
    }
    if (params?.contractType) {
      url += `&contract_type_id=${params.contractType}`;
    }
    if (params?.project) {
      url += `&project=${params.project}`;
    }
    if (params?.site) {
      url += `&site=${params.site}`;
    }
    if (params?.job) {
      url += `&job=${params.job}`;
    }
    if (params?.freelancer) {
      url += `&freelancer=${params.freelancer}`;
    }
    if (params?.date_from) {
      url += `&date_from=${params.date_from}`;
    }
    if (params?.date_to) {
      url += `&date_to=${params.date_to}`;
    }
    if (params?.search) {
      url += `&search=${params.search}`;
    }
    if (params?.pageIndex) {
      url += `&page=${params.pageIndex}`;
    }
    return this.http.get(environment.api + url);
  }

  getFreelancerOffers(params: any): Observable<any> {
    let url =
      '/offers?include=tender.contract_type,freelancer&limit=12&page=1&order_by=expired_at&order_dir=asc&only_fields=offers.*,freelancer.id,freelancer.fullname,tender.id,tender.contract_type_identifier,tender.snapshots';
    if (params.contractType) {
      url += '&contract_type_id=' + params.contractType;
    }
    if (params.search) {
      url += '&search=' + params.search;
    }
    if (params.value) {
      url += `&with_declined=` + true;
    }
    if (params.status) {
      url += `&status=${params.status}`;
    }

    if (params.pageIndex) {
      url += `&page=${params.pageIndex}`;
    }
    return this.http.get(environment.api + url);
  }

  getFreelancerOfferDetail(id: number): Observable<any> {
    const url = `/offers/${id}?include=tender.contract_type&with_deleted=1`;
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

  createShortlist(data: any): Observable<any> {
    console.log(data);
    const url = `/shortlists`;
    return this.http.put(environment.api + url, data);
  }
}
