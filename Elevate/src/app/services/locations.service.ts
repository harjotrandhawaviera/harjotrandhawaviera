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
export class LocationsService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getLocation(searchRequest: SearchRequestVM): Observable<MultipleResponse<any>> {
    return this.http.get<MultipleResponse<any>>(environment.api + this.getSearchURL('/locations', searchRequest));
  }
}
