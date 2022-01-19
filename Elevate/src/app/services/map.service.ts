import { ClientResponse, ClientSearchRequest } from '../model/client.response';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { IdRequestVM, SearchRequestVM } from '../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseService } from "./base.service";
import { ContactResponse } from '../model/contact.response';
import { Injectable } from "@angular/core";
import { OrderResponse } from './../model/order.response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapService extends BaseService {
  apiLoaded: Observable<boolean> = of(false);
  isApiLoaded = false;
  constructor(private http: HttpClient) {
    super();
  }

  loadMap(): Observable<boolean> {
    if (this.isApiLoaded) {
      return of(true);
    }
    //this.http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDFl8V9etwbVuyi_zFx7r1_PFajQCABrCU', 'callback')
    return this.http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyADNMnC5iamSy04c5bN9bC90o-nZF64D8w&sensor=true', 'callback')
      .pipe(
        map(() => {
          this.isApiLoaded = true;
          return true;
        }),
        catchError(() => of(false)),
      );

  }
}
