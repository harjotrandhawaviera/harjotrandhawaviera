import { HttpClient, HttpResponse } from '@angular/common/http';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class MessageService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  /**
    * creates a message
    * @param {integer} recipientUserId, the user id of  the recipient
    * @param {object} message, the message object containing subject and content
    * @return {promise}
    */
  create(recipientUserId: any, message: any) {
    message.recipient_user_id = recipientUserId;
    return this.http.post(environment.api + '/messages', message, { observe: 'response' });
  }
}
