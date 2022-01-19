import { DatesSearchVM, DatesVM } from '../../model/dates.model';
import { IdRequestVM, SearchRequestVM } from '../../model/search.model';
import { JobDocumentVM, JobVM } from '../../model/job.model';

import { BudgetMappingService } from './budget-mapping.service';
import { DatesResponse } from '../../model/dates.response';
import { Injectable } from '@angular/core';
import { JobMappingService } from './job-mapping.service';
import { JobResponse } from '../../model/job.response';
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';

@Injectable()
export class DatesMappingService {
  constructor(
    private jobMappingService: JobMappingService,
    private budgetMappingService: BudgetMappingService
  ) {}

  searchRequest(search: DatesSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.limit = search.pageSize;
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.include = ['job'];
    searchRequest.only_fields = [
      'date.id',
      'date.job_id',
      'date.appointed_at',
      'date.start_time',
      'date.finish_time',
      'job.title',
      'date.shift_name',
      'date.role_name',
      'date.assignment_id'
    ];
    searchRequest.filters = [];
    if (search.agent) {
      searchRequest.filters.push({ key: 'agent_id', value: search.agent });
    }
    if (search.project) {
      searchRequest.filters.push({ key: 'project', value: search.project });
    }
    if (search.job) {
      searchRequest.filters.push({ key: 'job', value: search.job });
    }
    if (search.dateFrom) {
      searchRequest.filters.push({
        key: 'date_from',
        value: search.dateFrom,
      });
    }
    if (search.dateTo) {
      searchRequest.filters.push({
        key: 'date_to',
        value: search.dateTo,
      });
    }
    return searchRequest;
  }

  datesSearchResponseToVM(
    response: MultipleResponse<DatesResponse>
  ): PagedResult<DatesVM> {
    const obj: PagedResult<DatesVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item) => {
        const dates: DatesVM = this.datesResponseToVM(item);
        obj.list.push(dates);
      });
    }
    return obj;
  }

  datesResponseToVM(res: DatesResponse): DatesVM {
    const datesVM: DatesVM = {};

    datesVM.id = res.id;
    datesVM.category = res.category;
    datesVM.appointed_at = res.appointed_at;
    datesVM.agent_id = res.agent_id;
    datesVM.assignment_budget = res.assignment_budget;
    datesVM.briefing = res.briefing;
    if (res.budget && res.budget.data) {
      datesVM.budget = this.budgetMappingService.budgetResponseToVM(
        res.budget.data
      );
    }
    datesVM.budget_id = res.budget_id;
    datesVM.certificate_ids = res.certificate_ids;
    datesVM.assignment_id = res.assignment_id;
    datesVM.contact_id = res.contact_id;
    datesVM.data = res.data;
    datesVM.description = res.description;
    datesVM.incentive_model_id = res.incentive_model_id;
    datesVM.information = res.information;
    if (res.job && res.job.data) {
      datesVM.job = this.jobMappingService.jobResponseToVM(res.job.data);
    }
    datesVM.job_id = res.job_id;
    datesVM.start_time = res.start_time;
    datesVM.finish_time = res.finish_time;
    datesVM.state = res.state;
    datesVM.wage = res.wage;
    datesVM.role_name = res.role_name;
    datesVM.shift_name = res.shift_name;

    return datesVM;
  }

  dateVMToResponse(model: DatesVM): DatesResponse {
    const response: any = {};

    response.id = model.id;
    response.appointed_at = model.appointed_at;
    response.start_time = model.start_time;
    response.finish_time = model.finish_time;
    response.budget_id = model.budget_id ? model.budget_id : null;
    response.wage = model.wage;
    response.assignment_budget = model.assignment_budget;

    return response;
  }

  datesVMToResponseArr(model: DatesVM[]): DatesResponse[] {
    const response: any = [];
    model.forEach(m => {
      const obj: any = {};
      obj.appointed_at = m.appointed_at;
      obj.start_time = m.start_time;
      obj.finish_time = m.finish_time;
      obj.budget_id = m.budget_id ? m.budget_id : null;
      obj.job_id = m.job_id;
      obj.wage = m.wage;
      obj.assignment_budget = m.assignment_budget;

      response.push(obj);
    });
    return response;
  }

  getByIdRequest(id: string, assignment_id?: string): IdRequestVM {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    searchRequest.include = [
      'job.project.client.contacts,job.project.client.sites.client_site_contact,job.documents,job.dates,budget,job.site',
    ];
    if(assignment_id) {
      searchRequest.filters = [{ key: 'assignment_id', value: assignment_id }];
    }
    return searchRequest;
  }
}
