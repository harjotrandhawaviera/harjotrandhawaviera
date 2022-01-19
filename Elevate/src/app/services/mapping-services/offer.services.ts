import { HttpClient, HttpResponse } from '@angular/common/http';
import { SearchRequestVM } from '../../model/search.model';
import { MultipleResponse } from '../../model/response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../base.service';
import {OfferResponse} from '../../model/offer.response';

@Injectable({
  providedIn: 'root',
})

export class OfferServices extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getOffers(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<OfferResponse>> {
    return this.http.get<MultipleResponse<OfferResponse>>(
      environment.api + this.getSearchURL('/offers', searchRequest)
    );
  }

}
