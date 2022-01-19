import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {MultipleResponse} from '../model/response';
import {AdministrationModel} from '../model/administartion.model';


@Injectable({
  providedIn: 'root',
})

export class AdministrationServices extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  deployment(searchRequest: any): Observable<AdministrationModel> {
    return this.http.get<MultipleResponse<AdministrationModel>>(environment.api + searchRequest);
  }
  administrationUsers(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get<MultipleResponse<AdministrationModel>>(environment.api + searchRequest);
  }

  deployDetails(paramId: number, updateInvoiceData: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + `/sites/${paramId}${updateInvoiceData}`);
  }

  deployClientDetails(paramId: number, updateInvoiceData: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + `/clients/${paramId}${updateInvoiceData}`);
  }

  deletedeploy(id: number | undefined): Observable<AdministrationModel> {
    return this.http.delete(environment.api + `/sites/` + id);
  }

  deleteFieldClient(id: number | undefined, cid: number | undefined): Observable<AdministrationModel> {
    return this.http.delete(environment.api + `/sites/` + id + `/clients/` + cid);
  }

  addDeploy(search: any): Observable<AdministrationModel> {
    return this.http.post<AdministrationModel>(environment.api + '/sites', search);
  }

  // updateRights(search: any): Observable<AdministrationModel> {
  //   return this.http.post<AdministrationModel>(environment.api + 'rights', search);
  // }
  addNewInsurance(search: any): Observable<AdministrationModel> {
    return this.http.post<AdministrationModel>(environment.api + '/insurances', search);
  }

  updatedeploySvc(id: any, params: any): Observable<AdministrationModel> {
    return this.http.post(environment.api + `/sites/` + `${id}`, params);
  }

  updateCdeploySvc(id: any, params: any): Observable<AdministrationModel> {
    return this.http.post(environment.api + `/contacts/` + `${id}`, params);
  }

  updateFieldClient(id: any, params: any): Observable<AdministrationModel> {
    return this.http.post(environment.api + `/sites/` + `${id}` + `/clients`, params);
  }


  InsuranceDetails(paramId: number, updateInvoiceData: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + `${updateInvoiceData}/${paramId}`);
  }

  updateInsuranceSvc(id: any, params: any): Observable<AdministrationModel> {
    return this.http.post(environment.api + `/health-insurances/` + `${id}`, params);
  }


  addInsurance(search: any): Observable<AdministrationModel> {
    return this.http.post<AdministrationModel>(environment.api + '/health-insurances', search);
  }

  deleteinsurance(id: number | undefined): Observable<AdministrationModel> {
    return this.http.delete(environment.api + `/health-insurances/` + id);
  }

  Incentive(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + searchRequest);
  }

  updateIncentiveSvc(id: any, params: any): Observable<AdministrationModel> {
    return this.http.post(environment.api + `/incentive-models/` + `${id}`, params);
  }

  FrameworkAgreement(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + searchRequest);
  }

  FrameworkDetails(paramId: number, updateInvoiceData: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + `/gtcs/${paramId}${updateInvoiceData}`);
  }

  updateFrameworkSvc(id: any, params: any): Observable<AdministrationModel> {
    return this.http.post(environment.api + `/gtcs/` + `${id}`, params);
  }

  loadRole(searchRequest: any): Observable<AdministrationModel> {
    return this.http.get<MultipleResponse<AdministrationModel>>(environment.api + searchRequest);
  }
  loadRights(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + searchRequest);
  }

  Right(name: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + `/roles/${name}/rights`);
  }

  updateRights(name: any, searchRequest: string, data: any): Observable<AdministrationModel> {
    return this.http.put(environment.api  + `/roles/${name}/rights`, data);
  }

  LogsList(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + searchRequest);
  }
  LogsDataList(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + searchRequest);
  }

  MailLogsDataList(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + searchRequest);
  }


  addgtcs(search: any): Observable<AdministrationModel> {
    return this.http.post<AdministrationModel>(environment.api + '/gtcs', search);
  }

  ClientList(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + searchRequest);
  }

  SiteDataList(searchRequest: string): Observable<AdministrationModel> {
    return this.http.get(environment.api + searchRequest);
  }
}

