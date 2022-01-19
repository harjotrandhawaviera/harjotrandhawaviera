import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MultipleResponse, SingleResponse } from '../model/response';
import { ContractTypeResponse } from '../model/contract-type.response';

@Injectable({
  providedIn: 'root',
})
export class ContractTypesService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }
  getContractTypes(searchRequest: SearchRequestVM): Observable<MultipleResponse<ContractTypeResponse>> {
    return this.http.get<MultipleResponse<ContractTypeResponse>>(environment.api + this.getSearchURL('/contract-types', searchRequest));
  }
  getContractType(idRequest: IdRequestVM): Observable<SingleResponse<ContractTypeResponse>> {
    return this.http.get<SingleResponse<ContractTypeResponse>>(environment.api + this.getByIdURL('/contract-types', idRequest));
  }
  getContractTypeLK(): Observable<MultipleResponse<ContractTypeResponse>> {
    return this.getContractTypes({
      include: ['certificate.training', 'certificate.exam']
    });
  }
  // nameList(includeCertificate?: boolean): Observable<any> {
  //   return this.getContractTypes(includeCertificate ? { include: 'certificate.training,certificate.exam' } : null);
  // }
  // getContractTypes(data?: any) {
  //   const params = ['limit', 'page', 'order_by', 'order_dir', 'identifier', 'search', 'include'];
  //   const path = this.query('/contract-types', params, data || {});
  //   return this.http.get(environment.api + this.transformPath(path, data));
  // }

}
