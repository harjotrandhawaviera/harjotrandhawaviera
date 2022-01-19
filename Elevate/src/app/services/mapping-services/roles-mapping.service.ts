import { Injectable } from '@angular/core';
import { PagedResult } from '../../model/pagination.model';
import { RoleSearchVM, RoleVM } from '../../model/role.model';
import { RoleResponse } from '../../model/role.response';

@Injectable()
export class RoleMappingService {
  constructor() {}

  searchRequest(search: RoleSearchVM): any {
    const searchRequest: RoleSearchVM = {};
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = 'desc';
    searchRequest.sort_by_column = 'created_date';
    searchRequest.filters = [];
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    if (search.region) {
      searchRequest.filters.push({ key: 'region_id', value: search.region });
    }
    return searchRequest;
  }

  searchResponseToVM(response: any): any {
    const obj: PagedResult<RoleVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item: RoleResponse) => {
        const roles: RoleVM = this.roleResponseToVM(item);
        obj.list.push(roles);
      });
    }
    return obj;
  }

  roleResponseToVM(response: RoleResponse): RoleVM {
    const roleVM: RoleVM = {};

    roleVM.id = response.id;
    roleVM.region = response.regions;
    roleVM.label = response.label;
    roleVM.identifier = response.identifier;
    roleVM.createdDate = response.createdDate;

    return roleVM;
  }
}
