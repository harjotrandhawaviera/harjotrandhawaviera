import { OrderResponse } from './../model/order.response';
import { ClientResponse, ClientSearchRequest } from '../model/client.response';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { MultipleResponse, SingleResponse } from '../model/response';
import { IdRequestVM, SearchRequestVM } from '../model/search.model';
import { environment } from '../../environments/environment';
import { ContactResponse } from '../model/contact.response';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getClients(searchRequest: SearchRequestVM): Observable<MultipleResponse<ClientResponse>> {
    return this.http.get<MultipleResponse<ClientResponse>>(environment.api + this.getSearchURL('/clients', searchRequest));
  }
  getClientOrders(clientId: string, searchRequest: SearchRequestVM): Observable<MultipleResponse<OrderResponse>> {
    return this.http.get<MultipleResponse<OrderResponse>>(environment.api + this.getSearchURL(`/clients/${clientId}/orders`, searchRequest));
  }
  getClientLK(): Observable<MultipleResponse<ClientResponse>> {
    return this.getClients({
      limit: 100000, order_by: 'name',
      only_fields: ['client.id', 'client.name', 'client.zip', 'client.city', 'client.address']
    });
  }
  getClientById(idRequest: IdRequestVM): Observable<SingleResponse<ClientResponse>> {
    return this.http.get<SingleResponse<ClientResponse>>(environment.api + this.getByIdURL('/clients', idRequest));
  }
  getClientContactByClientId(id: string, searchRequest: SearchRequestVM): Observable<MultipleResponse<ContactResponse>> {
    return this.http.get<MultipleResponse<ContactResponse>>(environment.api + this.getSearchURL(`/clients/${id}/contacts`, searchRequest));
  }
  deleteClient(id: string): Observable<any> {
    return this.http.delete(environment.api + `/clients/${id}`, {
      observe: 'response'
    });
  }
  createClient(req: { client: ClientResponse }): Observable<HttpResponse<SingleResponse<ClientResponse>>> {
    return this.http.post(environment.api + `/clients`, req.client, { observe: 'response' });
  }
  updateClient(req: { client: ClientResponse }): Observable<HttpResponse<SingleResponse<ClientResponse>>> {
    return this.http.post(environment.api + `/clients/${req.client.id}`, req.client, { observe: 'response' });
  }
  createContact(req: { contact: ContactResponse }): Observable<HttpResponse<SingleResponse<ContactResponse>>> {
    return this.http.post(environment.api + `/contacts`, req.contact, { observe: 'response' });
  }
  updateContact(req: { id: string, contact: ContactResponse }): Observable<any> {
    return this.http.post(environment.api + `/contacts/${req.id}`, req.contact, { observe: 'response' });
  }
  updateClientContact(req: { clientId: string, id: string, contact: ContactResponse }): Observable<any> {
    const obj: {
      is_client_user?: boolean,
      is_field_user?: boolean
    } = {};
    if (req.contact.is_client_user) {
      obj.is_client_user = true;
    }
    if (req.contact.is_field_user) {
      obj.is_field_user = true;
    }
    return this.http.post(environment.api + `/clients/${req.clientId}/contacts/${req.id}`, obj, { observe: 'response' });
  }
  createClientContact(req: { clientId: string, id: string, contact: ContactResponse }): Observable<any> {
    const obj: {
      contact_id?: string,
      is_client_user?: boolean,
      is_field_user?: boolean
    } = {};
    obj.contact_id = req.id;
    if (req.contact.is_client_user) {
      obj.is_client_user = true;
    }
    if (req.contact.is_field_user) {
      obj.is_field_user = true;
    }
    return this.http.post(environment.api + `/clients/${req.clientId}/contacts`, obj, { observe: 'response' });
  }
  deleteContact(contact: { id: string, clientId: string }): Observable<any> {
    return this.http.delete(environment.api + `/clients/${contact.clientId}/contacts/${contact.id}`, {
      observe: 'response'
    });
  }
}
