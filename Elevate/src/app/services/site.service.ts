import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MultipleResponse } from '../model/response';
import { Observable } from 'rxjs';
import { SearchRequestVM } from '../model/search.model';
import { SiteResponse } from '../model/site.response';
import { environment } from '../../environments/environment';

@Injectable()
export class SiteService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getSites(searchRequest: SearchRequestVM): Observable<MultipleResponse<SiteResponse>> {
    return this.http.get<MultipleResponse<SiteResponse>>(environment.api + this.getSearchURL('/sites', searchRequest));
  }

  getSiteLK(): Observable<MultipleResponse<SiteResponse>> {
    return this.getSites({
      limit: 1000000,
      order_by: 'name',
      only_fields: [
        'site.id',
        'site.name',
        'site.zip',
        'site.city',
        'site.address',
        'site.number',
      ],
    })
  }
}
