import * as moment from 'moment';

import { IdRequestVM, SearchRequestVM } from '../../model/search.model';
import { ProjectSearchVM, ProjectVM } from '../../model/project.model';

import { BudgetMappingService } from './budget-mapping.service';
import { CertificateMappingService } from './certificate-mapping.service';
import { ClientMappingService } from './client-mapping.service';
import { ContactMappingService } from './contact-mapping.service';
import { Injectable } from '@angular/core';
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { ProjectResponse } from '../../model/project.response';

@Injectable()
export class ProjectMappingService {
  constructor(
    private clientMappingService: ClientMappingService,
    private contactMappingService: ContactMappingService,
    private certificateMappingService: CertificateMappingService,
    private budgetMappingService: BudgetMappingService
  ) {}
  projectSearchResponseToVM(
    response: MultipleResponse<ProjectResponse>
  ): PagedResult<ProjectVM> {
    const obj: PagedResult<ProjectVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item) => {
        const project: ProjectVM = this.projectResponseToVM(item);
        obj.list.push(project);
      });
    }
    return obj;
  }

  projectResponseToVM(response: ProjectResponse): ProjectVM {
    const projectVM: ProjectVM = {};
    projectVM.id = response.id;
    projectVM.name = response.name;
    projectVM.description = response.description;
    projectVM.state = response.state;
    projectVM.client_id = response.client_id;
    projectVM.contact_id = response.contact_id;
    projectVM.budget_id = response.budget_id;
    projectVM.incentive_model_id = response.incentive_model_id;
    projectVM.order_id = response.order_id;
    projectVM.agent_id = response.agent_id;
    projectVM.contract_type_id = response.contract_type_id;
    projectVM.contract_type_identifier = response.contract_type_identifier;
    projectVM.created_at = response.created_at
      ? moment(response.created_at).format()
      : undefined;
    projectVM.finished_at = response.finished_at
      ? moment(response.finished_at).format()
      : undefined;
    projectVM.started_at = response.started_at
      ? moment(response.started_at).format()
      : undefined;
    projectVM.category = response.category;
    projectVM.certificate_ids = response.certificate_ids;
    projectVM.information = response.information;
    projectVM.briefing = response.briefing;
    projectVM.data = response.data;
    projectVM.saleslots = response.saleslots;
    projectVM.freelancer_ratings = response.freelancer_ratings;
    // projectVM.wage = response.wage || 0;
    projectVM.number_of_jobs = response.number_of_jobs || 0;
    projectVM.sum_planned_costs = response.sum_planned_costs || 0;
    projectVM.sum_max_estimated_costs = response.sum_max_estimated_costs || 0;
    projectVM.sum_min_estimated_costs = response.sum_min_estimated_costs || 0;
    projectVM.sum_freelancer_costs = response.sum_freelancer_costs || 0;
    projectVM.assignment_budget = response.assignment_budget;
    projectVM.order = response.order ? response.order.data : undefined;
    if (response.certificates && response.certificates.data) {
      projectVM.certificates = response.certificates.data.map((a) =>
        this.certificateMappingService.certificateResponseToVM(a)
      );
    }
    if (response.client && response.client.data) {
      projectVM.client = this.clientMappingService.clientResponseToVM(
        response.client.data
      );
    }
    if (response.contact && response.contact.data) {
      projectVM.contact = this.contactMappingService.contactResponseToVM(
        response.contact.data
      );
    }
    if (response.agent && response.agent.data) {
      projectVM.agent = response.agent.data;
    }
    if (response.budget && response.budget.data) {
      projectVM.budget = this.budgetMappingService.budgetResponseToVM(
        response.budget.data
      );
    }
    if (response.documents && response.documents.data) {
      projectVM.documents = response.documents.data;
    }
    projectVM.summary = response.summary;
    projectVM.additional_costs = response.additional_costs;
    projectVM.saleslots = response.saleslots;
    projectVM.feedback = response.feedback;
    projectVM.isDanger =
      (response.sum_planned_costs &&
        response.sum_max_estimated_costs &&
        response.sum_planned_costs < response.sum_max_estimated_costs) === true;
    projectVM.update_associated = response.update_associated;
    // New
    projectVM.target_budget = response.target_budget;
    projectVM.staff_id = response.staff_id;
    projectVM.po_no = response.po_no;
    projectVM.po_amount = response.po_amount;
    projectVM.po_date = response.po_date;
    projectVM.po_comment = response.po_comment;
    projectVM.primary_address_full = response.primary_address_full;
    projectVM.primary_address = response.primary_address;
    projectVM.primary_country = response.primary_country;
    projectVM.primary_state = response.primary_state;
    projectVM.primary_city = response.primary_city;
    projectVM.primary_zip = response.primary_zip;
    projectVM.site_address_full = response.site_address_full;
    projectVM.site_address = response.site_address;
    projectVM.site_country = response.site_country;
    projectVM.site_state = response.site_state;
    projectVM.site_city = response.site_city;
    projectVM.site_zip = response.site_zip;
    projectVM.global_brand_id = response.global_brand_id;
    projectVM.currency = response.currency;
    projectVM.po_currency = response.po_currency;
    projectVM.skills_required = response.skills_required;
    if (response.staff && response.staff.data) {
      projectVM.staff = response.staff.data;
    }
    return projectVM;
  }
  projectVMToResponse(model: ProjectVM): ProjectResponse {
    const response: ProjectResponse = {};
    response.id = model.id;
    response.name = model.name;
    response.description = model.description;
    // response.state = !response.id ? model.state : undefined;
    response.client_id = model.client_id;
    response.contact_id = model.contact_id;
    response.budget_id = model.budget_id;
    response.incentive_model_id = model.incentive_model_id;
    response.order_id = model.order_id;
    response.agent_id = model.agent_id;
    response.contract_type_id = !response.id
      ? model.contract_type_id
      : undefined;
    response.started_at = model.started_at
      ? moment(model.started_at).format('YYYY-MM-DD hh:mm:ss')
      : undefined;
    response.finished_at = model.finished_at
      ? moment(model.finished_at).format('YYYY-MM-DD hh:mm:ss')
      : undefined;
    response.category = model.category;
    response.certificate_ids = model.certificate_ids;
    response.information = model.information;
    response.briefing = model.briefing;
    response.data = model.data;
    response.saleslots = model.saleslots;
    response.freelancer_ratings = model.freelancer_ratings;
    // response.wage = model.wage || 0;
    // response.number_of_jobs = model.number_of_jobs || 0;
    // response.sum_planned_costs = model.sum_planned_costs || 0;
    // response.sum_max_estimated_costs = model.sum_max_estimated_costs || 0;
    // response.sum_min_estimated_costs = model.sum_min_estimated_costs || 0;
    // response.sum_freelancer_costs = model.sum_freelancer_costs || 0;
    response.assignment_budget = model.assignment_budget;
    // response.order = model.order ? model.order.data : undefined;
    // if (model.client && model.client.data) {
    //   response.client = this.clientMappingService.clientResponseToVM(model.client.data);
    // }
    // if (model.contact && model.contact.data) {
    //   response.contact = this.contactMappingService.contactResponseToVM(model.contact.data);
    // }
    // if (model.agent && model.agent.data) {
    //   response.agent = model.agent.data;
    // }
    // if (model.budget && model.budget.data) {
    //   response.budget = this.budgetMappingService.budgetResponseToVM(model.budget.data);
    // }
    // if (model.documents && model.documents) {
    //   response.documents = model.documents.data;
    // }
    response.summary = model.summary;
    response.additional_costs = model.additional_costs ? model.additional_costs : [];
    response.saleslots = model.saleslots ? model.saleslots : [];
    response.feedback = model.feedback ? model.feedback : [];
    if (model.id) {
      response.update_associated = model.update_associated ? true : false;
    }

    // New
    response.target_budget = model.target_budget;
    response.staff_id = model.staff_id;
    response.po_no = model.po_no;
    response.po_amount = model.po_amount;
    response.po_date = model.po_date
      ? moment(model.po_date).format('YYYY-MM-DD')
      : undefined;
    response.po_comment = model.po_comment;
    response.primary_address = model.primary_address;
    response.primary_country = model.primary_country;
    response.primary_state = model.primary_state;
    response.primary_city = model.primary_city;
    response.primary_zip = model.primary_zip;
    response.site_address = model.site_address;
    response.site_country = model.site_country;
    response.site_state = model.site_state;
    response.site_city = model.site_city;
    response.site_zip = model.site_zip;
    response.global_brand_id = model.global_brand_id;
    response.currency = model.currency;
    response.po_currency = model.po_currency;
    response.skills_required = model.skills_required;
    return response;
  }
  searchRequest(search: ProjectSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = ['client', 'order'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.limit = search.pageSize;
    searchRequest.only_fields = [
      'project.id',
      'project.name',
      'project.state',
      'project.created_at',
      'project.number_of_jobs',
      'project.sum_planned_costs',
      'project.sum_max_estimated_costs',
      'client.name',
      'order.name',
      'target_budget',
      'staff_id',
      'staff',
      'skills_required'
    ];
    searchRequest.filters = [];
    if (search.client) {
      searchRequest.filters.push({ key: 'client_id', value: search.client });
    }
    if (search.agent) {
      searchRequest.filters.push({ key: 'staff_id', value: search.agent });
    }
    if (search.order) {
      searchRequest.filters.push({ key: 'order', value: search.order });
    }
    if (search.contractType) {
      searchRequest.filters.push({
        key: 'contract_type_id',
        value: search.contractType,
      });
    }
    if (search.state) {
      searchRequest.filters.push({ key: 'state', value: search.state });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    return searchRequest;
  }
  getByIdRequest(id: string) {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    searchRequest.filters = [{ key: 'add_summary', value: true }];
    searchRequest.include = [
      'documents',
      'client.contacts',
      'client.sites.client_site_contact',
      'certificates',
      'agent',
      'budget.contacts',
      'order',
      'contact',
      'target_budget',
      'staff_id',
      'staff',
      'skills_required'
    ];
    return searchRequest;
  }
}
