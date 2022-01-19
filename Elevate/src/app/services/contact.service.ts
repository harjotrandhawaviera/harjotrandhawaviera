import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContactResponse } from '../model/contact.response';
import { MultipleResponse } from '../model/response';
import { SearchRequestVM } from '../model/search.model';
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root',
})
export class ContactService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getContacts(searchRequest: SearchRequestVM): Observable<MultipleResponse<ContactResponse>> {
    return this.http.get<MultipleResponse<ContactResponse>>(environment.api + this.getSearchURL('/contacts', searchRequest));
  }
}
