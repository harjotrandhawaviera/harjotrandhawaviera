import { HttpClient, HttpResponse } from '@angular/common/http';
import { MultipleResponse, SingleResponse } from '../model/response';
import { Observable, Subject } from 'rxjs';

import { BaseService } from './base.service';
import { CertificateResponse } from '../model/certificate.response';
import { CountryResponse } from '../model/country.response';
import { DocumentResponse } from '../model/document.response';
import { FreelancerResponse } from '../model/freelancer.response';
import { Injectable } from '@angular/core';
import { SearchRequestVM } from '../model/search.model';
import { environment } from '../../environments/environment';

@Injectable()
export class FreelancerService extends BaseService {
  public SelectedUserForEmail = new Subject();
  constructor(private http: HttpClient) {
    super();
  }

  getFreelancers(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<FreelancerResponse>> {
    return this.http.get<MultipleResponse<FreelancerResponse>>(
      environment.api + this.getSearchURL('/freelancers', searchRequest)
    );
  }
  getFreelancerRequestData(
    id: number
  ): Observable<SingleResponse<FreelancerResponse>> {
    return this.http.get<SingleResponse<FreelancerResponse>>(
      environment.api + `/freelancers/${id}?include=requests`
    );
  }
  getFreelancerContractType(id: number): Observable<MultipleResponse<any>> {
    return this.http.get<MultipleResponse<any>>(
      environment.api + `/freelancers/${id}/contract-types`
    );
  }
  getFreelancerAllData(
    id: number,
    widthDuplicate = false
  ): Observable<SingleResponse<FreelancerResponse>> {
    return this.http.get<SingleResponse<FreelancerResponse>>(
      environment.api +
      this.getByIdURL(`/freelancers`, {
        id: id,
        include: [
          'user',
          'pictures',
          'documents',
          'references.document',
          'qualifications.document',
          'requests',
          'certificates',
          'ratings.creator',
          'approvals',
          'gtcs.documents',
          'contract_types',
          'trainingAndCertificates',
          'identityDocuments',
          'workHistories',
          'legalDocuments',
          'resume.document'
          // 'workhistory',
          // 'training_and_certificate',
          // 'identitydocument',
          // 'legal_document'
        ],
        filters: widthDuplicate ? [{ key: 'with_duplicates', value: true }] : []
      })
    );
  }

  updateFreelancer(req: { id: number; freelancer: FreelancerResponse }): Observable<HttpResponse<SingleResponse<FreelancerResponse>>> {
    return this.http.post(
      environment.api + `/freelancers/${req.id}`,
      req.freelancer,
      { observe: 'response' }
    );
  }

  updateDocument(req:any, id: number): Observable<HttpResponse<SingleResponse<FreelancerResponse>>> {
    return this.http.put(
      environment.api + `/freelancers/${id}/documents`,
      req,
      { observe: 'response' }
    );
  }

  updateFreelancerPictures(req: {
    id: number;
    pictureRequest: {
      pictures: {
        id: number;
      }[];
    };
  }) {
    return this.http.put(
      environment.api + `/freelancers/${req.id}/pictures`,
      req.pictureRequest,
      { observe: 'response' }
    );
  }
  getCountries(): Observable<MultipleResponse<CountryResponse>> {
    return this.http.get(environment.api + '/countries?limit=1000');
  }
  getDocument(id: number): Observable<SingleResponse<DocumentResponse>> {
    return this.http.get(environment.api + `/documents/${id}`);
  }
  getSkills(): Observable<any> {
    return this.http.get(environment.api + `/skills`);
  }
  getRoles(): Observable<any> {
    return this.http.get(environment.api + `/staff-roles`);
  }
  uploadCollectionDocument(ids: number[]): Observable<HttpResponse<SingleResponse<DocumentResponse>>> {
    return this.http.post(environment.api + `/documents`, { document_ids: ids },
      { observe: 'response' });
  }
  updateFreelancerDocument(req: {
    id: number;
    documentRequest: {
      document_id: number;
      type: string;
    }[];
  }) {
    return this.http.put(
      environment.api + `/freelancers/${req.id}/documents`,
      req.documentRequest,
      { observe: 'response' }
    );
  }
  updateFreelancerGtcDocuments(req: {
    id: number;
    documentRequest: {
      is_checked: any;
      gtc_document_id: any;
      document_id: any;
    }[];
  }) {
    return this.http.put(
      environment.api + `/freelancers/${req.id}/gtcs/documents`,
      { documents: req.documentRequest },
      { observe: 'response' }
    );
  }
  submitApproval(req: {
    id: number,
    type: string,
    state: string,
    comment?: string,
  }) {
    return this.http.post(environment.api + `/freelancers/${req.id}/approvals/${req.type}`, { state: req.state, comment: req.comment });
  }
  getFreelancerGtcCurrent(req: { freelancerId: number, contractTypeId: number }): Observable<any> {
    return this.http.get(environment.api + `/freelancers/${req.freelancerId}/gtcs/current/${req.contractTypeId}?include=contract_type`);
  }
  getGtcCurrent(req: { contractTypeId: number }): Observable<any> {
    return this.http.get(environment.api + `/gtcs/current/${req.contractTypeId}?include=documents,contract_type`);
  }
  getGtcUpcoming(req: { contractTypeId: number }): Observable<any> {
    return this.http.get(environment.api + `/gtcs/next/${req.contractTypeId}?include=documents,contract_type`);
  }
  getFreelancerGtcDocuments(req: { freelancerId: number, include?: string, only_reconfirmations?: boolean }): Observable<any> {
    let url = environment.api + `/freelancers/${req.freelancerId}/gtcs/documents`;
    if (req.include) {
      url = this.appendQueryString(url, 'include', req.include);
    }
    if (req.only_reconfirmations) {
      url = this.appendQueryString(url, 'only_reconfirmations', req.only_reconfirmations);
    }
    return this.http.get(url);
  }
  createDocument(documentIds: string[]) {
    return this.http.post(environment.api + `/documents`, { document_ids: documentIds });
  }

  getProfessionStates() {
    return this.http.get(environment.api + '/profession-states');
  }
  getHealthInsurances(searchRequest: SearchRequestVM): Observable<MultipleResponse<any>> {
    return this.http.get(environment.api + this.getSearchURL(`/health-insurances`, searchRequest));
  }
  updateFreelancerContract(req: { id: number, contract_type_identifier: string, obj: any }) {
    return this.http.post(environment.api + `/freelancers/${req.id}/contract-types/${req.contract_type_identifier}`, req.obj);
  }
  updateFreelancerGtcDocument(req: {
    id: number;
    data: any;
  }) {
    return this.http.post(
      environment.api + `/freelancers/${req.id}/gtcs/documents`,
      req.data,
      { observe: 'response' }
    );
  }

  getFreelancerLK(): Observable<MultipleResponse<FreelancerResponse>> {
    return this.getFreelancers({
      limit: 100000,
      filters: [{ key: 'only_approved', value: true }],
      only_fields: [
        'freelancer.id',
        'freelancer.lastname',
        'freelancer.firstname',
        'freelancer.zip',
        'freelancer.city',
        'user.id',
        'user.status',
      ],
    })
  }
  getDenominations() {
    return this.http.get(environment.api + this.getSearchURL(`/denominations`, { limit: 1000 }));
  }
  getFreelancerCertificates(id: number, searchRequest: SearchRequestVM): Observable<MultipleResponse<CertificateResponse>> {
    return this.http.get<MultipleResponse<CertificateResponse>>(environment.api + this.getSearchURL(`/freelancers/${id}/certificates`, searchRequest));
  }
  getFreelancerAssignment(id: number): Observable<any> {
    // const attend =  '/freelancers/' + id + '/assignments?include=date.job.site,date.job.project.client,checkins.creator,checkins.updator,documents.approval,revenues,invoices&page=1&order_by=appointed_at&order_dir=asc&only_fields=assignment.id,assignment.category,assignment.state,assignment.start_time,assignment.finish_time,assignment.freelancer_id,assignment.has_missing_docs,assignment.planned_costs,assignment.freelancer_costs_net,assignment.comment,date.appointed_at,job.title,client.name,freelancer.id,freelancer.fullname,freelancer.firstname,freelancer.lastname,freelancer.mobile,user.email';
    // const url = `/offers/${id}?include=tender.contract_type&with_deleted=1`;
    return this.http.get<MultipleResponse<any>>(environment.api + `/freelancers/${id}/assignments?include=date.job.site,date.job.project.client,checkins.creator,checkins.updator,documents.approval,revenues,invoices&page=1&order_by=appointed_at&order_dir=asc&only_fields=assignment.id,assignment.category,assignment.state,assignment.start_time,assignment.finish_time,assignment.freelancer_id,assignment.has_missing_docs,assignment.planned_costs,assignment.freelancer_costs_net,assignment.comment,date.appointed_at,job.title,client.name,freelancer.id,freelancer.fullname,freelancer.firstname,freelancer.lastname,freelancer.mobile,user.email`);
  }
}
