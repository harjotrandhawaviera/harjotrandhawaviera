/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */

import * as moment from 'moment';

import {
  AssignmentSearchVM,
  AssignmentVM,
  CheckinsSearchVM,
  CustomerAssignmentSearchVM,
} from '../../model/assignment.model';
import { IdRequestVM, SearchRequestVM } from '../../model/search.model';

import { AssignmentResponse } from '../../model/assignment.response';
import { CertificateMappingService } from './certificate-mapping.service';
import { CheckinResponse } from '../../model/checkin.response';
import { CheckinVM } from '../../model/checkin.model';
import { FormatConfig } from '../../constant/formats.constant';
import { FormatService } from '../format.service';
import { Injectable } from '@angular/core';
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class AssignmentMappingService {
  constructor(
    private formatService: FormatService,
    private certificateMappingService: CertificateMappingService
  ) { }

  searchRequest(search: AssignmentSearchVM, view?: string): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.limit = search.pageSize;
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    if (view === 'client') {
      searchRequest.include = [
        'date.job.site,freelancers.user,date.job.project.client,checkins.creator,checkins.updator,documents,revenues,invoices',
      ];
      searchRequest.only_fields = [
        'assignment.id',
        'assignment.category',
        'assignment.state',
        'assignment.start_time',
        'assignment.finish_time',
        'assignment.freelancer_id',
        'assignment.has_missing_docs',
        'assignment.planned_costs',
        'assignment.freelancer_costs_net',
        'assignment.comment',
        'assignment.is_creator',
        'date.appointed_at',
        'job.title',
        'job.job_location',
        'client.name',
        'site.name',
        'site.number',
        'site.address',
        'site.zip',
        'site.city',
        'site.group',
        'site.phone',
        'freelancer.id',
        'freelancer.fullname',
        'freelancer.firstname',
        'freelancer.lastname',
        'freelancer.mobile',
        'user.email',
      ];
    } else if (view === 'freelancer') {
      searchRequest.include = [
        'date.job.site,date.job.project.client,checkins.creator,checkins.updator,documents.approval,revenues,invoices',
      ];
      searchRequest.only_fields = [
        'assignment.id',
        'assignment.category',
        'assignment.state',
        'assignment.start_time',
        'assignment.finish_time',
        'assignment.freelancer_id',
        'assignment.has_missing_docs',
        'assignment.planned_costs',
        'assignment.freelancer_costs_net',
        'assignment.comment',
        'date.appointed_at',
        'job.title',
        'client.name',
        'freelancer.id',
        'freelancer.fullname',
        'freelancer.firstname',
        'freelancer.lastname',
        'freelancer.mobile',
        'user.email',
      ];
    } else {
      searchRequest.include = [
        'date.job.site',
        'freelancers',
        'invoices',
        'checkins',
        'tenders',
      ];
      searchRequest.only_fields = [
        'assignment.id',
        'assignment.state',
        'assignment.freelancer_id',
        'assignment.start_time',
        'assignment.finish_time',
        'assignment.is_done',
        'date.appointed_at',
        'job.title',
        'job.job_location',
        'site.name',
        'site.number',
        'site.address',
        'site.zip',
        'site.city',
        'freelancer.id',
        'freelancer.firstname',
        'freelancer.lastname',
        'invoice.state',
        'tender.id',
        'tender.state',
      ];
    }
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
    if (search.freelancer) {
      searchRequest.filters.push({
        key: 'freelancer',
        value: search.freelancer,
      });
    }
    if (search.states && search.states.length) {
      searchRequest.filters.push({
        key: 'states',
        value: search.states.join(','),
      });
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
    if (search.site) {
      searchRequest.filters.push({ key: 'site', value: search.site });
    }
    if (search.invoiceState) {
      searchRequest.filters.push({
        key: 'invoice_state',
        value: search.invoiceState,
      });
    }
    if (search.contractType) {
      searchRequest.filters.push({
        key: 'contract_type_id',
        value: search.contractType,
      });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    if (search.only_missing_docs) {
      searchRequest.filters.push({
        key: 'only_missing_docs',
        value: search.only_missing_docs,
      });
    }
    if (search.onlyBillable && !search.onlyBilled) {
      searchRequest.filters.push({
        key: 'only_billable',
        value: search.onlyBillable,
      });
    }
    if (!search.onlyBillable && search.onlyBilled) {
      searchRequest.filters.push({
        key: 'only_billed',
        value: search.onlyBilled,
      });
    }
    if (search.onlyBillable && search.onlyBilled) {
      const state = search.states?.length
        ? [search.states, 'preparation', 'invoiced']
        : ['preparation', 'invoiced'];
      searchRequest.filters.push({ key: 'states', value: state.join(',') });
    }
    return searchRequest;
  }

  customerAssignmentsearchRequest(
    search: CustomerAssignmentSearchVM
  ): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.limit = search.pageSize;
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.include = [
      'date.job.site',
      'freelancers',
      'invoices',
      'checkins',
      'tenders',
      'creator',
    ];
    searchRequest.only_fields = [
      'assignment.id',
      'assignment.state',
      'assignment.freelancer_id',
      'assignment.start_time',
      'assignment.finish_time',
      'assignment.is_done',
      'assignment.created_at',
      'date.appointed_at',
      'job.title',
      'site.name',
      'site.number',
      'site.address',
      'site.zip',
      'site.city',
      'freelancer.id',
      'freelancer.firstname',
      'freelancer.lastname',
      'invoice.state',
      'tender.id',
      'tender.state',
    ];
    searchRequest.filters = [];
    if (search.client) {
      searchRequest.filters.push({ key: 'client_id', value: search.client });
    }
    if (search.agent) {
      searchRequest.filters.push({ key: 'agent_id', value: search.agent });
    }
    if (search.project) {
      searchRequest.filters.push({ key: 'project', value: search.project });
    }
    if (search.site) {
      searchRequest.filters.push({ key: 'site', value: search.site });
    }
    if (search.contractType) {
      searchRequest.filters.push({
        key: 'contract_type_id',
        value: search.contractType,
      });
    }
    if (search.states && search.states.length) {
      searchRequest.filters.push({
        key: 'states',
        value: search.states.join(','),
      });
    }
    if (search.creator) {
      searchRequest.filters.push({ key: 'creator_id', value: search.creator });
    }
    if (search.createdFrom) {
      searchRequest.filters.push({
        key: 'created_from',
        value: search.createdFrom,
      });
    }
    if (search.createdTo) {
      searchRequest.filters.push({
        key: 'created_to',
        value: search.createdTo,
      });
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
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    searchRequest.filters.push({ key: 'only_client_created', value: true });

    return searchRequest;
  }

  CheckinsSearchRequest(search: CheckinsSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.limit = search.pageSize;
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.include = ['date.job.site', 'freelancers.user', 'checkins'];
    searchRequest.only_fields = [
      'assignment.id',
      'assignment.freelancer_id',
      'assignment.start_time',
      'assignment.finish_time',
      'date.appointed_at',
      'job.title',
      'job.site_client_contact',
      'site.name',
      'site.number',
      'site.address',
      'site.zip',
      'site.city',
      'site.group',
      'site.phone',
      'freelancer.id',
      'freelancer.fullname',
      'freelancer.firstname',
      'freelancer.lastname',
      'freelancer.mobile',
      'user.id',
      'user.email',
    ];
    searchRequest.filters = [];
    if (search.project) {
      searchRequest.filters.push({ key: 'project', value: search.project });
    }
    if (search.site) {
      searchRequest.filters.push({ key: 'site', value: search.site });
    }
    if (search.freelancer) {
      searchRequest.filters.push({
        key: 'freelancer',
        value: search.freelancer,
      });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    searchRequest.filters.push({ key: 'without_checkins', value: true });

    return searchRequest;
  }

  assignmentMultipleResponseToVM(
    response: MultipleResponse<AssignmentResponse>,
    type?: string
  ): PagedResult<AssignmentVM> {
    const obj: PagedResult<AssignmentVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
      meta: response.meta,
    };
    if (response.data?.length) {
      response.data.forEach((item) => {
        if (type === 'searchAssignment') {
          const assignment: AssignmentVM =
            this.assignmentSearchResponseToVM(item);
          obj.list.push(assignment);
        } else {
          const client: AssignmentVM = this.assignmentResponseToVM(item);
          obj.list.push(client);
        }
      });
    }
    return obj;
  }

  assignmentResponseToVM(response: AssignmentResponse): AssignmentVM {
    console.log(response.freelancer_assignment_feedback_instance_id, 'response.freelancer_assignment_feedback_instance_id');
    const assignmentVM: AssignmentVM = {};
    assignmentVM.id = response.id;
    assignmentVM.date_id = response.date_id;
    assignmentVM.budget_id = response.budget_id;
    assignmentVM.incentive_model_id = response.incentive_model_id;
    assignmentVM.incentive_model = response.incentive_model?.data;
    assignmentVM.certificate_ids = response.certificate_ids;
    if (response.certificates && response.certificates.data) {
      assignmentVM.certificates = response.certificates.data.map((a) =>
        this.certificateMappingService.certificateResponseToVM(a)
      );
    }
    assignmentVM.contact_id = response.contact_id;
    assignmentVM.agent_id = response.agent_id;
    assignmentVM.agent = response.agent?.data;
    assignmentVM.assignment_budget_correction =
      response.assignment_budget_correction;
    assignmentVM.appointed_at = moment
      .utc(response.appointed_at)
      .toDate()
      .toLocaleDateString();
    assignmentVM.state = response.state;
    assignmentVM.checkins = response.checkins?.data;
    assignmentVM.category = response.category;
    assignmentVM.description = response.description;
    assignmentVM.information = response.information;
    assignmentVM.briefing = response.briefing;
    assignmentVM.assignment_budget = response.assignment_budget;
    assignmentVM.wage = response.wage;
    assignmentVM.start_time = response.start_time;
    assignmentVM.finish_time = response.finish_time;
    assignmentVM.role_name = response.role_name;
    assignmentVM.rate = response.rate;
    assignmentVM.currency = response.currency;
    assignmentVM.rate_type = response.rate_type;
    assignmentVM.user = response.user;
    assignmentVM.checkin_location = response.checkin_location;
    assignmentVM.data = response.data;
    assignmentVM.feedback = response.feedback;
    assignmentVM.freelancer_assignment_feedback_instance_id =
      response.freelancer_assignment_feedback_instance_id;
    assignmentVM.freelancer_assignment_questionnaire_instance_id =
      response.freelancer_assignment_questionnaire_instance_id;
    assignmentVM.freelancer_costs_net = response.freelancer_costs_net;
    assignmentVM.documents = response.documents?.data;
    assignmentVM.saleslots = response.saleslots;
    assignmentVM.freelancer_id = response.freelancer_id;
    assignmentVM.freelancers = response.freelancers?.data;
    assignmentVM.invoices = response.invoices?.data;
    assignmentVM.revenues = response.revenues?.data;
    assignmentVM.freelancer_ratings = response.freelancer_ratings;
    assignmentVM.additional_costs = response.additional_costs;
    assignmentVM.has_missing_docs = response.has_missing_docs;
    assignmentVM.comment = response.comment;
    assignmentVM.questionnaire = response.questionnaire;
    assignmentVM.has_invoice_requirements = response.has_invoice_requirements;
    assignmentVM.contract_type_id = response.contract_type_id;
    assignmentVM.contract_type_identifier = response.contract_type_identifier;
    assignmentVM.date = response.date;
    assignmentVM.planned_costs = response.planned_costs;
    assignmentVM.is_billed = response.is_billed;
    assignmentVM.is_booked = response.is_booked;
    assignmentVM.is_creator = response.is_creator;
    assignmentVM.is_prepareable = response.is_prepareable;
    assignmentVM.is_done = response.is_done;
    return assignmentVM;
  }

  assignmentSearchResponseToVM(response: AssignmentResponse): AssignmentVM {
    const assignmentVM: AssignmentVM = {};
    assignmentVM.id = response.id;
    assignmentVM.freelancer_id = response.freelancer_id;
    assignmentVM.is_done = response.is_done;
    assignmentVM.date = response.date;
    assignmentVM.start_time = response.start_time;
    assignmentVM.finish_time = response.finish_time;
    assignmentVM.state = response.state;
    assignmentVM.checkins = response.checkins?.data;
    assignmentVM.freelancers = response.freelancers?.data;
    assignmentVM.invoices = response.invoices?.data;
    assignmentVM.tenders = response.tenders?.data;
    if (response.start_time && response.finish_time) {
      let appointClass = {};
      const start = /(\d+):(\d+)/.exec(response.start_time);
      const finish = /(\d+):(\d+)/.exec(response.finish_time);
      if (start && finish) {
        const startMoment = moment
          .utc(response.date.data.appointed_at)
          .tz(FormatConfig.dates.timezone)
          .hours(+start[1])
          .minutes(+start[2]);
        const finishMoment = moment
          .utc(response.date.data.appointed_at)
          .tz(FormatConfig.dates.timezone)
          .hours(+finish[1])
          .minutes(+finish[2]);
        const diff = finishMoment.diff(startMoment, 'minutes') / 60;
        if (diff < environment.clientCreatedAssignments.minJobHours) {
          appointClass = { cssClass: 'hour-warning' };
        }
        const startDateTime = startMoment.toDate();
        const startDateTimeLabel = startDateTime ? this.formatService.datetime(startDateTime) : null;
        const finishTimeLabel = finishMoment.toDate().toLocaleTimeString([], {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        });
        assignmentVM.startDateTime = startDateTime;
        assignmentVM.appointedDateTime = {
          appointClass,
          dateTime: startDateTimeLabel + ' - ' + finishTimeLabel,
        };
      }
    }

    return assignmentVM;
  }

  assignmentVMToResponse(
    model: AssignmentVM,
    mode?: string
  ): AssignmentResponse {
    const response: any = {};
    // const updatedDocs: JobDocumentVM[] = [];
    if (mode === 'create') {
      // response.start_time = model.start_time;
      // response.finish_time = model.finish_time;
      // response.assignment_budget = model.assignment_budget;
      // response.wage = model.wage;
      // response.budget_id = model.budget_id;
      // response.additional_costs = model.additional_costs;
      response.data = model.data;
      response.date = model.date;
      response.date_id = model.date_id;
      response.description = model.description;
      response.agent_id = model.agent_id;
      response.appointed_at = model.appointed_at;
      response.briefing = model.briefing;
      response.category = model.category;
      response.categoryName = model.categoryName;
      response.certificates = model.certificates;
      response.certificate_ids = model.certificate_ids;
      response.information = model.information;
      response.job = model.job;
      response.information = model.information;
      response.client = model.client;
      response.state = model.state;
      response.freelancer_ratings = model.freelancer_ratings;
      response.saleslots = model.saleslots;
      response.feedback = model.feedback;
      response.documents = model.documents;
    }
    // if (model.documents && model.documents.length) {
    //   model.documents.forEach((d: JobDocumentVM) => {
    //     const doc = {
    //       document_id: d.id,
    //       description: d.description,
    //       name: d.name,
    //       type: d.type,
    //       create: true,
    //       original_filename: d.original_filename,
    //       mime: d.mime,
    //       job_id: d.job_id,
    //     };
    //     updatedDocs.push(doc);
    //   });
    // }
    if (model.start_time) {
      response.start_time = model.start_time;
    }
    if (model.finish_time) {
      response.finish_time = model.finish_time;
    }
    if (model.assignment_budget) {
      response.assignment_budget = model.assignment_budget;
    }
    if (model.wage) {
      response.wage = model.wage;
    }
    if (model.budget_id) {
      response.budget_id = model.budget_id;
    }
    if (model.additional_costs) {
      response.additional_costs = model.additional_costs;
    }
    if (model.comment) {
      response.comment = model.comment;
    }
    if (model.freelancer_costs_net) {
      response.freelancer_costs_net = model.freelancer_costs_net;
    }
    if (model.assignment_budget_correction) {
      response.assignment_budget_correction =
        model.assignment_budget_correction;
    }
    return response;
  }

  checkinVMToResponse(model: CheckinVM): CheckinResponse {
    const response: any = {};
    response.performed_at = model.performed_at;
    // response.finished_at = model.finished_at;
    response.assignment_id = model.assignment_id;
    response.freelancer_id = model.freelancer_id;
    return response;
  }

  getByIdRequest(id: string): IdRequestVM {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    searchRequest.include = [
      'date.job.site,date.job.project.client,documents.approval.updator,tenders,freelancers.user,checkins,certificates,agent,revenues.creator,revenues.updator,questionnaire,incentive_model',
    ];
    return searchRequest;
  }
  groupedDoc(documents: any[]) {
    const docs: any = {};
    // init pre-set
    ['briefing', 'template-report', 'template-questionnaire'].forEach((type) => {
      docs[type] = [];
    });
    // process
    (documents || []).forEach((doc: any) => {
      const doc1 = {
        ...doc, ...{ document_id: doc.id }, ...{
          url: doc.url,
          originalFilename: doc.original_filename || null,
          saved: true
        }
      };
      if (!docs[doc1.type]) {
        docs[doc1.type] = [];
      }
      docs[doc1.type].push(doc1);
    });
    return docs;
  }
  mapAssignmentForPreparation(item: any) {
    console.log(item, 'item');
    item.feedback_instance_approval = item.feedback_instance_approval;
    item.freelancer_assignment_feedback_instance_id = item.freelancer_assignment_feedback_instance_id;
    item.date = item.date && item.date.data;
    item.job = item.date && item.date.job && item.date.job.data;
    if (item.job) {
      item.job.shortTitle = item.job.title && item.job.title.split(' | ')[0];
      item.jobTitle = item.job && item.job.title;
      item.jobShortTitle = item.jobTitle && item.jobTitle.split(' | ')[0];
    }
    item.appointedAt = item.date.appointed_at && this.formatService.date(item.date.appointed_at);
    item.project = item.job && item.job.project && item.job.project.data;
    item.client = item.project && item.project.client && item.project.client.data;
    item.clientName = item.client && item.client.name;
    item.site = (item.job && item.job.site && item.job.site.data) || {};
    const incentive_model = item.incentive_model && (item.incentive_model.data || item.incentive_model);
    item.incentive_model = incentive_model && {
      checkin: incentive_model.checkin,
      sales_report: incentive_model.sales_report,
      picture_documentation: incentive_model.picture_documentation
    };
    item.documents = item.documents && item.documents.data && this.groupedDoc(item.documents.data.map((doc: any) => {
      doc.approval = doc.approval && {
        ...doc.approval,
        ...{
          performed_by: (doc.approval.updator && doc.approval.updator.data.name &&
            doc.approval.updator.data.name)
        }
      };
      return doc;
    }));
    if (item.freelancer_id) {
      item.bookedFreelancer = item.freelancers && item.freelancers.data.find((a: any) => a.id === item.freelancer_id);
      item.freelancerName = item.bookedFreelancer && (item.bookedFreelancer.firstname + ' ' + item.bookedFreelancer.lastname);
      item.freelancerUserId = item.bookedFreelancer && item.bookedFreelancer.user && item.bookedFreelancer.user.data.id;
      item.freelancerEmail = item.bookedFreelancer && item.bookedFreelancer.user && item.bookedFreelancer.user.data.email;
      item.freelancerPhone = item.bookedFreelancer && item.bookedFreelancer.mobile;
    } else {
      item.freelancerName = ''; // do avoid exception in list view
    }
    item.checkins = item.checkins && item.checkins.data;
    if (item.checkins && item.checkins.length) {
      const checkin = item.checkins[0];
      item.reported = {
        id: checkin.id,
        start: {
          time: this.formatService.datetime(checkin.performed_at, FormatConfig.transform.timeformat),
          user: checkin.created_by,
          doneOnBehalf: item.freelancerUserId !== checkin.created_by,
          creator: checkin.creator && checkin.creator.data
        }
      };
      if (checkin.finished_at) {
        item.reported.finish = {
          time: checkin.finished_at && this.formatService.datetime(checkin.finished_at, FormatConfig.transform.timeformat),
          user: checkin.updated_by,
          doneOnBehalf: item.freelancerUserId !== checkin.updated_by,
          updator: checkin.updator && checkin.updator.data
        };
      }
    }
    return item;
  }

}
