import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../model/order.response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }
  getOrders(searchRequest: SearchRequestVM): Observable<MultipleResponse<OrderResponse>> {
    return this.http.get<MultipleResponse<OrderResponse>>(environment.api + this.getSearchURL('/orders', searchRequest));
  }
  getOrderById(idRequest: IdRequestVM): Observable<SingleResponse<OrderResponse>> {
    return this.http.get<SingleResponse<OrderResponse>>(environment.api + this.getByIdURL('/orders', idRequest));
  }
  updateOrder(id: number, order: OrderResponse): Observable<HttpResponse<SingleResponse<OrderResponse>>> {
    return this.http.post(environment.api + `/orders/${id}`, order, { observe: 'response' });
  }
  createOrder(order: OrderResponse): Observable<HttpResponse<SingleResponse<OrderResponse>>> {
    return this.http.post(environment.api + `/orders`, order, { observe: 'response' });
  }
  deleteOrder(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(environment.api + `/orders/${id}`, { observe: 'response' });
  }
}
