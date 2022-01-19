import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MultipleResponse } from '../model/response';
import { AccountingResponse } from '../model/accounting.response';
import { UpdateInvoice } from '../model/accounting.model';

@Injectable({
  providedIn: 'root',
})
export class AccountingService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  accountUsers(searchRequest: string): Observable<AccountingResponse> {
    return this.http.get<MultipleResponse<AccountingResponse>>(environment.api + searchRequest);
  }

  listCustomer(params: string): Observable<any> {
    return this.http.get(environment.api + params);
  }

  listProject(params: string): Observable<any> {
    return this.http.get(environment.api + params);
  }

  listJobs(params: string): Observable<any> {
    return this.http.get(environment.api + params);
  }

  listTiles(params: string): Observable<any> {
    return this.http.get(environment.api + params);
  }

  downloadReports(id: number): Observable<Blob> {
    return this.http.get(environment.api + '/documents/' + id, { responseType: 'blob' } );
  }

  updateInvoiceSvc(paramId: number, updateInvoiceData: UpdateInvoice): Observable<AccountingResponse> {
    return this.http.post(environment.api + `/bills/${paramId}`, updateInvoiceData);
  }

  deleteInvoice(id: number | undefined): Observable<AccountingResponse> {
    return this.http.delete(environment.api + `/bills/` + id);
  }

  exportListData(searchRequest: string): Observable<AccountingResponse> {
    return this.http.get<MultipleResponse<AccountingResponse>>(environment.api + searchRequest);
  }

  loadExportData(searchRequest: string): Observable<AccountingResponse> {
    return this.http.get<MultipleResponse<AccountingResponse>>(environment.api + searchRequest);
  }

  revenuesDetails(paramId: number, updateInvoiceData: string): Observable<AccountingResponse> {
    return this.http.get(environment.api + `/revenues/${paramId}${updateInvoiceData}`);
  }

  deleteSalesInvoice(id: number | undefined): Observable<AccountingResponse> {
    return this.http.delete(environment.api + `/revenues/${id}`);
  }

  accountfilelist(searchRequest: string): Observable<AccountingResponse> {
    return this.http.get<MultipleResponse<AccountingResponse>>(environment.api + searchRequest);
  }
}
