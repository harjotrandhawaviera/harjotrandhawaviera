import { IdRequestVM, SearchRequestVM } from '../../model/search.model';

import { ClientResponse } from '../../model/client.response';
import { ClientSearchVM } from '../../model/client.model';
import { ClientVM } from '../../model/client.model';
import { ContactMappingService } from './contact-mapping.service';
import { Injectable } from "@angular/core";
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { SiteResponse } from "../../model/site.response";
import { SiteVM } from "../../model/site.model";

@Injectable()
export class SiteMappingService {
  constructor(private contactMappingService: ContactMappingService) {

  }

  siteMultipleResponseToVM(response: MultipleResponse<SiteResponse>): PagedResult<SiteVM> {
    const obj: PagedResult<SiteVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const client: SiteVM = this.siteResponseToVM(item);
        obj.list.push(client);
      });
    }
    return obj;
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
    siteVM.zip_min = response.zip_min;
    siteVM.zip_max = response.zip_max;
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
