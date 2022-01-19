import {Action, createReducer, on} from '@ngrx/store';
import {AdministrationAction} from './administration.actions';
import {AdministrationEditList, AdministrationList} from '../model/administartionList';


export const featureKey = 'administration';

export interface AdministrationState {
  deploymentList: AdministrationList | AdministrationList[];
  newDeployData: AdministrationList | AdministrationList[];
  administrationSearchList: AdministrationEditList | AdministrationEditList[];
  loading: boolean;
  deploymentDetails: AdministrationList | AdministrationList[];
  deploymentClientDetails: AdministrationList | AdministrationList[];
  editDeployView: AdministrationEditList | AdministrationEditList[];
  deployId: number | undefined;
  exportData: AdministrationList | AdministrationList[];
  Customer: AdministrationList | AdministrationList[];
  InsuranceList: AdministrationList | AdministrationList[];
  InsuranceDetails: AdministrationList | AdministrationList[];
  editInsuranceView: AdministrationEditList | AdministrationEditList[];
  IncentiveList: AdministrationList | AdministrationList[];
  IncentiveDetails: AdministrationList | AdministrationList[];
  editIncentiveView: AdministrationEditList | AdministrationEditList[];
  FrameworkList: AdministrationList | AdministrationList[];
  frameworkDetails: AdministrationEditList | AdministrationEditList[];
  rolesList: AdministrationList | AdministrationList[];
  RightsList: AdministrationList | AdministrationList[];
  LogsList: AdministrationList | AdministrationList[];
  LogsDataList: AdministrationList | AdministrationList[];
  AgentList: AdministrationList | AdministrationList[];
  RightList: AdministrationList | AdministrationList[];
  RightSaveList: AdministrationList | AdministrationList[];
  MailLogList: AdministrationList | AdministrationList[];
  newInsuranceData: AdministrationList | AdministrationList[];
  gtcsId: number | undefined;
  mailLogFreelancer: AdministrationList | AdministrationList[];
  MailLogsDataList: AdministrationList | AdministrationList[];
  InsuranceDownloadList: AdministrationList | AdministrationList[];
  ClientDownloadList: AdministrationList | AdministrationList[];
  ClientList: AdministrationList | AdministrationList[];
  SiteDataList: AdministrationList | AdministrationList[];
}

export const initialState: AdministrationState = {
  deploymentList: [],
  newDeployData: [],
  loading: false,
  administrationSearchList: [],
  deploymentDetails: [],
  deploymentClientDetails: [],
  editDeployView: [],
  deployId: 0,
  exportData: [],
  Customer: [],
  InsuranceList: [],
  InsuranceDetails: [],
  editInsuranceView: [],
  IncentiveList: [],
  IncentiveDetails: [],
  editIncentiveView: [],
  FrameworkList: [],
  frameworkDetails: [],
  rolesList: [],
  RightsList: [],
  LogsList: [],
  AgentList: [],
  RightSaveList: [],
  MailLogList: [],
  RightList: [],
  newInsuranceData: [],
  gtcsId: 0,
  mailLogFreelancer: [],
  LogsDataList: [],
  MailLogsDataList: [],
  ClientList: [],
  SiteDataList: [],
  InsuranceDownloadList: [],
  ClientDownloadList: []
};

export interface AdministrationAppState {
  [featureKey]: AdministrationState;
}

export const administrationReducer = createReducer<AdministrationState>(
  initialState,
  on(AdministrationAction.loadDeploymentList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadDeploymentListSuccess, (state, {lists}) => ({
    ...state,
    deploymentList: lists
  })),
  on(AdministrationAction.addDeploy, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.addDeploySuccess, (state, {lists}) => ({
    ...state,
    newDeployData: lists
  })),
  on(AdministrationAction.addInsurance, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.addInsuranceSuccess, (state, {lists}) => ({
    ...state,
    newInsuranceData: lists
  })),
  on(AdministrationAction.customerList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadCustomerListSuccess, (state, {lists}) => ({
    ...state,
    Customer: lists
  })),
  on(AdministrationAction.loadAdministrationSearchList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadAdministrationSearchListSuccess, (state, {lists}) => ({
    ...state,
    administrationSearchList: lists,
    loading: false
  })),
  on(AdministrationAction.deployDetails, (state, {paramId, updateInvoiceValue}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.deployDetailsSuccess, (state, {lists}) => ({
    ...state,
    loading: false,
    deploymentDetails: lists
  })),
  on(AdministrationAction.deployClientDetails, (state, {paramId, updateInvoiceValue}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.deployClientDetailsSuccess, (state, {lists}) => ({
    ...state,
    loading: false,
    deploymentClientDetails: lists
  })),
  on(AdministrationAction.loadEditDeployData, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadEditDeployDataSuccess, (state, {lists}) => ({
    ...state,
    editDeployView: lists,
    loading: false
  })),
  on(AdministrationAction.deleteRecordSuccess, (state, {id}) => {
    // @ts-ignore
    const findIndex = state.deploymentList?.data?.findIndex((res) => res.id === state.deployId);
    // @ts-ignore
    const deploy = [...state.deploymentList.data];
    deploy?.splice(findIndex, 1);
    return {
      ...state,
      loading: false,
      deploymentList: {...state.deploymentList, data: deploy}
    };
  }),
  on(AdministrationAction.exportList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.exportListSuccess, (state, {lists}) => ({
    ...state,
    exportData: lists,
    loading: false
  })),

  on(AdministrationAction.updateDeploy, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadInsuranceList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadInsuranceSuccess, (state, {lists}) => ({
    ...state,
    InsuranceList: lists
  })),
  on(AdministrationAction.insuranceDetails, (state, {paramId, updateInvoiceValue}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.insuranceDetailsSuccess, (state, {lists}) => ({
    ...state,
    loading: false,
    InsuranceDetails: lists
  })),
  on(AdministrationAction.loadEditInsuranceData, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadEditInsuranceDataSuccess, (state, {lists}) => ({
    ...state,
    editInsuranceView: lists,
    loading: false
  })),
  on(AdministrationAction.loadIncentiveList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadIncentiveListSuccess, (state, {lists}) => ({
    ...state,
    IncentiveList: lists
  })),
  on(AdministrationAction.incentiveDetails, (state, {paramId, updateInvoiceValue}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.incentiveDetailsSuccess, (state, {lists}) => ({
    ...state,
    loading: false,
    IncentiveDetails: lists
  })),
  on(AdministrationAction.loadEditIncentiveData, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadEditIncentiveDataSuccess, (state, {lists}) => ({
    ...state,
    editIncentiveView: lists,
    loading: false
  })),
  on(AdministrationAction.loadFrameworkAgreementList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadFrameworkAgreementListSuccess, (state, {lists}) => ({
    ...state,
    FrameworkList: lists
  })),
  on(AdministrationAction.frameworkDetails, (state, {paramId, updateInvoiceValue}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.frameworkDetailsSuccess, (state, {lists}) => ({
    ...state,
    loading: false,
    frameworkDetails: lists
  })),
  on(AdministrationAction.loadRolesList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadRolesSuccess, (state, {lists}) => ({
    ...state,
    rolesList: lists
  })),
  on(AdministrationAction.loadRights, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadRightsSuccess, (state, {lists}) => ({
    ...state,
    RightsList: lists
  })),
  on(AdministrationAction.loadLogsList, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadLogsListSuccess, (state,  { lists} ) => ( {
    ...state,
    LogsList: lists
  })),
  on(AdministrationAction.loadLogsDataList, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadLogsDataListSuccess, (state,  { lists} ) => ( {
    ...state,
    LogsDataList: lists
  })),
  on(AdministrationAction.loadAgentList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadAgentListSuccess, (state, {lists}) => ({
    ...state,
    AgentList: lists
  })),
  on(AdministrationAction.RightsSave, (state, {name}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.RightsSaveSuccess, (state, {lists}) => ({
    ...state,
    RightSaveList: lists
  })),
  on(AdministrationAction.loadMailLogList, (state, { params }) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadMailLogListSuccess, (state, {lists}) => ({
    ...state,
    MailLogList: lists
  })),
  on(AdministrationAction.loadRightsList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadRightsListSuccess, (state, {lists}) => ({
    ...state,
    RightList: lists
  })),
  on(AdministrationAction.addgtcs, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.addgtcsSuccess, (state, {lists}) => ({
    ...state,
    newDeployData: lists
  })),
  on(AdministrationAction.loadMailLogListFreelancer, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadMailLogListFreelancerSuccess, (state, {lists}) => ({
    ...state,
    mailLogFreelancer: lists
  })),
  on(AdministrationAction.loadMailLogsDataList, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadMailLogsDataListSuccess, (state,  { lists} ) => ( {
    ...state,
    MailLogsDataList: lists
  })),
  on(AdministrationAction.loadClientList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadClientListSuccess, (state, {lists}) => ({
    ...state,
    ClientList: lists,
    loading: false
  })),
  on(AdministrationAction.loadSiteDataList, (state, {params}) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadSiteDataListSuccess, (state, {lists}) => ({
    ...state,
    SiteDataList: lists
  })),

  on(AdministrationAction.loadInsuranceDataList, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadInsuranceDataListSuccess, (state,  { lists} ) => ( {
    ...state,
    InsuranceDownloadList: lists
  })),
  on(AdministrationAction.loadClientDownloadList, (state,  { params } ) => ({
    ...state,
    loading: true
  })),
  on(AdministrationAction.loadClientDownloadListSuccess, (state,  { lists} ) => ( {
    ...state,
    ClientDownloadList: lists
  })),
);

// tslint:disable-next-line:typedef
export function reducer(state: AdministrationState | undefined, action: Action) {
  return administrationReducer(state, action);
}

