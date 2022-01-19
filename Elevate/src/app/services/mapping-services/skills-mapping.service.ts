import { Injectable } from '@angular/core';
import { PagedResult } from '../../model/pagination.model';
import { SkillResponse, SkillSearchVM, SkillVM } from '../../model/skill.model';

@Injectable()
export class SkillMappingService {
  constructor() {}

  searchRequest(search: SkillSearchVM): any {
    const searchRequest: SkillSearchVM = {};
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
    if (search.category) {
      searchRequest.filters.push({
        key: 'category_id',
        value: search.category,
      });
    }
    return searchRequest;
  }

  searchResponseToVM(response: any): any {
    const obj: PagedResult<SkillVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item: SkillResponse) => {
        const skills: SkillVM = this.skillResponseToVM(item);
        obj.list.push(skills);
      });
    }
    return obj;
  }

  skillResponseToVM(response: SkillResponse): SkillVM {
    const skillVM: SkillVM = {};

    skillVM.id = response.id;
    skillVM.regions = response.regions;
    skillVM.skillCategory = response.skillCategory;
    skillVM.title = response.title;
    skillVM.createdDate = response.createdDate;

    return skillVM;
  }
}
