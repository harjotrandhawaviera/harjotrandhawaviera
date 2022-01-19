import { Action, createReducer, on } from '@ngrx/store';
import { AccountingActions } from './accounting.actions';
import { AccountList } from '../model/accountList';

export const featureKey = 'accounting';

export interface AccountingState {
  accountList: AccountList | AccountList[];
  accountSearchList: AccountList | AccountList[];
  loading: boolean;
  editAccountView: AccountList | AccountList[];
  editAccountList: AccountList | AccountList[];
  exportData: AccountList | AccountList[];
  exportDetailsData: AccountList | AccountList[];
  exportListData: AccountList | AccountList[];
  loadExportListData: AccountList | AccountList[];
  accountingFileList: AccountList | AccountList[];
  accountingSearchFileList: AccountList | AccountList[];
  accountCustomers: AccountList | AccountList[];
  accountProjects: AccountList | AccountList[];
  accountJobs: AccountList | AccountList[];
  prepareTiles: AccountList | AccountList[];
  prepareCreateGrids: AccountList | AccountList[];
  freelancers: AccountList | AccountList[];
  accountingRevenue: AccountList | AccountList[];
  revenuesDetails: AccountList | AccountList[];
  accountingExportRevenue: AccountList | AccountList[];
  salesInvoiceId: number | undefined;
}

export const initialState: AccountingState = {
  accountList: [],
  accountSearchList: [],
  loading: false,
  editAccountView: [],
  editAccountList: [],
  exportData: [],
  exportListData: [],
  loadExportListData: [],
  exportDetailsData: [],
  accountingFileList: [],
  accountingSearchFileList: [],
  accountCustomers: [],
  accountProjects: [],
  accountJobs: [],
  prepareTiles: [],
  prepareCreateGrids: [],
  freelancers: [],
  accountingRevenue: [],
  revenuesDetails: [],
  accountingExportRevenue: [],
  salesInvoiceId: 0
};

export interface AccountingAppState {
  [featureKey]: AccountingState;
}

export const accountingReducer = createReducer<AccountingState>(
  initialState,
  on(AccountingActions.loadCustomerListSuccess, (state,  { lists} ) => ( {
    ...state,
    accountList: lists
  })),
  on(AccountingActions.loadAccountSearchList, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.loadAccountSearchListSuccess, (state,  { lists} ) => ({
    ...state,
    accountSearchList: lists,
    loading: false
  })),
  on(AccountingActions.loadUpdateAccountSearchList, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.loadUpdateAccountSearchListSuccess, (state,  { lists} ) => ({
    ...state,
    accountSearchList: lists,
    loading: false
  })),
  on(AccountingActions.loadEditAccountData, (state, { params} ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.loadEditAccountDataSuccess, (state, { lists} ) => ({
    ...state,
    editAccountView: lists,
    loading: false
  })),
  on(AccountingActions.loadEditAccountListData, (state, { param } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.loadEditAccountListDataSuccess, (state, { lists} ) => ({
    ...state,
    editAccountList: lists,
    loading: false
  })),
  on(AccountingActions.exportList, (state, { params} ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.exportListSuccess, (state, { lists} ) => ({
    ...state,
    exportData: lists,
    loading: false
  })),
  on(AccountingActions.exportList, (state, { params} ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.exportDetailsListSuccess, (state, { lists} ) => ({
    ...state,
    exportDetailsData: lists,
    loading: false
  })),
  on(AccountingActions.updateInvoice, (state, { paramId, updateInvoiceValue }) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.exportListData, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.exportListDataSuccess, (state,  { lists} ) => ({
    ...state,
    exportListData: lists,
    loading: false
  })),
  on(AccountingActions.loadExportListData, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.loadExportListDataSuccess, (state,  { lists} ) => ({
    ...state,
    loadExportListData: lists,
    loading: false
  })),
  on(AccountingActions.loadAccountFile, (state, { file} ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.loadAccountFileSuccess, (state, { lists} ) => ({
    ...state,
    accountingFileList: lists,
    loading: false
  })),
  on(AccountingActions.accountingPreparationLoadCustomer, (state, { customer } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.accountingPreparationLoadCustomerSuccess, (state, { lists} ) => ({
    ...state,
    accountCustomers: lists,
    loading: false
  })),
  on(AccountingActions.accountingPreparationLoadProject, (state, { project } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.accountingPreparationLoadProjectSuccess, (state, { lists} ) => ({
    ...state,
    accountProjects: lists,
    loading: false
  })),
  on(AccountingActions.accountingPreparationLoadJobsSuccess, (state, { lists} ) => ({
    ...state,
    accountJobs: lists,
    loading: false
  })),
  on(AccountingActions.accountingPreparationTilesLoad, (state, { jobs } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.accountingPreparationTilesLoadSuccess, (state, { lists} ) => ({
    ...state,
    prepareTiles: lists,
    loading: false
  })),
  on(AccountingActions.accountingCreateInvoiceGrid, (state, { grids } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.accountingCreateInvoiceGridSuccess, (state, { lists} ) => ({
    ...state,
    prepareCreateGrids: lists,
    loading: false
  })),
  on(AccountingActions.accountingRevenueFreelancer, (state, { params } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.accountingRevenueFreelancerSuccess, (state, { lists } ) => ({
    ...state,
    loading: false,
    freelancers: lists
  })),
  on(AccountingActions.accountingRevenueList, (state, { params } ) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.accountingRevenueListSuccess, (state, { lists } ) => ({
    ...state,
    loading: false,
    accountingRevenue: lists
  })),

  on(AccountingActions.revenuesDetails, (state, { paramId, updateInvoiceValue }) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.revenuesDetailsSuccess, (state, { lists } ) => ({
    ...state,
    loading: false,
    revenuesDetails: lists
  })),
  on(AccountingActions.accountingExportRevenuesList, (state, { params }) => ({
    ...state,
    loading: true
  })),
  on(AccountingActions.accountingExportRevenuesListSuccess, (state, { lists }) => ({
    ...state,
    loading: false,
    accountingExportRevenue: lists
  })),
  on(AccountingActions.deleteSalesReport, (state, { id }) => {
    return {
      ...state,
      loading: true,
      salesInvoiceId: id
    };
  }),
  on(AccountingActions.deleteSalesReportSuccess, (state, { id }) => {
    // @ts-ignore
    const findIndex = state.accountingRevenue?.data?.findIndex((res) => res.id === state.salesInvoiceId);
    // @ts-ignore
    const revenue = [ ...state.accountingRevenue.data ];
    revenue?.splice(findIndex, 1);
    return {
      ...state,
      loading: false,
      accountingRevenue: {...state.accountingRevenue, data: revenue}
    };
  })
);

// tslint:disable-next-line:typedef
export function reducer(state: AccountingState | undefined, action: Action) {
  return accountingReducer(state, action);
}
