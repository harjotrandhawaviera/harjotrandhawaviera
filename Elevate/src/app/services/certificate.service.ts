import { HttpClient, HttpResponse } from '@angular/common/http';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { CertificateResponse } from './../model/certificate.response';
import { ContractTypeResponse } from '../model/contract-type.response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchRequestVM } from './../model/search.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class CertificateService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }
  getCertificate(searchRequest: SearchRequestVM): Observable<MultipleResponse<CertificateResponse>> {
    return this.http.get<MultipleResponse<CertificateResponse>>(environment.api + this.getSearchURL('/certificates', searchRequest));
  }
  getFreelancerAudits(freelancerId: number): Observable<any> {
    return this.http.get<any>(environment.api + `/freelancers/${freelancerId}/audits`);
  }
  getCertificateById(id: number): Observable<SingleResponse<CertificateResponse>> {
    return this.http.get<any>(environment.api + `/certificates/${id}?include=training,exam.questions.answers`);
  }
  getFreelancerCertificate(certificateId: number, freelancerId: number): Observable<SingleResponse<CertificateResponse>> {
    return this.http.get<any>(environment.api + `/freelancers/${freelancerId}/certificates/${certificateId}?include=training,exam`);
  }
  updateCertificate(id: number, certificate: CertificateResponse): Observable<HttpResponse<SingleResponse<CertificateResponse>>> {
    return this.http.post(environment.api + `/certificates/${id}`, certificate, {
      observe: 'response'
    });
  }
  updateAudit(identifier: any, data: any) {
    return this.http.post(environment.api + `/audits/${identifier}`, data, {
      observe: 'response'
    });
  }
}
