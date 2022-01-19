import { BudgetResponse, RecordResponse } from './../../model/budget.response';
import { BudgetSearchVM, BudgetVM, RecordVM } from '../../model/budget.model';
import { IdRequestVM, SearchRequestVM } from "../../model/search.model";

import { AssignmentMappingService } from './assignment-mapping.service';
import { FormConfig } from './../../constant/forms.constant';
import { FormatService } from './../format.service';
import { Injectable } from "@angular/core";
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { SiteVM } from "../../model/site.model";
import { TranslateService } from './../translate.service';

@Injectable()
export class BudgetMappingService {
  constructor(
    private assignmentMappingService: AssignmentMappingService,
    private formatService: FormatService,
    private translateService: TranslateService) {

  }

  budgetMultipleResponseToVM(response: MultipleResponse<BudgetResponse>): PagedResult<BudgetVM> {
    const obj: PagedResult<BudgetVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const budget: BudgetVM = this.budgetResponseToVM(item);
        obj.list.push(budget);
      });
    }
    return obj;
  }
  budgetResponseToVM(response: BudgetResponse): BudgetVM {
    const budgetVM: BudgetVM = {};
    budgetVM.id = response.id;
    budgetVM.planned = response.planned;
    budgetVM.consumed = response.consumed;
    budgetVM.available = response.available;
    if (response.records && response.records.data) {
      budgetVM.records = response.records.data.map(record => this.recordResponseToVM(record));
    }
    if (response.assignments && response.assignments.data) {
      budgetVM.assignments = response.assignments.data.map(record => this.assignmentMappingService.assignmentResponseToVM(record));
    }
    budgetVM.name = response.name;
    budgetVM.client_id = response.client_id;
    budgetVM.value = response.value;
    budgetVM.count_assignments = response.count_assignments;
    budgetVM.remarks = response.remarks;
    budgetVM.data = response.data;
    budgetVM.contacts = response.contacts && response.contacts.data;
    budgetVM.client = response.client && response.client.data;
    budgetVM.order = response.order && response.order.data;
    budgetVM.clientName = budgetVM.client && budgetVM.client.name;
    budgetVM.creator = response.creator && response.creator.data;
    budgetVM.creatorName = budgetVM.creator && budgetVM.creator.name;
    budgetVM.status = this.budgetStatus(response);
    budgetVM.formattedValue = budgetVM.value ? this.formatService.formatCurrency(budgetVM.value) : "";
    if (response.contacts && response.contacts && response.contacts.data && response.contacts.data.length) {
      budgetVM.contactNames = response.contacts.data.map(contact =>
        (contact.gender ? this.translateService.instant('common.salutation.' + contact.gender.toUpperCase()) : '') + contact.firstname + ' ' + contact.lastname).join(', ');
    } else {
      budgetVM.contactNames = '-';
    }
    return budgetVM;
  }
  budgetStatus(budget: BudgetResponse) {
    var diff = (budget.value || 0) - (budget.consumed || 0);
    if (diff > FormConfig.budgets.errorThreshold && diff <= FormConfig.budgets.warningThreshold) {
      return 'warn';
    }
    if (diff <= FormConfig.budgets.errorThreshold) {
      return 'error';
    }
    return 'ok';
  }
  recordResponseToVM(response: RecordResponse): RecordVM {
    const recordVM: RecordVM = {};
    recordVM.id = response.id;
    recordVM.type = response.type;
    recordVM.identifier = response.identifier;
    recordVM.value = response.value;
    recordVM.comment = response.comment;
    recordVM.source_type = response.source_type;
    recordVM.source_id = response.source_id;
    recordVM.reference_type = response.reference_type;
    recordVM.reference_id = response.reference_id;
    return recordVM;
  }
  searchRequest(search: BudgetSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = ['creator', 'client', 'order.budget'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.limit = search.pageSize;
    searchRequest.only_fields = [];
    searchRequest.filters = [];
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    if (search.clientId) {
      searchRequest.filters.push({ key: 'client_id', value: search.clientId });
    }
    return searchRequest;
  }
  getBudgetRequest(id: number): IdRequestVM {
    const request: SearchRequestVM = {};
    request.limit = 100000;
    request.order_by = 'name';
    request.order_dir = 'asc';
    request.include = ['contacts'];
    request.only_fields = [
      'budget.id',
      'budget.available',
      'budget.name',
      'contact.id',
      'contact.lastname',
      'contact.firstname',
      'client.id',
      'client.name',
    ];
    request.filters = [];
    request.filters.push({ key: 'client_id', value: id });
    return request;
  }

  getByIdRequest(id: number): IdRequestVM {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    searchRequest.include = [
      'client,contacts,order.budget,creator',
    ];
    return searchRequest;
  }
}
