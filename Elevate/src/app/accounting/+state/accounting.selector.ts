import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountingState, featureKey } from './accounting.reducer';
export const getFeatureState = createFeatureSelector<AccountingState>(featureKey);

export const fromAccounting = {
  getLoading: createSelector(getFeatureState, (state) => state.loading),
  getAccountList: createSelector(getFeatureState, (state) => state.accountList),
  getAccountSearchList: createSelector(getFeatureState, (state) => state.accountSearchList),
  getAccountEditData: createSelector(getFeatureState, (state) => state.editAccountView),
  getEditDisplayRecord: createSelector(getFeatureState, (state) => state.editAccountList),
  getExportData: createSelector(getFeatureState, (state) => state.exportData),
  getExportDetailData: createSelector(getFeatureState, (state) => state.exportDetailsData),
  getLoadFileData: createSelector(getFeatureState, (state) => state.accountingFileList),
  getAccountFileSearchList: createSelector(getFeatureState, (state) => state.accountingSearchFileList),
  getAccountPrepareCustomer: createSelector(getFeatureState, (state) => state.accountCustomers),
  getAccountPrepareProject: createSelector(getFeatureState, (state) => state.accountProjects),
  getAccountPrepareJobs: createSelector(getFeatureState, (state) => state.accountJobs),
  getAccountPrepareTiles: createSelector(getFeatureState, (state) => state.prepareTiles),
  getGridCreateInvoice: createSelector(getFeatureState, (state) => state.prepareCreateGrids),
  getRevenueFreelancer: createSelector(getFeatureState, (state) => state.freelancers),
  getAccountingRevenueList:  createSelector(getFeatureState, (state) => state.accountingRevenue),
  getRevenuesDetails: createSelector(getFeatureState, (state) => state.revenuesDetails),
  getAccountingExportRevenue: createSelector(getFeatureState, (state) => state.accountingExportRevenue),
  getExportListData: createSelector(getFeatureState, (state) => state.exportListData),
  getExportListSearchData: createSelector(getFeatureState, (state) => state.loadExportListData)
};
