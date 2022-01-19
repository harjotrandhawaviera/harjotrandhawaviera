import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { JobDocumentResponse, JobResponse } from '../model/job.response';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class SmsService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  create(recipientIds: string[], campaign: string, purpose: string, message: string) {
    return this.http.post(environment.api + '/sms', {
      recipient_ids: recipientIds,
      campaign: campaign,
      purpose: purpose,
      message: message
    }, { observe: 'response' });
  }
}
