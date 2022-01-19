/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */

import { IdRequestVM, SearchRequestVM } from '../../model/search.model';
import { InvoiceSearchVM, InvoiceVM } from '../../model/invoice.model';

import { FormatConfig } from './../../constant/formats.constant';
import { FormatService } from './../format.service';
import { Injectable } from '@angular/core';
import { InvoiceResponse } from './../../model/invoice.response';
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { PrepareService } from './../prepare.service';
import { TranslateService } from './../translate.service';
import { environment } from './../../../environments/environment.uat';

// import { FormConfig } from './../../constant/forms.constant';

@Injectable()
export class InvoiceMappingService {
  constructor(
    private formatService: FormatService,
    private prepareService: PrepareService,
    private translateService: TranslateService) {

  }

  invoiceMultipleResponseToVM(response: MultipleResponse<InvoiceResponse>): PagedResult<InvoiceVM> {
    const obj: PagedResult<InvoiceVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const invoice: InvoiceVM = this.invoiceResponseToVM(item);
        obj.list.push(invoice);
      });
    }
    return obj;
  }
  invoiceResponseToVM(response: InvoiceResponse): InvoiceVM {
    let invoiceVM: InvoiceVM = {};
    invoiceVM.id = response.id;
    invoiceVM.number = response.number;
    invoiceVM.state = response.state;
    invoiceVM.comment = response.comment;
    invoiceVM.total = response.total;
    invoiceVM.issued_at = response.issued_at;
    invoiceVM.document_id = response.document_id;
    invoiceVM.includes_taxes = response.includes_taxes;
    invoiceVM.payment_total = response.payment_total;
    invoiceVM.payment_comment = response.payment_comment;
    invoiceVM.payment_target = response.payment_target;
    invoiceVM.assignment_ids = response.assignment_ids;
    invoiceVM.summary = response.summary;
    invoiceVM.with_discount = response.with_discount;
    invoiceVM.freelancer_id = response.freelancer_id;
    invoiceVM.freelancer_name = response.freelancer_name;
    invoiceVM.approval = response.approval?.data ? this.transformApproval(response.approval?.data) : undefined;
    if (response.document && response.document.data) {
      invoiceVM.document = this.transformSingleDoc(response.document.data, true);
    }
    invoiceVM.additional = {};
    if (response.assignments && response.assignments.data) {
      invoiceVM.assignments = response.assignments.data.map(a => this.transformAssignment(a));

      let revenues: any[] = [];
      invoiceVM.assignments.forEach((assignment: any) => {
        const obj = this.assignmentDocumentsToObj(invoiceVM.additional, assignment);
        invoiceVM.additional = obj.obj;
        assignment = obj.assignment;
        console.log(assignment.revenues, 'assignment.revenues');
        if (assignment.revenues) {
          revenues = revenues.concat(assignment.revenues.data);
        }
        // disable assignment for invoicing because additional docs are missing or in state rejected
        assignment.disabled = assignment.disabled || !assignment.has_invoice_requirements;
      });
      invoiceVM.revenues = revenues.map(this.transformRevenue);
      this.revenuesToReports(invoiceVM.additional.report, invoiceVM.revenues);
      invoiceVM.assignmentIds = invoiceVM.assignments.map(a => a.id);
      invoiceVM.freelancerRatings = invoiceVM.assignments[0].freelancerRatings;
      invoiceVM.jobTitle = invoiceVM.assignments && invoiceVM.assignments.length && invoiceVM.assignments[0]?.date?.data?.job?.data?.title;
      invoiceVM.jobTitleShort = invoiceVM.assignments && invoiceVM.assignments.length && invoiceVM.assignments[0].jobname;
      console.log(invoiceVM.assignments, 'invoiceVM.assignments');
      invoiceVM.jobId = // String(collection.extract(invoiceVM.assignments[0], 'date.job.id'));
        invoiceVM.assignments.length > 0 &&
          invoiceVM.assignments[0]?.date && invoiceVM.assignments[0]?.date?.data ? invoiceVM.assignments[0]?.date.data.job?.data?.id : undefined;
    }
    invoiceVM.creatorName = response.creator?.data?.name || '';
    // merge freelancer data - as not all in snapshot
    invoiceVM.freelancer = { ...(response.freelancer?.data || {}), ...{ ...response.snapshots || {} } };
    invoiceVM = this.calcPaymentTotalNet(invoiceVM);
    console.log(invoiceVM, 'invoiceVM');
    return invoiceVM;
  }
  transformSingleDoc(doc: any, saved: boolean) {
    return {
      ...doc,
      url: doc.url || environment.api + `/documents/${doc.id}`,
      mime: doc.mime || null,
      size: doc.size || null,
      originalFilename: doc.original_filename || null,
      saved
    };
  }
  calcPaymentTotalNet(invoice: InvoiceVM): InvoiceVM {
    // calculation on payment total and payment total net
    const taxRates = invoice.assignments ? invoice.assignments.map((a: any) => a.vat) : [];
    if (invoice.includes_taxes === true) {
      if (taxRates.length > 1) {
        let net = 0;
        (invoice.assignments || []).forEach((assignment: any) => {
          net += (parseFloat(assignment.freelancer_costs_net || assignment.max_estimated_costs) * 100);
        });
        invoice.paymentTotalNet = Math.round(net) / 100;
        invoice.paymentTotalNetHint = true;
      } else if (taxRates.length === 1) {
        const base = parseFloat(invoice.total ? invoice.total.toString() : '0') * 100;
        const tax = parseFloat(taxRates[0]);
        invoice.paymentTotalNet = Math.round(base / (1 + (tax / 100))) / 100;
      } else {
        invoice.paymentTotalNet = undefined;
      }
    } else {
      invoice.paymentTotalNet = undefined;
    }
    return invoice;
  }
  searchRequest(search: InvoiceSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = [];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy || 'issued_at';
    searchRequest.order_dir = search.sortDir || 'desc';
    searchRequest.limit = search.pageSize;
    searchRequest.only_fields = [];
    searchRequest.filters = [];
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    if (search.freelancerId) {
      searchRequest.filters.push({ key: 'freelancer', value: search.freelancerId });
    }
    if (search.jobId) {
      searchRequest.filters.push({ key: 'job', value: search.jobId });
    }
    if (search.state) {
      searchRequest.filters.push({ key: 'state', value: search.state });
    }
    if (search.dateFrom) {
      searchRequest.filters.push({ key: 'date_from', value: this.prepareService.datetime(search.dateFrom) });
    }
    if (search.dateTo) {
      searchRequest.filters.push({ key: 'date_to', value: this.prepareService.datetime(search.dateTo) });
    }
    return searchRequest;
  }
  getInvoiceRequest(id: number): IdRequestVM {
    const request: SearchRequestVM = {};
    request.limit = 100000;
    request.order_by = 'name';
    request.order_dir = 'asc';
    request.include = ['contacts'];
    request.only_fields = [
      'invoice.id',
      'invoice.available',
      'invoice.name',
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
      'client,contacts,order.invoice,creator',
    ];
    return searchRequest;
  }
  transformJob(job: any) {
    job.templates = [];
    if (job.documents && job.documents.data) {
      job.documents.data.forEach((item: any) => {
        if (item.type.match('template')) {
          job.templates.push(item);
        }
      });
    }
    job.assignments = [];
    if (job.dates && job.dates.data) {
      job.dates.data.forEach((date: any) => {
        if (date.assignments && date.assignments.data) {
          date.assignments.data.forEach((assignment: any) => {
            assignment.invoices = assignment.invoices && assignment.invoices.data && assignment.invoices.data[0];
            job.assignments.push(assignment);
          });
        }
      });
    }
    job.revenues = (job.revenues && job.revenues.data.map(this.transformRevenue)) || [];
    job.assignmentsCount = { all: job.assignments.length, done: 0 };
    job.assignmentDocuments = {};
    job.shortTitle = job.title && job.title.split(' | ')[0];
    // transform assignments and documents
    (job.assignments || []).forEach((assignment: any) => {
      assignment.appointedAt = this.formatService.date(assignment.appointed_at);

      // prepare for assignmentslist in invoices details/edit
      assignment.jobname = job.shortTitle;
      assignment.jobId = job.id;
      assignment.sitename = job.site && job.site.data.name + (job.site.data.number ? (' | ' + job.site.data.number) : '');

      job.assignmentsCount.done += assignment.is_done ? 1 : 0;
      assignment = this.transformAssignment(assignment);
      const obj = this.assignmentDocumentsToObj(job.assignmentDocuments, assignment);
      assignment = obj.assignment;
      job.assignmentDocuments = obj.obj;
      this.revenuesToReports(job.assignmentDocuments.report, job.revenues);
    });

    return job;
  }
  /**
   *
   *
   * transforms a revenue
   *
   *
   *
   * @param revenue
   * @return
   */
  transformRevenue(revenue: any) {
    // revenue = revenuesService.transform(revenue);
    revenue.salesVolume = {};
    revenue.sales_volume.forEach((vol: any) => {
      revenue.salesVolume[vol.saleslot] = vol.value;
    });
    return revenue;
  }
  /**
   *
   *
   * revenues stored as array in object
   *
   *
   *
   * @param obj Object containing all revenues of an invoice
   * @param assignment
   */
  revenuesToReports(reports: any, revenues: any) {
    (reports || []).forEach((report: any) => {
      if (!report.revenues) {
        report.revenues = [];
      }
      if (report.trackingId) {
        report.revenues = revenues.filter((rev: any) => report.assignmentIds.some((rep: any) => rev.assignment_ids.indexOf(rep) >= 0));
      }
    });
  }
  /**
   *
   *
   * set documents by type into object
   *
   *
   *
   * @param obj the object that should contain documents by type
   * @param assignment
   */
  assignmentDocumentsToObj(obj: any, assignment: any) {
    (assignment.documents && assignment.documents.data || []).forEach((docItem: any) => {
      const type = docItem.type;
      obj[type] = obj[type] || [];

      // assignment blocked since included to any invoice
      assignment.disabled = !!assignment.invoices && assignment.invoices.state !== 'rejected';
      // doc already found or new created
      let doc = obj[type].find((a: any) => a.id === docItem.id);
      if (!doc) {
        doc = {
          ...docItem,
          trackingId: Math.random().toString(36).substr(2, 10),
          assignmentIds: [],
          rejectedIds: [],
          appointments: [],
          originalFilename: docItem.original_filename,
          readonly: docItem.approval && docItem.approval.data.state === 'accepted',
          approval: docItem.approval && docItem.approval.data && docItem.approval.data && this.transformApproval(docItem.approval.data)
        };
        // if (docItem.approval && docItem.approval.data && docItem.approval.data) {
        //   doc.approval = this.transformApproval(doc.approval.data);
        // }
        obj[type].push(doc);
      }
      doc.appointments.push(assignment.appointedAt);
      doc.assignmentIds.push(assignment.id);
      if (assignment.invoices && assignment.invoices.state === 'rejected') {
        doc.rejectedIds.push(assignment.id);
      }
    });
    return {
      obj,
      assignment
    };
  }

  /**
   *
   *
   * transform approval
   *
   *
   *
   * @param approval
   * @return
   */
  transformApproval(approval: any) {
    approval.performed_by = approval.updator && approval.updator.data.name &&
      approval.updator.data.name;
    return approval;
  }

  /**
   *
   *
   * transform assignments
   *
   *
   *
   * @param assignment
   * @return
   */
  transformAssignment(assignment: any) {
    // transforms all key value pairs to string
    const customPropertiesAsString = (properties: any, propKeyContext: any, formatAsCurrency: any) => {
      let propString = '';
      Object.keys(properties).forEach((key: string) => {
        const val = formatAsCurrency ? this.formatService.formatCurrency(properties[key]) : properties[key];
        if (propKeyContext) {
          const prop: any = {};
          prop[key] = val;
          propString += this.translateService.instant(propKeyContext + '.' + key, prop) + '<br>';
        } else {
          propString += key + ': ' + val + '<br>';
        }
      });
      return propString;
    };
    const additionalCostsToString = (additionalCostsObj: any[]) => {
      let costString = '';
      additionalCostsObj.forEach((cost: any) => {
        const val = this.formatService.formatCurrency(cost.value);
        costString += cost.name + ': ' + val + '<br>';
      });
      return costString;
    };

    const getSiteName = (assignment: any) => {
      const name = assignment.sitename || (assignment.date && assignment.date.data.job && assignment.date.data.job.data.site && assignment.date.data.job.data.site.data.name);
      const number = assignment.sitenumber || (assignment.date && assignment.date.data.job && assignment.date.data.job.data.site && assignment.date.data.job.data.site.data.number);

      return name + (number ? ' | ' + number : '');
    };

    const obj: any = {
      appointedAt: assignment.appointedAt || this.formatService.date(assignment.appointed_at),
      jobname: assignment.jobname || (assignment.date && assignment.date.data.job && assignment.date.data.job.data.title && assignment.date.data.job.data.title.split(' | ')[0]),
      freelancerRatings: assignment.freelancer_ratings || assignment.date?.job?.freelancer_ratings,
      jobId: assignment.jobId || (assignment.date && assignment.date.data.job && assignment.date.data.job.data.id),
      sitename: getSiteName(assignment),
      checkinStart: assignment.checkins && assignment.checkins.data.length > 0 && this.formatService.datetime(assignment.checkins.data[0].performed_at, FormatConfig.transform.timeformat),
      checkinEnd: assignment.checkins && assignment.checkins.data.length > 0 && this.formatService.datetime(assignment.checkins.data[0].finished_at, FormatConfig.transform.timeformat),
      checkinPerformer: (assignment.checkins && assignment.checkins.data.length > 0 && assignment.checkins.data[0].creator && assignment.checkins.data[0].creator.data && assignment.checkins.data[0].creator.data.name) || this.translateService.instant('common.users.system'),
      additionalCosts: (assignment.additional_costs && additionalCostsToString(assignment.additional_costs)) || '',
      incentiveModel: (assignment.incentive_model && customPropertiesAsString({ checkin: assignment.incentive_model.data.checkin, sales_report: assignment.incentive_model.data.sales_report, picture_documentation: assignment.incentive_model.data.picture_documentation }, 'invoices.table.incentives', true)) || '',
      wage: this.formatService.formatCurrency(assignment.wage) || '',
      assignmentBudget: this.formatService.formatCurrency(assignment.assignment_budget) || '',
      assignmentBudgetCorrection: this.formatService.formatCurrency(assignment.assignment_budget_correction) || '',
      estimatedCosts: this.formatService.formatCurrency(assignment.estimated_costs) || '',
      maxEstimatedCosts: this.formatService.formatCurrency(assignment.max_estimated_costs) || '',
      plannedCosts: this.formatService.formatCurrency(assignment.planned_costs) || '',
      freelancerCostsNet: this.formatService.formatCurrency(assignment.freelancer_costs_net) || '',
      // initialize approval entry for feedback, will be filled with content by survey directive
      feedbackApproval: (assignment.feedback_instance && assignment.feedback_instance.data.approval && assignment.feedback_instance.data.approval.data) || (assignment.feedback && assignment.feedback.length && assignment.feedback_instance_id && { approval: null }),
      classes: assignment.checkins && assignment.checkins.data.length > 0 && assignment.checkins.data[0].is_valid ? [] : ['checkin-warning'],
      taxRate: this.formatService.percent(assignment.vat)
    };
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        assignment[key] = obj[key];
      }
    }
    // console.log(assignment, 'assignment');
    return assignment;
  }
}
