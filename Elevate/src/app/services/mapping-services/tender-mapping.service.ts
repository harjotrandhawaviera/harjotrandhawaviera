import { BudgetResponse, RecordResponse } from './../../model/budget.response';
import { BudgetVM, RecordVM } from '../../model/budget.model';
import { IdRequestVM, SearchRequestVM } from '../../model/search.model';
import { TenderSearchVM, TenderVM } from '../../model/tender.model';

import { AssignmentMappingService } from './assignment-mapping.service';
import { ClientMappingService } from './client-mapping.service';
import { DatesMappingService } from './dates-mapping.service';
import { Injectable } from '@angular/core';
import { JobMappingService } from './job-mapping.service';
import { MultipleResponse } from '../../model/response';
import { OfferMappingService } from './offer-mapping.service';
import { PagedResult } from '../../model/pagination.model';
import { SiteMappingService } from './site-mapping.service';
import { SiteVM } from '../../model/site.model';
import { TenderResponse } from '../../model/tender.response';

@Injectable()
export class TenderMappingService {
  constructor(
    private offerMappingService: OfferMappingService,
    private assignmentMappingService: AssignmentMappingService,
    private clientMappingService: ClientMappingService,
    private datesMappingService: DatesMappingService,
    private jobMappingService: JobMappingService,
    private siteMappingService: SiteMappingService
  ) {}

  searchRequest(search: TenderSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.limit = search.pageSize;
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.include = ['contract_type'];
    searchRequest.only_fields = [
      'tender.id',
      'tender.published_at',
      'tender.invalid_at',
      'tender.snapshots',
      'tender.daily_rate_min',
      'tender.daily_rate_max',
      'tender.appointed_at',
      'tender.category',
      'tender.state',
      'contract_type.identifier',
    ];
    searchRequest.filters = [];
    if (search.job) {
      searchRequest.filters.push({ key: 'job_id', value: search.job });
    }
    if (search.state) {
      searchRequest.filters.push({ key: 'state', value: search.state });
    }
    if (search.date_from) {
      searchRequest.filters.push({ key: 'date_from', value: search.date_from });
    }
    if (search.date_to) {
      searchRequest.filters.push({ key: 'date_to', value: search.date_to });
    }
    if (search.zip_from) {
      searchRequest.filters.push({ key: 'zip_from', value: search.zip_from });
    }
    if (search.zip_to) {
      searchRequest.filters.push({ key: 'zip_to', value: search.zip_to });
    }
    if (search.gender) {
      searchRequest.filters.push({ key: 'gender', value: search.gender });
    }
    if (search.radius) {
      searchRequest.filters.push({ key: 'radius', value: search.radius });
    }
    if (search.contractType) {
      searchRequest.filters.push({ key: 'contractType', value: search.contractType });
    }
    if (search.certificate) {
      searchRequest.filters.push({ key: 'certificate', value: search.certificate });
    }
    if (search.skill) {
      searchRequest.filters.push({ key: 'skill', value: search.skill });
    }
    if (search.agent) {
      searchRequest.filters.push({ key: 'agent_id', value: search.agent });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    if (search.state === 'expired') {
      searchRequest.filters.push({ key: 'with_deleted', value: true });
    }

    return searchRequest;
  }

  tenderSearchResponseToVM(
    response: MultipleResponse<TenderResponse>
  ): PagedResult<TenderVM> {
    const obj: PagedResult<TenderVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item) => {
        const tender: TenderVM = this.tenderResponseToVM(item);
        obj.list.push(tender);
      });
    }
    return obj;
  }

  tenderResponseToVM(response: TenderResponse): TenderVM {
    const tender: TenderVM = {};
    tender.id = response.id;
    tender.category = response.category;
    tender.contract_type = response.contract_type?.data;
    tender.contract_type_id = response.contract_type_id;
    tender.contract_type_identifier = response.contract_type_identifier;
    tender.daily_rate_max = response.daily_rate_max;
    tender.daily_rate_min = response.daily_rate_min;
    tender.agent = response.agent;
    tender.created_at = response.created_at;
    if (response.assignment) {
      tender.assignment = this.assignmentMappingService.assignmentResponseToVM(
        response.assignment.data
      );
    }
    tender.assignment_id = response.assignment_id;
    tender.invalid_at = response.invalid_at;
    tender.published_at = response.published_at;
    tender.state = response.state;
    tender.zip_max = response?.tender?.zip_max;
    tender.zip_min = response?.tender?.zip_min;
    tender.gender = response?.tender?.gender;
    tender.radius = response?.tender?.radius;
    tender.tenderContractType = response?.tender?.contract_type_id;
    tender.contractType = response.contractType;
    tender.skill = response?.tender?.skill;
    tender.certificate = response.certificate;
    tender.deleted_at = response.deleted_at;
    tender.shift_start_time = response.shift_start_time;
    tender.shift_end_time = response.shift_end_time;
    if (response.snapshots) {
      tender.snapshots = {
        assignment: response.snapshots.assignment
          ? this.assignmentMappingService.assignmentResponseToVM(
              response.snapshots.assignment
            )
          : {},
        client: response.snapshots.client
          ? this.clientMappingService.clientResponseToVM(
              response.snapshots.client
            )
          : {},
        date: response.snapshots.date
          ? this.datesMappingService.datesResponseToVM(response.snapshots.date)
          : {},
        job: response.snapshots.job
          ? this.jobMappingService.jobResponseToVM(response.snapshots.job)
          : {},
        site: response.snapshots.site
          ? this.siteMappingService.siteResponseToVM(response.snapshots.site)
          : {},
      };
    }
    tender.snapshots = {
      client: response.tender?.snapshots?.client
        ? this.clientMappingService.clientResponseToVM(
          response.tender?.snapshots?.client
        )
        : {},
    };
    if (response.offers && response.offers.data) {
      tender.offers = response.offers.data.map((a) =>
        this.offerMappingService.offerResponseToVM(a)
      );
    }
    if (response.logs && response.logs.data) {
      tender.logs = response.logs.data;
    }
    tender.job_id = response.job_id;
    tender.job_name = response.job_name;
    tender.client_name = response.client_name;
    tender.job_code = response.job_code;
    tender.job_status = response.job_status;
    tender.role_name = response.role_name;
    tender.staff_manager = response.staff_manager;
    tender.job_location = response.job_location;
    tender.job_start_date = response.job_start_date
    tender.job_finish_date = response.job_finish_date;
    tender.job_start_time = response.job_start_time;
    tender.job_finish_time = response.job_finish_time;
    tender.staff_count = response.staff_count;
    tender.contract_type = response.contract_type;
    tender.start_date = response.start_date;
    tender.end_date = response.end_date;
    tender.days = response.days;
    tender.job_advert_end_date = response.job_advert_end_date;
    tender.job_advert_end_date_time = response.job_advert_end_date_time;
    tender.job_advert_start_date = response.job_advert_start_date;
    tender.job_advert_start_date_time = response.job_advert_start_date_time;
    tender.job_advertisement_id = response.job_advertisement_id;
    tender.staff_role_id = response.staff_role_id;
    tender.job_info = response.job_info;
    tender.tenders = response.tenders;
    return tender;
  }

  getJobTenderRequest(id: string, type: string): IdRequestVM {
    const request: SearchRequestVM = {};
    request.limit = 100000;
    request.order_by = 'appointed_at';
    request.include = ['assignment.date,offers.freelancer.user'];
    request.filters = [];
    request.filters.push({ key: 'job', value: id });
    request.filters.push({ key: 'state', value: 'active' });
    return request;
  }

  getByIdRequest(id: string, mode: string): IdRequestVM {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    if (mode === 'detail') {
      searchRequest.include = [
        'assignment.agent',
        'assignment.documents',
        'assignment.date.job.site',
        'assignment.date.job.project.client',
        'documents',
        'certificates',
      ];
    } else {
      searchRequest.include = [
        'assignment.agent',
        'assignment.documents',
        'assignment.date.job.site',
        'assignment.date.job.project.client',
        'documents',
        'certificates',
        'logs',
      ];
    }
    searchRequest.filters = [{ key: 'with_deleted', value: 1 }];
    return searchRequest;
  }
}
