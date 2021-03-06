import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AdministrationState, featureKey} from './administration.reducer';

export const getFeatureState = createFeatureSelector<AdministrationState>(featureKey);

export const fromAdministration = {
  getLoading: createSelector(getFeatureState, (state) => state.loading),
  getDeploymentDetails: createSelector(getFeatureState, (state) => state.deploymentDetails),
  getDeploymentClientDetails: createSelector(getFeatureState, (state) => state.deploymentClientDetails),
  getDeploymentList: createSelector(getFeatureState, (state) => state.deploymentList),
  getCustomerList: createSelector(getFeatureState, (state) => state.Customer),
  getAdministrationSearchList: createSelector(getFeatureState, (state) => state.administrationSearchList),
  getEditDisplayRecord: createSelector(getFeatureState, (state) => state.editDeployView),
  getExportData: createSelector(getFeatureState, (state) => state.exportData),
  getInsuranceList: createSelector(getFeatureState, (state) => state.InsuranceList),
  getInsuranceDetails: createSelector(getFeatureState, (state) => state.InsuranceDetails),
  getIEditDisplayRecord: createSelector(getFeatureState, (state) => state.editInsuranceView),
  getIncentiveList: createSelector(getFeatureState, (state) => state.IncentiveList),
  getIncentiveDetails: createSelector(getFeatureState, (state) => state.IncentiveDetails),
  getIcEditDisplayRecord: createSelector(getFeatureState, (state) => state.editIncentiveView),
  getFrameworkList: createSelector(getFeatureState, (state) => state.FrameworkList),
  getFrameworkDetails: createSelector(getFeatureState, (state) => state.frameworkDetails),
  getRoles: createSelector(getFeatureState, (state) => state.rolesList),
  getRights: createSelector(getFeatureState, (state) => state.RightsList),
  getLogsList: createSelector(getFeatureState, (state) => state.LogsList),
  getLogsDataList: createSelector(getFeatureState, (state) => state.LogsDataList),
  getAgentList: createSelector(getFeatureState, (state) => state.AgentList),
  getRightList: createSelector(getFeatureState, (state) => state.RightList),
  getRightsList: createSelector(getFeatureState, (state) => state.RightSaveList),
  getMailList: createSelector(getFeatureState, (state) => state.MailLogList),
  getNewDeployData: createSelector(getFeatureState, (state) => state.newDeployData),
  getNewInsuranceData: createSelector(getFeatureState, (state) => state.newInsuranceData),
  getMailLogFreelancerData: createSelector(getFeatureState, (state) => state.mailLogFreelancer),
  getMailLogsDataList: createSelector(getFeatureState, (state) => state.MailLogsDataList),
  getClientList: createSelector(getFeatureState, (state) => state.ClientList),
  getSiteDataList: createSelector(getFeatureState, (state) => state.SiteDataList),
  getInsuranceDownloadList: createSelector(getFeatureState, (state) => state.InsuranceDownloadList),
  getClientDownloadList: createSelector(getFeatureState, (state) => state.ClientDownloadList),
};
