import { createAction, props } from '@ngrx/store';
import { AccountList } from '../model/accountList';
import { UpdateInvoice } from '../../model/accounting.model';

const loadCustomerList = createAction('[Accounting] Load Customer List', props<{ params: string }>());
const loadCustomerListSuccess = createAction(
  '[Accounting] Load Customer Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const loadAccountSearchList = createAction('[Accounting] Load Account Search List', props<{ params: string }>());
const loadAccountSearchListSuccess = createAction(
  '[Accounting] Load Account Search List Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const loadUpdateAccountSearchList = createAction('[Accounting] Load Update Account Search List', props<{ params: string }>());
const loadUpdateAccountSearchListSuccess = createAction(
  '[Accounting] Load Update Account Search List Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const loadEditAccountData = createAction('[Accounting] Load Edit Account List', props<{ params: string }>());
const loadEditAccountDataSuccess = createAction(
  '[Accounting] Load Edit Account Success List',
  props<{ lists: AccountList[] | AccountList }>()
);
const  loadEditAccountListData = createAction('[Accounting] Load Update Account Search List', props<{ param: string }>());
const loadEditAccountListDataSuccess = createAction(
  '[Accounting] Load Update Account Search List Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const exportList = createAction('[Accounting] Export List', props<{ params: string }>());
const exportListSuccess = createAction(
  '[Accounting] Export List Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const exportDetailsList = createAction('[Accounting] Export Details List', props<{ params: string }>());
const exportDetailsListSuccess = createAction(
  '[Accounting] Export Details List Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const updateInvoice = createAction('[Accounting] Update Invoice', props<{ paramId: number, updateInvoiceValue: UpdateInvoice }>());
const updateInvoiceSuccess = createAction(
  '[Accounting] Update Invoice Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const deleteInvoice = createAction('[Accounting] Delete Invoice', props<{ id: number | undefined }>());
const deleteInvoiceSuccess = createAction('[Accounting] Delete Invoice Success', props<{ id: number }>());
const accountingPreparationLoadCustomer = createAction('[Accounting] Accounting Preparation load Customer', props<{ customer: string }>());
const accountingPreparationLoadCustomerSuccess = createAction(
  '[Accounting] Accounting Preparation load Project Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const accountingPreparationLoadProject = createAction('[Accounting] Accounting Preparation Load Project', props<{ project: string }>());
const accountingPreparationLoadProjectSuccess = createAction(
  '[Accounting] Accounting Preparation Load Project Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const accountingPreparationLoadJobs = createAction('[Accounting] Accounting Preparation load Jobs', props<{ jobs: string }>());
const accountingPreparationLoadJobsSuccess = createAction(
  '[Accounting] Accounting Preparation load Jobs Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const accountingPreparationTilesLoad = createAction('[Accounting] Accounting Preparation Tile Load', props<{ jobs: string }>());
const accountingPreparationTilesLoadSuccess = createAction(
  '[Accounting] Accounting Preparation Tile Load Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const accountingCreateInvoiceGrid = createAction('[Accounting] Accounting Preparation Grid Load', props<{ grids: string }>());
const accountingCreateInvoiceGridSuccess = createAction(
  '[Accounting] Accounting Preparation Grid Load Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const accountingRevenueFreelancer = createAction('[Accounting] Accounting Revenue Freelancer', props<{ params: string }>());
const accountingRevenueFreelancerSuccess = createAction(
  '[Accounting] Accounting Revenue Freelancer Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const accountingRevenueList = createAction('[Accounting] Accounting Revenue List', props<{ params: string }>());
const accountingRevenueListSuccess = createAction(
  '[Accounting] Accounting Revenue List Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const revenuesDetails = createAction('[Accounting] Sales Details List', props<{ paramId: number, updateInvoiceValue: string }>());
const revenuesDetailsSuccess = createAction(
  '[Accounting]  Sales Details List Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const accountingExportRevenuesList = createAction('[Accounting] Accounting Revenue Export List', props<{ params: string }>());
const accountingExportRevenuesListSuccess = createAction(
  '[Accounting] Accounting Revenue Export List Success',
  props<{ lists: AccountList[] | AccountList }>()
);
const deleteSalesReport = createAction('[Accounting] Delete Sales Report', props<{ id: number | undefined }>());
const deleteSalesReportSuccess = createAction('[Accounting] Delete Sales Report Success', props<{ id: number }>());

const loadAccountFile = createAction('[Accounting] Load Account SEPA List', props<{ file: string }>());
const loadAccountFileSuccess = createAction(
  '[Accounting] Load Account SEPA List Success',
  props<{ lists: AccountList[] | AccountList }>()
);

const exportListData = createAction('[Accounting] Export List Data', props<{ params: string }>());
const exportListDataSuccess = createAction(
  '[Accounting] Export List Data Success',
  props<{ lists: AccountList[] | AccountList }>()
);

const loadExportListData = createAction('[Accounting] Load Export List Data', props<{ params: string }>());
const loadExportListDataSuccess = createAction(
  '[Accounting] Load Export List Data Success',
  props<{ lists: AccountList[] | AccountList }>()
);

export const AccountingActions = {
  loadCustomerList,
  loadCustomerListSuccess,
  loadAccountSearchList,
  loadAccountSearchListSuccess,
  loadUpdateAccountSearchList,
  loadUpdateAccountSearchListSuccess,
  loadEditAccountData,
  loadEditAccountDataSuccess,
  loadEditAccountListData,
  loadEditAccountListDataSuccess,
  exportList,
  exportListSuccess,
  exportDetailsList,
  exportDetailsListSuccess,
  updateInvoice,
  updateInvoiceSuccess,
  deleteInvoice,
  deleteInvoiceSuccess,
  exportListData,
  exportListDataSuccess,
  loadExportListData,
  loadExportListDataSuccess,
  accountingPreparationLoadCustomer,
  accountingPreparationLoadCustomerSuccess,
  accountingPreparationLoadProject,
  accountingPreparationLoadProjectSuccess,
  accountingPreparationLoadJobs,
  accountingPreparationLoadJobsSuccess,
  accountingPreparationTilesLoad,
  accountingPreparationTilesLoadSuccess,
  accountingCreateInvoiceGrid,
  accountingCreateInvoiceGridSuccess,
  accountingRevenueFreelancer,
  accountingRevenueFreelancerSuccess,
  accountingRevenueList,
  accountingRevenueListSuccess,
  revenuesDetails,
  revenuesDetailsSuccess,
  accountingExportRevenuesList,
  accountingExportRevenuesListSuccess,
  deleteSalesReport,
  deleteSalesReportSuccess,
  loadAccountFile,
  loadAccountFileSuccess
};
