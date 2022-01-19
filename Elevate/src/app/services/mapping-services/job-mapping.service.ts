import { IdRequestVM, SearchRequestVM } from '../../model/search.model';
import { JobDocumentVM, JobSearchVM, JobVM } from '../../model/job.model';

import { CertificateMappingService } from './certificate-mapping.service';
import { Injectable } from '@angular/core';
import { JobResponse } from '../../model/job.response';
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { ProjectMappingService } from './project-mapping.service';
import { SiteMappingService } from './site-mapping.service';
import * as moment from 'moment';

@Injectable()
export class JobMappingService {
  constructor(
    private certificateMappingService: CertificateMappingService,
    private projectMappingService: ProjectMappingService,
    private siteMappingService: SiteMappingService
  ) {}

  searchRequest(search: JobSearchVM, view?: string): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.limit = search.pageSize;
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    if (view === 'client') {
      searchRequest.include = ['site', 'revenues', 'contract_type', 'client'];
      searchRequest.only_fields = [
        'job.id',
        'job.title',
        'job.summary',
        'job.category',
        'job.is_creator',
        'site.*',
        'revenue.total',
        'contract_type.identifier',
      ];
    } else {
      searchRequest.include = ['client'];
      searchRequest.only_fields = [
        'job.id',
        'job.title',
        'job.summary',
        'job.category',
        'job.created_at',
        'site.*',
      ];
    }
    searchRequest.filters = [];
    if (search.client) {
      searchRequest.filters.push({ key: 'client_id', value: search.client });
    }
    if (search.agent) {
      searchRequest.filters.push({ key: 'staff_id', value: search.agent });
    }
    if (search.project) {
      searchRequest.filters.push({ key: 'project_id', value: search.project });
    }
    if (search.contractType) {
      searchRequest.filters.push({
        key: 'contract_type_id',
        value: search.contractType,
      });
    }
    if (search.attributes) {
      searchRequest.filters.push({
        key: 'with_offer',
        value: search.attributes,
      });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    searchRequest.filters.push({ key: 'add_summary', value: true });
    return searchRequest;
  }

  jobSearchResponseToVM(
    response: MultipleResponse<JobResponse>
  ): PagedResult<JobVM> {
    const obj: PagedResult<JobVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item) => {
        const job: JobVM = this.jobResponseToVM(item);
        obj.list.push(job);
      });
    }
    return obj;
  }

  jobResponseToVM(res: JobResponse): JobVM {
    const jobVM: JobVM = {};

    jobVM.id = res.id;
    jobVM.created_at = res.created_at;
    jobVM.client = res.client;
    jobVM.summary = res.summary;
    jobVM.title = res.title;
    jobVM.category = res.category;
    jobVM.additional_costs = res.additional_costs;
    jobVM.agent = res.agent?.data;
    jobVM.agent_id = res.agent_id;
    jobVM.assignment_budget = res.assignment_budget;
    jobVM.briefing = res.briefing;
    jobVM.budget_id = res.budget_id;
    jobVM.certificate_ids = res.certificate_ids;
    jobVM.contact_id = res.contact_id;
    jobVM.contract_type = res.contract_type?.data;
    jobVM.contract_type_id = res.contract_type_id;
    jobVM.contract_type_identifier = res.contract_type_identifier;
    jobVM.data = res.data;
    jobVM.description = res.description;
    jobVM.feedback = res.feedback;
    jobVM.finish_time = res.finish_time;
    jobVM.freelancer_ratings = res.freelancer_ratings;
    jobVM.incentive_model_id = res.incentive_model_id;
    jobVM.information = res.information;
    jobVM.is_creator = res.is_creator;
    if (res.project && res.project.data) {
      jobVM.project = this.projectMappingService.projectResponseToVM(
        res.project.data
      );
    }
    jobVM.project_id = res.project_id;
    jobVM.saleslots = res.saleslots;
    if (res.site && res.site.data) {
      jobVM.site = this.siteMappingService.siteResponseToVM(res.site.data);
    }
    // jobVM.site = res.site?.data;
    jobVM.site_client_contact = res.site_client_contact;
    jobVM.site_id = res.site_id;
    jobVM.start_time = res.start_time;
    jobVM.state = res.state;
    jobVM.wage = res.wage;
    if (res.certificates && res.certificates.data) {
      jobVM.certificates = res.certificates.data.map((a) =>
        this.certificateMappingService.certificateResponseToVM(a)
      );
    }
    if (res.documents && res.documents.data) {
      jobVM.documents = res.documents.data;
    }
    jobVM.revenues = res.revenues?.data;

    jobVM.job_name = res.job_name;
    jobVM.job_overview = res.job_overview;
    jobVM.job_location = res.job_location;
    jobVM.job_location_lat = res.job_location_lat;
    jobVM.job_location_lng = res.job_location_lng;
    jobVM.job_code = res.job_code;
    jobVM.staff_briefing = res.staff_briefing;
    jobVM.teaminfo = res.teaminfo;
    jobVM.taskinfo = res.taskinfo;
    jobVM.start_date = res.start_date;
    jobVM.finish_date = res.finish_date;
    jobVM.staff = res.staff?.data;
    jobVM.staff_id = res.staff_id;
    jobVM.location_type = res.location_type;
    return jobVM;
  }

  jobVMToResponse(model: JobVM, documents: JobDocumentVM[]): JobResponse {
    const response: any = {};
    const updatedDocs: JobDocumentVM[] = [];

    response.id = model.id;
    response.start_time = model.start_time;
    response.finish_time = model.finish_time;
    response.site_ids = model.site_ids;
    response.agent_id = model.agent_id;
    response.state = model.state;
    response.budget_id = model.budget_id;
    response.assignment_budget = model.assignment_budget;
    response.wage = model.wage;
    response.category = model.category;
    response.certificate_ids = model.certificate_ids;
    response.additional_costs = model.additional_costs
      ? model.additional_costs
      : [];
    response.data = model.data;
    response.freelancer_ratings = model.freelancer_ratings;
    response.saleslots = model.saleslots ? model.saleslots : [];
    response.feedback = model.feedback ? model.feedback : [];
    response.description = model.description;
    response.information = model.information;
    response.briefing = model.briefing;

    if (documents && documents.length) {
      documents.forEach((d) => {
        const doc = {
          document_id: d.id,
          description: d.description,
          name: d.name,
          type: d.type,
        };
        updatedDocs.push(doc);
      });
    }
    response.documents = updatedDocs;


    response.staff_id = model.staff_id;
    response.job_name = model.job_name;
    response.job_overview = model.job_overview;
    response.job_location = model.job_location;
    response.job_location_lat = model.job_location_lat;
    response.job_location_lng = model.job_location_lng;
    response.job_code = model.job_code;
    response.location_type = model.location_type;
    response.staff_briefing = model.staff_briefing;
    response.teaminfo = model.teaminfo;
    response.taskinfo = model.taskinfo;
    response.contract_type_id = model.contract_type_id;
    response.start_date = model.start_date
      ? moment(model.start_date).format('YYYY-MM-DD')
      : undefined;
    response.finish_date = model.finish_date
      ? moment(model.finish_date).format('YYYY-MM-DD')
      : undefined;
    return response;
  }

  clientJobVMToResponse(model: JobVM): JobResponse {
    const response: any = {};

    response.start_time = model.start_time;
    response.finish_time = model.finish_time;
    response.site_ids = model.site_ids;
    response.state = model.state ? model.state : 'active';
    return response;
  }

  updateJobVMToResponse(model: JobVM): JobResponse {
    const response: any = {};

    response.id = model.id;
    response.title = model.title;
    response.start_time = model.start_time;
    response.finish_time = model.finish_time;
    response.site_ids = model.site_ids;
    response.agent_id = model.agent_id;
    response.state = model.state;
    response.budget_id = model.budget_id;
    response.assignment_budget = model.assignment_budget;
    response.wage = model.wage;
    response.category = model.category;
    response.certificate_ids = model.certificate_ids;
    response.additional_costs = model.additional_costs
      ? model.additional_costs
      : [];
    response.data = model.data;
    response.freelancer_ratings = model.freelancer_ratings;
    response.saleslots = model.saleslots ? model.saleslots : [];
    response.feedback = model.feedback ? model.feedback : [];
    response.description = model.description;
    response.information = model.information;
    response.briefing = model.briefing;
    response.project = { data: model.project };
    response.project_id = model.project_id;
    response.agent = model.agent;
    response.contract_type_identifier = model.contract_type_identifier;
    response.contract_type_id = model.contract_type_id;
    response.contact_id = model.contact_id;
    response.certificates = model.certificates;
    response.site = { data: model.site };

    response.job_name = model.job_name;
    response.job_overview = model.job_overview;
    response.job_location = model.job_location;
    response.job_location_lat = model.job_location_lat;
    response.job_location_lng = model.job_location_lng;
    response.job_code = model.job_code;
    response.staff_briefing = model.staff_briefing;
    response.teaminfo = model.teaminfo;
    response.taskinfo = model.taskinfo;
    response.start_date = model.start_date
      ? moment(model.start_date).format('YYYY-MM-DD')
      : undefined;
    response.finish_date = model.finish_date
      ? moment(model.finish_date).format('YYYY-MM-DD')
      : undefined;
    response.staff_id = model.staff_id;
    response.staff = model.staff;
    response.location_type = model.location_type;
    return response;
  }

  getByIdRequest(id: string, mode: string): IdRequestVM {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    if (mode === 'clientJobTender' || mode === 'newDate') {
      searchRequest.include = [
        'dates.assignments,project.client.contacts,documents,certificates,agent,site,staff',
      ];
    } else {
      searchRequest.include = [
        'project.client.contacts,documents,certificates,agent,site,staff',
      ];
    }
    return searchRequest;
  }
}
