import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AccountingActions } from './accounting.actions';
import { map, mergeMap } from 'rxjs/operators';
import { AccountList } from '../model/accountList';
import { AccountingService } from '../../services/accounting.service';

@Injectable()
export class AccountingEffects {
  loadAccountUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.loadCustomerList),
      mergeMap(({ params }) => this.accountingSvc.accountUsers(params)),
      map((lists: AccountList) => AccountingActions.loadCustomerListSuccess({ lists }))
    )
  );

  loadAccountSearchList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.loadAccountSearchList),
      mergeMap(({ params }) => this.accountingSvc.accountUsers(params)),
      map((lists: any) => AccountingActions.loadAccountSearchListSuccess({ lists }))
    )
  );

  loadUpdateAccountSearchList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.loadUpdateAccountSearchList),
      mergeMap(({ params }) => this.accountingSvc.accountUsers(params)),
      map((lists: any) => AccountingActions.loadUpdateAccountSearchListSuccess({ lists }))
    )
  );

  editAccountData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.loadEditAccountData),
      mergeMap(({ params }) => this.accountingSvc.accountUsers(params)),
      map((lists: any) => AccountingActions.loadEditAccountDataSuccess({ lists }))
    )
  );

  editAccountList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.loadEditAccountListData),
      mergeMap(({ param }) => this.accountingSvc.accountUsers(param)),
      map((lists: any) => AccountingActions.loadEditAccountListDataSuccess ({ lists }))
    )
  );

  exportList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.exportList),
      mergeMap(({params}) => this.accountingSvc.accountUsers(params)),
      map((lists: any) => AccountingActions.exportListSuccess({ lists }))
    )
  );

  exportDetailsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.exportDetailsList),
      mergeMap(({ params }) => this.accountingSvc.accountUsers(params)),
      map((lists: any) => AccountingActions.exportDetailsListSuccess({ lists }))
    )
  );

  updateInvoiceEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.updateInvoice),
      mergeMap(({ paramId, updateInvoiceValue }) => this.accountingSvc.updateInvoiceSvc(paramId, updateInvoiceValue)),
      map((lists: any) => AccountingActions.updateInvoiceSuccess({ lists }))
    )
  );

  deleteInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.deleteInvoice),
      mergeMap(({ id }) => this.accountingSvc.deleteInvoice(id)),
      map((id: any) => AccountingActions.deleteInvoiceSuccess({ id }))
    )
  );

  loadAccountingPreparationCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.accountingPreparationLoadCustomer),
      mergeMap(( { customer }) => this.accountingSvc.listCustomer(customer)
      ),
      map((lists: any) => AccountingActions.accountingPreparationLoadCustomerSuccess ({ lists }))
    )
  );

  loadAccountingPreparationProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.accountingPreparationLoadProject),
      mergeMap(({ project }) => this.accountingSvc.listProject(project)),
      map((lists: any) => AccountingActions.accountingPreparationLoadProjectSuccess ({ lists }))
    )
  );

  loadAccountingPreparationJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.accountingPreparationLoadJobs),
      mergeMap(({ jobs }) => this.accountingSvc.listJobs(jobs)),
      map((lists: any) => AccountingActions.accountingPreparationLoadJobsSuccess ({ lists }))
    )
  );

  loadAccountingPreparationTilesLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.accountingPreparationTilesLoad),
      mergeMap(({ jobs }) => this.accountingSvc.listTiles(jobs)),
      map((lists: any) => AccountingActions.accountingPreparationTilesLoadSuccess ({ lists }))
    )
  );

  loadAccountingPreparationGridsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.accountingCreateInvoiceGrid),
      mergeMap(({ grids }) => this.accountingSvc.listTiles(grids)),
      map((lists: any) => AccountingActions.accountingCreateInvoiceGridSuccess ({ lists }))
    )
  );

  loadRevenueFreelancers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.accountingRevenueFreelancer),
      mergeMap(({ params }) => this.accountingSvc.accountUsers(params)),
      map((lists: any) => AccountingActions.accountingRevenueFreelancerSuccess({ lists }))
    )
  );

  loadRevenueLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.accountingRevenueList),
      mergeMap(({ params }) => this.accountingSvc.accountUsers(params)),
      map((lists: any) => AccountingActions.accountingRevenueListSuccess({ lists }))
    )
  );
  salesDetailsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.revenuesDetails),
      mergeMap(({ paramId, updateInvoiceValue }) => this.accountingSvc.revenuesDetails( paramId, updateInvoiceValue )),
      map((lists: any) => AccountingActions.  revenuesDetailsSuccess({ lists }))
    )
  );

  exportRevenueLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.accountingExportRevenuesList),
      mergeMap(({ params }) => this.accountingSvc.accountUsers(params)),
      map((lists: any) => AccountingActions.accountingExportRevenuesListSuccess({ lists }))
    )
  );

  deleteSalesInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.deleteSalesReport),
      mergeMap(({ id }) => this.accountingSvc.deleteSalesInvoice(id)),
      map((id: any) => AccountingActions.deleteSalesReportSuccess({ id }))
    )
  );

  exportListData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.exportListData),
      mergeMap(({params}) => this.accountingSvc.exportListData(params)),
      map((lists: any) => AccountingActions.exportListDataSuccess({ lists }))
    )
  );

  loadExportListData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.loadExportListData),
      mergeMap(({ params }) => this.accountingSvc.loadExportData(params)),
      map((lists: any) => AccountingActions.loadExportListDataSuccess({ lists }))
    )
  );

  loadFileList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountingActions.loadAccountFile),
      mergeMap(({ file }) => this.accountingSvc.accountfilelist(file)),
      map((lists: any) => AccountingActions.loadAccountFileSuccess({ lists }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private http: HttpClient,
    private accountingSvc: AccountingService
  ) {}
}
