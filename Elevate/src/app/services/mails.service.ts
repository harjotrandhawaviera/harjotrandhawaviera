import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { JobDocumentResponse, JobResponse } from '../model/job.response';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class MailsService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  create(recipientIds: string[], subject: string, content: string, attachment_id: number) {
    let customHeaders = new HttpHeaders();
    let language = localStorage.getItem('language');
    if (!language) {
      language = environment.defaultLanguage;
    }
    customHeaders = customHeaders.append('Accept-Language', language);
    return this.http.post(environment.api + '/mails', {
      recipient_ids: recipientIds,
      subject: subject,
      content: content,
      attachment_id: attachment_id || undefined
    }, { observe: 'response', headers: customHeaders });
  }
}
