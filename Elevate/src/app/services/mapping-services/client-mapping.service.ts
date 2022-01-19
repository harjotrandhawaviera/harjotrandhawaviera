import { OptionVM } from './../../model/option.model';
import { Injectable } from '@angular/core';
import { ClientResponse } from '../../model/client.response';
import { ClientVM } from '../../model/client.model';
import { PagedResult } from '../../model/pagination.model';
import { MultipleResponse } from '../../model/response';
import { IdRequestVM, SearchRequestVM } from '../../model/search.model';
import { ContactMappingService } from './contact-mapping.service';
import { ClientSearchVM } from '../../model/client.model';

@Injectable()
export class ClientMappingService {
  constructor(private contactMappingService: ContactMappingService) {}
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  clientLKResponseToVM(response: MultipleResponse<ClientResponse>): OptionVM[] {
    return this.sortOption(
      response.data
        ? response.data.map((a) => {
            return {
              value: a.id,
              text: a.name,
            };
          })
        : []
    );
  }
  searchResponseToVM(
    response: MultipleResponse<ClientResponse>
  ): PagedResult<ClientVM> {
    const obj: PagedResult<ClientVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item) => {
        const client: ClientVM = this.clientResponseToVM(item);
        obj.list.push(client);
      });
    }
    return obj;
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
    clientVM.children = response.children?.data?.map((a) =>
      this.clientResponseToVM(a)
    );
    clientVM.contacts = response.contacts?.data?.map((a) =>
      this.contactMappingService.contactResponseToVM(a)
    );
    clientVM.parent = response.parent?.data
      ? this.clientResponseToVM(response.parent?.data)
      : undefined;
    clientVM.isParent = clientVM.children && clientVM.children.length > 0;
    return clientVM;
  }

  searchRequest(search: ClientSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = ['contacts.contact', 'parent', 'children'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.limit = search.pageSize;
    searchRequest.filters = [];
    if (search.parent) {
      searchRequest.filters.push({ key: 'parent', value: search.parent });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    return searchRequest;
  }

  getByIdRequest(id: string): IdRequestVM {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    searchRequest.include = ['contacts', 'parent', 'children'];
    return searchRequest;
  }

  clientVMToResponse(client: ClientVM): ClientResponse {
    const clientResponse: ClientResponse = {};
    clientResponse.id = client.id;
    clientResponse.name = client.name;
    clientResponse.debitorid = client.debitorid;
    clientResponse.address = client.address;
    clientResponse.addressaddition = client.addressaddition;
    clientResponse.phone = client.phone;
    clientResponse.zip = client.zip;
    clientResponse.city = client.city;
    clientResponse.country = client.country;
    clientResponse.email = client.email;
    clientResponse.custom_properties = client.custom_properties;
    clientResponse.parent_id = client.parent_id;
    clientResponse.saleslots = client.saleslots;
    clientResponse.freelancer_ratings = client.freelancer_ratings;
    return clientResponse;
  }
}
