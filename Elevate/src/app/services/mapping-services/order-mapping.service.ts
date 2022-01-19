import { IdRequestVM, SearchRequestVM } from "../../model/search.model";
import { OrderSearchVM, OrderVM } from '../../model/order.model';

import { AssignmentMappingService } from './assignment-mapping.service';
import { BudgetMappingService } from './budget-mapping.service';
import { FormConfig } from './../../constant/forms.constant';
import { Injectable } from "@angular/core";
import { MultipleResponse } from '../../model/response';
import { OrderResponse } from './../../model/order.response';
import { PagedResult } from '../../model/pagination.model';
import { SiteVM } from "../../model/site.model";
import { TranslateService } from './../translate.service';

@Injectable()
export class OrderMappingService {
  constructor(private budgetMappingService: BudgetMappingService) {

  }

  orderMultipleResponseToVM(response: MultipleResponse<OrderResponse>): PagedResult<OrderVM> {
    const obj: PagedResult<OrderVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const order: OrderVM = this.orderResponseToVM(item);
        obj.list.push(order);
      });
    }
    return obj;
  }
  orderResponseToVM(response: OrderResponse): OrderVM {
    const obj: OrderVM = {};
    obj.id = response.id;
    obj.name = response.name;
    obj.state = response.state;
    obj.ordered_at = response.ordered_at;
    obj.required_assignments = response.required_assignments;
    obj.remarks = response.remarks;
    obj.data = response.data;
    obj.assignment_budget = response.assignment_budget;
    obj.client_id = response.client_id;
    obj.budget_id = response.budget_id;
    obj.incentive_model_id = response.incentive_model_id;
    obj.number = response.number;
    obj.client = response.client && response.client.data;
    obj.clientName = obj.client && obj.client.name;
    obj.budget = response.budget && response.budget.data ? this.budgetMappingService.budgetResponseToVM(response.budget.data) : undefined;
    return obj;
  }
  searchRequest(search: OrderSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = ['client', 'budget'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.limit = search.pageSize;
    searchRequest.only_fields = [];
    searchRequest.filters = [];
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    return searchRequest;
  }
}
