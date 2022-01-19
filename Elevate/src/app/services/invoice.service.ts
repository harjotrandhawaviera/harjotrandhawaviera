import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { InvoiceResponse } from '../model/invoice.response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class InvoiceService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }
  getInvoices(searchRequest: SearchRequestVM): Observable<MultipleResponse<InvoiceResponse>> {
    return this.http.get<MultipleResponse<InvoiceResponse>>(environment.api + this.getSearchURL('/invoices', searchRequest));
  }
  getFreelancerInvoices(freelancerId: string, searchRequest: SearchRequestVM): Observable<MultipleResponse<InvoiceResponse>> {
    return this.http.get<MultipleResponse<InvoiceResponse>>(environment.api + this.getSearchURL(`/freelancers/${freelancerId}/invoices`, searchRequest));
  }
  getInvoice(idRequestVM: IdRequestVM): Observable<SingleResponse<InvoiceResponse>> {
    return this.http.get<SingleResponse<InvoiceResponse>>(environment.api + this.getByIdURL('/invoices', idRequestVM));
  }
  getFreelancerInvoice(freelancerId: any, idRequestVM: IdRequestVM): Observable<SingleResponse<InvoiceResponse>> {
    return this.http.get<SingleResponse<InvoiceResponse>>(environment.api + this.getByIdURL(`/freelancers/${freelancerId}/invoices`, idRequestVM));
  }
  getDownloadInvoiceURL(searchRequest: SearchRequestVM) {
    return environment.api + this.getSearchURL('/invoices/download', searchRequest);
  }
  getFreelancerJobsAssignments(freelancerId: number | string): Observable<MultipleResponse<any>> {
    return this.http.get(environment.api + `/freelancers/${freelancerId}/jobs/assignments?include=site,dates.assignments.checkins.creator,dates.assignments.documents.approval.updator,dates.assignments.incentive_model&only_invoiceable=true`);
  }
  getFreelancerJobWithAssignments(freelancerId: number | string, jobId: number | string, only_invoiceable: boolean): Observable<SingleResponse<any>> {
    if (only_invoiceable) {
      return this.http.get(environment.api + `/freelancers/${freelancerId}/jobs/${jobId}/assignments?include=site,dates.assignments.checkins.creator,dates.assignments.documents.approval.updator,dates.assignments.incentive_model,dates.assignments.invoices,revenues.creator,revenues.updator,documents&only_invoiceable=true`);
    } else {
      return this.http.get(environment.api + `/freelancers/${freelancerId}/jobs/${jobId}/assignments?include=site,dates.assignments.checkins.creator,dates.assignments.documents.approval.updator,dates.assignments.incentive_model,dates.assignments.invoices,revenues.creator,revenues.updator,documents`);
    }
  }
  getFreelancerMasterData(id: number | string): Observable<SingleResponse<any>> {
    return this.http.get(environment.api + `/freelancers/${id}?include=user,requests`)
  }
  createFreelancerInvoice(freelancerId: number | string, data: any): Observable<HttpResponse<SingleResponse<InvoiceResponse>>> {
    return this.http.post(environment.api + `/freelancers/${freelancerId}/invoices`, data, { observe: 'response' });
  }
  updateFreelancerInvoice(id: number | string, freelancerId: number | string, data: any): Observable<any> {
    return this.http.post(environment.api + `/freelancers/${freelancerId}/invoices/${id}`, data, { observe: 'response' });
  }
  updateInvoice(id: number | string, data: any): Observable<any> {
    return this.http.post(environment.api + `/invoices/${id}`, data, { observe: 'response' });
  }
  createInvoiceApproval(invoiceId: any, state: string, comment: string): Observable<HttpResponse<any>> {
    const data: any = { invoice_id: invoiceId, state: state, comment: comment };
    return this.http.post(environment.api + `/invoices/${data.invoice_id}/approvals?include=invoice`, data, { observe: 'response' });
  }
  updateInvoiceApproval(invoiceId: any, approvalId: any, state: string, comment: string): Observable<HttpResponse<any>> {
    const data: any = { invoice_id: invoiceId, state: state, comment: comment };
    return this.http.post(environment.api + `/invoices/${data.invoice_id}/approvals/${approvalId}?include=invoice`, data, { observe: 'response' });
  }
  updateSurveyInstanceApproval(survey_instance_id: string, id: string, data: any) {
    return this.http.post(environment.api + `/survey-instances/${survey_instance_id}/approvals/${id}`, data);
  }
  updateDocumentApproval(document_id: string, id: string, data: any) {
    return this.http.post(environment.api + `/documents/${document_id}/approvals/${id}`, data);
  }
  getPaymentModels(): Observable<MultipleResponse<any>> {
    return this.http.get<MultipleResponse<any>>(environment.api + `/payment-models`);
  }
  getFreelancerAssignments(freelancerId: any, pageSize: number, pageIndex: number): Observable<MultipleResponse<any>> {
    const searchRequest: SearchRequestVM = {
      include: ['date.job.site,freelancers.user,date.job.project.client,checkins.creator,checkins.updator,documents,revenues,invoices'],
      order_by: 'appointed_at',
      order_dir: 'asc',
      limit: pageSize,
      page: pageIndex,
      filters: [
        {
          key: 'only_prepareable', value: true
        }
      ]
    }
    return this.http.get(environment.api + this.getSearchURL(`/freelancers/${freelancerId}/assignments`, searchRequest))
  }
  removeAssignmentDocument(assignment_id: any, document_id: any) {
    return this.http.delete(environment.api + `/assignments/${assignment_id}/documents/${document_id}`, { observe: 'response' });
  }
  createAssignmentDocument(assignment_id: any, document_id: any, type: any) {
    const obj = {
      document_id: document_id,
      type: type,
    };
    return this.http.post(environment.api + `/assignments/${assignment_id}/documents`, obj, { observe: 'response' });
  }
  generateFreelancerInvoice(freelancer_id: any, obj: any): Observable<any> {
    return this.http.post(environment.api + `/freelancers/${freelancer_id}/invoices/generate`, obj);
  }
}
