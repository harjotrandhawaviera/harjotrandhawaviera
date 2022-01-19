import { RevenueResponse } from './../../model/revenue.response';
import { Injectable } from "@angular/core";
import { ClientResponse } from '../../model/client.response';
import { ClientVM } from '../../model/client.model';
import { PagedResult } from '../../model/pagination.model';
import { MultipleResponse } from '../../model/response';
import { IdRequestVM, SearchRequestVM } from '../../model/search.model';
import { ContactMappingService } from './contact-mapping.service';
import { ClientSearchVM } from '../../model/client.model';
import { SiteResponse } from "../../model/site.response";
import { SiteVM } from "../../model/site.model";
import { RevenueVM } from '../../model/revenue.model';

@Injectable()
export class RevenueMappingService {
  constructor() {

  }

  revenueMultipleResponseToVM(response: MultipleResponse<RevenueResponse>): PagedResult<RevenueVM> {
    const obj: PagedResult<RevenueVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const revenue: RevenueVM = this.revenueResponseToVM(item);
        obj.list.push(revenue);
      });
    }
    return obj;
  }
  revenueResponseToVM(response: RevenueResponse): RevenueVM {
    const revenueVM: RevenueVM = {};
    revenueVM.id = response.id;
    revenueVM.total = response.total;
    revenueVM.job_id = response.job_id;
    revenueVM.freelancer_id = response.freelancer_id;
    revenueVM.comment = response.comment;
    revenueVM.sales_volume = response.sales_volume;
    revenueVM.assignment_ids = response.assignment_ids;
    revenueVM.average = response.average;
    revenueVM.warning_threshold = response.warning_threshold;
    return revenueVM;
  }
}
