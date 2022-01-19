import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccountingActions } from './accounting.actions';
import { AccountingAppState } from './accounting.reducer';
import { fromAccounting } from './accounting.selector';
import { AccountingSearchVM, UpdateInvoice } from '../../model/accounting.model';

@Injectable({
  providedIn: 'root'
})
export class AccountingFacade {
  constructor(private store: Store<AccountingAppState>) {}
  getAccountList$ = this.store.select(fromAccounting.getAccountList);
  getAccountSearchList$ = this.store.select(fromAccounting.getAccountSearchList);
  getLoading$ = this.store.select(fromAccounting.getLoading);
  getAccountEditData$ = this.store.select(fromAccounting.getAccountEditData);
  getEditDisplayRecord$ = this.store.select(fromAccounting.getEditDisplayRecord);
  getExportData$ = this.store.select(fromAccounting.getExportData);
  getExportDetailData$ = this.store.select(fromAccounting.getExportDetailData);
  getLoadFileData$ = this.store.select(fromAccounting.getLoadFileData);
  getAccountFileSearchList$ = this.store.select(fromAccounting.getAccountFileSearchList);
  getAccountPrepareCustomer$ = this.store.select(fromAccounting.getAccountPrepareCustomer);
  getAccountPrepareProject$ = this.store.select(fromAccounting.getAccountPrepareProject);
  getAccountPrepareJobs$ = this.store.select(fromAccounting.getAccountPrepareJobs);
  getAccountPrepareTiles$ = this.store.select(fromAccounting.getAccountPrepareTiles);
  getCreateInvoiceGrids$ = this.store.select(fromAccounting.getGridCreateInvoice);
  getFreelancersList$ = this.store.select(fromAccounting.getRevenueFreelancer);
  getAccountingRevenue$ = this.store.select(fromAccounting.getAccountingRevenueList);
  getRevenueDetail$ = this.store.select(fromAccounting.getRevenuesDetails);
  getExportDetails$ = this.store.select(fromAccounting.getAccountingExportRevenue);
  getExportListData$ = this.store.select(fromAccounting.getExportListData);
  getExportListSearchData$ = this.store.select(fromAccounting.getExportListSearchData);

  loadAccounting() {
    const params = '/clients?limit=10000&order_by=name&only_fields=client.id,client.name';
    this.store.dispatch(AccountingActions.loadCustomerList({ params }));
  }

  loadAccountingSearchList() {
    let params = '';
    params = '/bills?include=client&limit=50&page=1&add_aggregate=true';
    this.store.dispatch(AccountingActions.loadAccountSearchList({ params }));
  }

  exportList(updatePageIndex?: boolean) {
    let params = '';
    if (updatePageIndex) {
      params = '/bills?include=client&limit=100000&add_aggregate=true';
    }
    this.store.dispatch(AccountingActions.exportList({ params }));
  }

  exportDetailList(paramId: string, updatePageIndex?: boolean) {
    let params = '';
    if (updatePageIndex) {
      params = '/assignments?include=date.job.project.client,checkins,documents,freelancers&page=1&order_by=appointed_at&order_dir=asc&bill=' + paramId + '&only_fields=assignment.id,assignment.start_time,assignment.finish_time,assignment.comment,assignment.assignment_budget,assignment.assignment_budget_correction,assignment.appointed_at,assignment.planned_costs,assignment.is_billed,assignment.freelancer_id,client.id,client.name,checkin.performed_at,checkin.finished_at,job.id,job.title,freelancer.id,freelancer.fullname';
    }
    this.store.dispatch(AccountingActions.exportDetailsList({ params }));
  }

  loadEditAccountData(paramsId: string) {
    const params = '/bills/' + paramsId + '?include=client';
    this.store.dispatch(AccountingActions.loadEditAccountData({ params }));
  }
  loadEditAccountListData(paramId: string, update?: AccountingSearchVM) {
    let param = '';
    param = '/assignments?include=date.job.project.client,checkins,documents,freelancers&limit=50&page=1&order_by=appointed_at&order_dir=asc&bill=' + paramId + '&only_fields=assignment.id,assignment.start_time,assignment.finish_time,assignment.comment,assignment.assignment_budget,assignment.assignment_budget_correction,assignment.appointed_at,assignment.planned_costs,assignment.is_billed,assignment.freelancer_id,client.id,client.name,checkin.performed_at,checkin.finished_at,job.id,job.title,freelancer.id,freelancer.fullname';
    if (update) {
      param += '&page=' + update.pageIndex;
    }
    this.store.dispatch(AccountingActions.loadEditAccountListData({ param }));
  }

  accountingPreparationLoadCustomer() {
    const customer = '/clients?limit=10000&order_by=name&only_fields=client.id,client.name';
    this.store.dispatch(AccountingActions.accountingPreparationLoadCustomer({ customer }));
  }

  accountingPreparationLoadProject(params?: string) {
    let project = '/projects?limit=100000&order_by=name&&only_fields=project.id,project.name,project.category,project.started_at,project.finished_at,project.client_id,project.state';
    if (params){
      project += '&client_id=' + params;
    }
    this.store.dispatch(AccountingActions.accountingPreparationLoadProject( { project }));
  }

  accountingPreparationLoadProjects(params?: {client_id?: number, project_id?: number}) {
    let project = '/projects?limit=100000&order_by=name&&only_fields=project.id,project.name,project.category,project.started_at,project.finished_at,project.client_id,project.state';
    if (params?.client_id){
      project += '&client_id=' + params.client_id;
    }
    this.store.dispatch(AccountingActions.accountingPreparationLoadProject( { project }));
  }

  accountingPreparationLoadJobs(params?: { client_id?: string, project_id?: string }) {
    let jobs = '/jobs?limit=100000&order_by=title&&only_fields=job.id,job.title';
    if (params?.client_id) {
      jobs += '&client_id=' + params.client_id;
    }
    if (params?.project_id) {
      jobs += '&project_id=' + params.project_id;
    }
    this.store.dispatch(AccountingActions.accountingPreparationLoadJobs( { jobs }));
  }

  loadUpdateAccountingSearchList(updateValue: any) {
    const client = updateValue.client;
    const pageValue = updateValue.pageIndex;
    const searchValue = updateValue.search;
    let params = '/bills?include=client&limit=50&add_aggregate=true';
    if (client) {
      params += '&client_id=' + client;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AccountingActions.loadAccountSearchList({ params }));
  }

  updateInvoiceValue(paramId: number, updateInvoiceValue: UpdateInvoice) {
    this.store.dispatch(AccountingActions.updateInvoice({ paramId, updateInvoiceValue }));
  }

  createPrepareTiles(params?: { client_id?: string, project_id?: string }) {
    let jobs = '';
    if (params?.client_id) {
      // tslint:disable-next-line:max-line-length
      jobs = '/jobs?limit=12&page=1&has_billable_assignments=true&billable_job_view=true&client_id=' + params.client_id + '&only_fields=';
    }
    if (params?.client_id && params?.project_id) {
      // tslint:disable-next-line:max-line-length
      jobs = '/jobs?limit=12&page=1&has_billable_assignments=true&billable_job_view=true&project_id=' + params.project_id + '&client_id=' + params.client_id + '&only_fields=';
    }
    this.store.dispatch(AccountingActions.accountingPreparationTilesLoad( { jobs }));
  }

  createInvoiceGrids(params?: { clientId: string, dateTo: string, dateFrom: string }) {
    let grids = '/assignments?limit=1000&order_by=appointed_at&order_dir=asc&only_billable=true&billable_assignment_view=true&only_fields=';
    if (params?.clientId) {
      grids += '&client_id=' + Number(params.clientId);
    }
    if (params?.dateFrom) {
      grids += '&dateFrom=' + params.dateFrom;
    }
    if (params?.dateTo) {
      grids += '&dateTo=' + params.dateTo;
    }
    this.store.dispatch(AccountingActions.accountingCreateInvoiceGrid( { grids }));
  }

  deleteInvoice(id: number | undefined) {
    this.store.dispatch(AccountingActions.deleteInvoice({ id }));
  }

  loadExportListData(update?: any) {
    let params = '/invoices?limit=10000&order_by=payment_target&order_dir=asc';
    if (update?.type) {
      params += `&filter_for_export=${update?.type}`;
    }
    if (update?.payment_target_from) {
      params += `&payment_target_from=${update?.payment_target_from}`;
    }
    if (update?.payment_target_to) {
      params += `&payment_target_to=${update?.payment_target_to}`;
    }
    this.store.dispatch(AccountingActions.exportListData({ params }));
  }

  loadExportListSearchData(update?: any) {
    let params = '/invoices/exports?include=creator,document&limit=50&page=1&order_by=created_at&order_dir=desc';

    this.store.dispatch(AccountingActions.loadExportListData({ params }));
  }

  revenueFreelancersLoad() {
      const params = '/freelancers?limit=100000&only_approved=true&only_fields=freelancer.id,freelancer.lastname,freelancer.firstname,freelancer.zip,freelancer.city,user.id,user.status';
      this.store.dispatch(AccountingActions.accountingRevenueFreelancer({ params }));
  }

  revenueLists(
    data?:
      {
        client_id?: number,
        project_id?: number;
        jobs_id?: number;
        dateFrom?: any;
        dateTo?: any;
        freelancerId?: number,
        pageIndex?: number
      }
    ) {
    let params = '/revenues?include=freelancer,job.project.client,assignments.date,creator&limit=12&add_summary=true&only_fields=revenue.id,revenue.created_at,revenue.total,revenue.average,revenue.warning_threshold,revenue.sales_volume,freelancer.fullname,job.title,client.name,date.appointed_at,creator.fullname';
    if (data?.client_id) {
      params += '&client_id=' + data?.client_id;
    }
    if (data?.project_id) {
      params += '&project_id=' + data.project_id;
    }
    if (data?.jobs_id) {
      params += '&job=' + data.jobs_id;
    }
    if (data?.dateFrom) {
      params += '&date_From=' + data.dateFrom;
    }
    if (data?.dateTo) {
      params += '&date_To=' + data.dateTo;
    }
    if (data?.freelancerId) {
      params += '&freelancer=' + data.freelancerId;
    }
    if (data?.pageIndex) {
      params += '&page=' + data.pageIndex;
    }
    else if (!data?.pageIndex) {
      params += '&page=1';
    }
    this.store.dispatch(AccountingActions.accountingRevenueList({ params }));
  }
  exportSalesList(
    data?:
      {
        client_id?: number,
        project_id?: number;
        jobs_id?: number;
        dateFrom?: any;
        dateTo?: any;
        freelancerId?: number,
        pageIndex?: number
      }
  ) {
    let params = '/revenues?include=freelancer,job.project.client,assignments.date,creator&add_summary=true&only_fields=revenue.id,revenue.created_at,revenue.total,revenue.average,revenue.warning_threshold,revenue.sales_volume,freelancer.fullname,job.title,client.name,date.appointed_at,creator.fullname';
    if (data?.client_id) {
      params += '&client_id=' + data?.client_id;
    }
    if (data?.project_id) {
      params += '&project_id=' + data.project_id;
    }
    if (data?.jobs_id) {
      params += '&job=' + data.jobs_id;
    }
    if (data?.dateFrom) {
      params += '&date_From=' + data.dateFrom;
    }
    if (data?.dateTo) {
      params += '&date_To=' + data.dateTo;
    }
    if (data?.freelancerId) {
      params += '&freelancer=' + data.freelancerId;
    }

    this.store.dispatch(AccountingActions.accountingExportRevenuesList({params}));
  }

  RevenuesDetail(paramId: number) {
    const updateInvoiceValue = '?include=freelancer,job.project.client,assignments.date,creator';
    this.store.dispatch(AccountingActions.revenuesDetails({ paramId, updateInvoiceValue }));
  }

  deleteSalesInvoice(id: number | undefined) {
    this.store.dispatch(AccountingActions.deleteSalesReport({ id }));
  }

  loadAccountingfile(params?: { type?: string, s_date?: any, e_date?: any, pageIndex?: number }) {
    const type = params?.type;
    const s_date = params?.s_date;
    const e_date = params?.e_date;
    let file = '/invoices/exports?include=creator,document&limit=50&order_by=created_at&order_dir=desc';
    if (params?.type) {
      file += '&export_type=' + type;
    }
    if (params?.s_date) {
      file += '&date_from=' + s_date;
    }
    if (params?.e_date) {
      file += '&date_to=' + e_date;
    }
    if (params?.pageIndex) {
      file += '&page=' + params.pageIndex;
    }
    this.store.dispatch(AccountingActions.loadAccountFile({ file }));
  }
}
