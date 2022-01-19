/* eslint-disable id-blacklist */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */

import { ContactSearchVM, ContactVM } from '../../model/contact.model';

import { ClientResponse } from '../../model/client.response';
import { ClientVM } from '../../model/client.model';
import { ContactResponse } from '../../model/contact.response';
import { Injectable } from '@angular/core';
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { SearchRequestVM } from '../../model/search.model';
import { SiteMappingService } from './site-mapping.service';
import { SiteResponse } from '../../model/site.response';
import { SiteVM } from '../../model/site.model';

@Injectable()
export class ContactMappingService {
  constructor() {

  }
  contactSearchResponseToVM(response: MultipleResponse<ContactResponse>): PagedResult<ContactVM> {
    const obj: PagedResult<ContactVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const client: ContactVM = this.contactResponseToVM(item);
        obj.list.push(client);
      });
      obj.list.forEach(contact => {
        contact.isParent = obj.list.findIndex((a: any) => a.id !== contact.id && a.contact_id == contact.id) !== -1;
      });
    }
    return obj;
  }

  contactResponseToVM(response: ContactResponse): ContactVM {
    const contactVM: ContactVM = {};
    contactVM.fullname = [response.firstname, response.lastname].filter(a => a).join(' ');
    contactVM.firstname = response.firstname;
    contactVM.lastname = response.lastname;
    contactVM.address = response.address;
    contactVM.addressaddition = response.addressaddition;
    contactVM.zip = response.zip;
    contactVM.city = response.city;
    contactVM.country = response.country;
    contactVM.email = response.email;
    contactVM.phone = response.phone;
    contactVM.position = response.position;
    contactVM.department = response.department;
    contactVM.data = response.data;
    contactVM.contact_id = response.contact_id;
    contactVM.id = response.id;
    contactVM.salutation = response.gender;
    contactVM.contact = response.contact?.data ? this.contactResponseToVM(response.contact.data) : undefined;
    contactVM.parent = contactVM.contact ? [contactVM.contact.firstname, contactVM.contact.lastname].filter(a => a).join(' ') : '';
    contactVM.user = response.user?.data;
    contactVM.role = (contactVM.user ? contactVM.user.role : ''); // this.translateService.instant('administration.users.fields.role.' + (contactVM.user.role)) : '');
    contactVM.displayName = contactVM.fullname;

    if (response.clients && response.clients.data?.length) {
      contactVM.client = this.clientResponseToVM(response.clients.data[0]);
    }
    if (response.site && response.site.data) {
      contactVM.site = this.siteResponseToVM(response.site.data);
    }
    return contactVM;
  }
  clientResponseToVM(response: ClientResponse): ClientVM {
    const clientVM: ClientVM = {};

    clientVM.id = response.id;
    clientVM.name = response.name;
    clientVM.debitorid = response.debitorid;
    clientVM.address = response.address;
    clientVM.addressaddition = response.addressaddition;
    clientVM.phone = response.phone;
    clientVM.zip = response.zip;
    clientVM.city = response.city;
    clientVM.country = response.country;
    clientVM.email = response.email;
    clientVM.custom_properties = response.custom_properties;
    // clientVM.data = response.data;
    clientVM.parent_id = response.parent_id;
    clientVM.saleslots = response.saleslots;
    clientVM.freelancer_ratings = response.freelancer_ratings;
    clientVM.children_ids = response.children_ids;
    clientVM.children = response.children?.data?.map(a => this.clientResponseToVM(a));
    clientVM.contacts = response.contacts?.data?.map(a => this.contactResponseToVM(a));
    clientVM.parent = response.parent?.data ? this.clientResponseToVM(response.parent?.data) : undefined;
    clientVM.isParent = clientVM.children && clientVM.children.length > 0;
    return clientVM;
  }
  contactVMToResponse(contact: ContactVM): ContactResponse {
    const contactResponse: ContactResponse = {};
    contactResponse.firstname = contact.firstname;
    contactResponse.lastname = contact.lastname;
    contactResponse.address = contact.address;
    contactResponse.addressaddition = contact.addressaddition;
    contactResponse.zip = contact.zip;
    contactResponse.city = contact.city;
    contactResponse.country = contact.country;
    contactResponse.email = contact.email;
    contactResponse.phone = contact.phone;
    contactResponse.position = contact.position;
    contactResponse.department = contact.department;
    contactResponse.contact_id = contact.contact_id;

    contactResponse.id = contact.id;
    contactResponse.gender = contact.salutation;
    contactResponse.is_client_user = contact.role === 'client';
    contactResponse.is_field_user = contact.role === 'field';
    // contactResponse.contact = contact.contact?.data ? this.contactResponseToVM(contact.contact.data) : undefined;
    // contactResponse.user = contact.user?.data;
    // contactResponse.role = (contactResponse.user ? contactResponse.user.role : '') // this.translateService.instant('administration.users.fields.role.' + (contactVM.user.role)) : '');
    // contactResponse.displayName = (contact.salutation ? contact.salutation + ' ' : '') + contactResponse.fullname;
    return contactResponse;
  }

  searchRequest(search: ContactSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = ['clients', 'site', 'contact'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.limit = search.pageSize;
    searchRequest.filters = [];
    if (search.clientId) {
      searchRequest.filters.push({ key: 'client_id', value: search.clientId });
    }
    if (search.siteId) {
      searchRequest.filters.push({ key: 'site_id', value: search.siteId });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    return searchRequest;
  }
  siteResponseToVM(response: SiteResponse): SiteVM {
    const siteVM: SiteVM = {};
    siteVM.id = response.id;
    siteVM.name = response.name;
    siteVM.nameaddition = response.nameaddition;
    siteVM.group = response.group;
    siteVM.category = response.category;
    siteVM.number = response.number;
    siteVM.address = response.address;
    siteVM.addressaddition = response.addressaddition;
    siteVM.zip = response.zip;
    siteVM.city = response.city;
    siteVM.country = response.country;
    siteVM.lat = response.lat;
    siteVM.lon = response.lon;
    siteVM.phone = response.phone;
    siteVM.fax = response.fax;
    siteVM.email = response.email;
    siteVM.contact_id = response.contact_id;
    return siteVM;
  }
}
