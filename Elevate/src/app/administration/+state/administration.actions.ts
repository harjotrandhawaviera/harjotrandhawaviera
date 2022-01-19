import {createAction, props} from '@ngrx/store';
import {AdministrationEditList, AdministrationList} from '../model/administartionList';

const loadDeploymentList = createAction('[Administration] Load Deployment List', props<{ params: string }>());
const loadDeploymentListSuccess = createAction(
  '[Administration] Load Deployment Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const customerList = createAction('[Administration] Load customer List', props<{ params: string }>());
const loadCustomerListSuccess = createAction(
  '[Administration] Load customer Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadAdministrationSearchList = createAction('[Administration] Load Administration Search List', props<{ params: string }>());
const loadAdministrationSearchListSuccess = createAction(
  '[Administration] Load Administration Search List Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const deployDetails = createAction('[Administration] Deploy Details List', props<{ paramId: number, updateInvoiceValue: string }>());
const deployDetailsSuccess = createAction(
  '[Administration]  Deploy Details List Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const deployClientDetails = createAction('[Administration] Deploy Client Details List', props<{ paramId: number, updateInvoiceValue: string }>());
const deployClientDetailsSuccess = createAction(
  '[Administration]  Deploy Client Details List Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadEditDeployData = createAction('[Administration] Load Edit Deploy List', props<{ params: string }>());
const loadEditDeployDataSuccess = createAction(
  '[Administration] Load Edit Deploy Success List',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const deleteRecord = createAction('[Administration] Delete Records', props<{ id: number | undefined }>());
const deleteRecordSuccess = createAction(
  '[Administration] Delete Records Success', props<{ id: number }>()
);

const exportList = createAction('[Administration] Export List', props<{ params: string }>());
const exportListSuccess = createAction(
  '[Administration] Export List Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const addDeploy = createAction('[Administration] Deploy add', props<{ params: any }>());
const addDeploySuccess = createAction(
  '[Administration] Deploy add Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const updateDeploy = createAction('[Administration] Update Deploy', props<{ id: number, params: any }>());
const updateDeploySuccess = createAction(
  '[Administration] Update Deploy Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const updateCDeploy = createAction('[Administration] Update CDeploy', props<{ id: number, params: any }>());
const updateCDeploySuccess = createAction(
  '[Administration] Update CDeploy Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const updateFieldClient = createAction('[Administration] Update Field Client', props<{ id: number, params: any }>());
const updateFieldClientSuccess = createAction(
  '[Administration] Update Field Client Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const loadInsuranceList = createAction('[Administration] Load Insurance List', props<{ params: string }>());
const loadInsuranceSuccess = createAction(
  '[Administration] Load Insurance Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const deleteIRecord = createAction('[Administration] Delete Records Insurance', props<{ id: number | undefined }>());
const deleteIRecordSuccess = createAction(
  '[Administration] Delete Records Insurance Success', props<{ id: number }>()
);

const insuranceDetails = createAction('[Administration] insurance Details List', props<{ paramId: number, updateInvoiceValue: string }>());
const insuranceDetailsSuccess = createAction(
  '[Administration]  insurance Details List Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadEditInsuranceData = createAction('[Administration] Load Edit Insurance List', props<{ params: string }>());
const loadEditInsuranceDataSuccess = createAction(
  '[Administration] Load Edit Insurance Success List',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const updateInsurance = createAction('[Administration] Update Insurance', props<{ id: number, params: any }>());
const updateInsuranceSuccess = createAction(
  '[Administration] Update Insurance Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const addInsurance = createAction('[Administration] Insurance add', props<{ params: any }>());
const addInsuranceSuccess = createAction(
  '[Administration]  Insurance add Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadIncentiveList = createAction('[Administration] Load Incentive List', props<{ params: string }>());
const loadIncentiveListSuccess = createAction(
  '[Administration] Load Incentive Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const incentiveDetails = createAction('[Administration] incentive Details List', props<{ paramId: number, updateInvoiceValue: string }>());
const incentiveDetailsSuccess = createAction(
  '[Administration]  incentive Details List Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadEditIncentiveData = createAction('[Administration] Load Edit Incentive List', props<{ params: string }>());
const loadEditIncentiveDataSuccess = createAction(
  '[Administration] Load Edit Incentive Success List',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const updateIncentive = createAction('[Administration] Update Incentive', props<{ id: number, params: any }>());
const updateIncentiveSuccess = createAction(
  '[Administration] Update Incentive Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const loadFrameworkAgreementList = createAction('[Administration] Load Framework Agreement List', props<{ params: string }>());
const loadFrameworkAgreementListSuccess = createAction(
  '[Administration] Load Framework Agreement Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const frameworkDetails = createAction('[Administration] framework Details List', props<{ paramId: number, updateInvoiceValue: string }>());
const frameworkDetailsSuccess = createAction(
  '[Administration]  framework Details List Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);


const updateFramework = createAction('[Administration] Update Framework', props<{ id: number, params: any }>());
const updateFrameworkSuccess = createAction(
  '[Administration] Update Framework Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const loadRolesList = createAction('[Administration] Load Roles List', props<{ params: string }>());
const loadRolesSuccess = createAction(
  '[Administration] Load Roles Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);


const loadRights = createAction('[Administration] Load Rights ', props<{ params: string }>());
const loadRightsSuccess = createAction(
  '[Administration] Load Rights Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadLogsList = createAction('[Administration] Load Logs List', props<{ params: string }>());
const loadLogsListSuccess = createAction(
  '[Administration] Load Logs Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadLogsDataList = createAction('[Administration] Load Logs Data List', props<{ params: string }>());
const loadLogsDataListSuccess = createAction(
  '[Administration] Load Logs Data Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadAgentList = createAction('[Administration] Load Agent List', props<{ params: string }>());
const loadAgentListSuccess = createAction(
  '[Administration] Load Agent Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadRightsList = createAction('[Administration]  Rights List', props<{ params: string }>());
const loadRightsListSuccess = createAction(
  '[Administration]  Rights Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);


const RightsSave = createAction('[Administration] Rights Save Details', props<{ name: any}>());
const RightsSaveSuccess = createAction(
  '[Administration]  Rights Save Details Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);


const UpdateRights = createAction('[Administration] Update Rights', props<{ name: any, param: any, data: any }>());
const UpdateRightsSuccess = createAction(
  '[Administration] Update Rights Success',
  props<{ lists: AdministrationEditList[] | AdministrationEditList }>()
);

const loadMailLogList = createAction('[Administration] Load MailLog List', props<{ params: any }>());
const loadMailLogListSuccess = createAction(
  '[Administration] Load MailLog List Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);
const addNewInsurance = createAction('[Administration] New Insurance add', props<{ params: any }>());
const addNewInsuranceSuccess = createAction(
  '[Administration] New Insurance add Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);
const addgtcs = createAction('[Administration] Gtcs add', props<{ params: any }>());
const addgtcsSuccess = createAction(
  '[Administration] Gtcs add Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadMailLogListFreelancer = createAction('[Administration] Load MailLog List Freelancer', props<{ params: any }>());
const loadMailLogListFreelancerSuccess = createAction(
  '[Administration] Load MailLog List Freelancer Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadMailLogsDataList = createAction('[Administration] Load Mail Logs Data List', props<{ params: string }>());
const loadMailLogsDataListSuccess = createAction(
  '[Administration] Load Mail Logs Data Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadClientList = createAction('[Administration] Load Client List', props<{ params: string }>());
const loadClientListSuccess = createAction(
  '[Administration] Load Client Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadSiteDataList = createAction('[Administration] Load Site Data List', props<{ params: string }>());
const loadSiteDataListSuccess = createAction(
  '[Administration] Load Logs Site Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const deleteFieldClient = createAction('[Administration] Delete Field Client', props<{ id: number | undefined, cid: number | undefined }>());
const deleteFieldClientSuccess = createAction(
  '[Administration] Delete Field Client Success', props<{ id: number, cid: number }>()
);

const loadInsuranceDataList = createAction('[Administration] Load Insurance Data List ', props<{ params: any }>());
const loadInsuranceDataListSuccess = createAction(
  '[Administration] Load Insurance Data List  Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);

const loadClientDownloadList = createAction('[Administration] Load Client Download List ', props<{ params: any }>());
const loadClientDownloadListSuccess = createAction(
  '[Administration] Load Client Download List  Success',
  props<{ lists: AdministrationList[] | AdministrationList }>()
);



export const AdministrationAction = {
  loadDeploymentList,
  loadDeploymentListSuccess,
  loadAdministrationSearchList,
  loadAdministrationSearchListSuccess,
  deployDetails,
  deployDetailsSuccess,
  deployClientDetails,
  deployClientDetailsSuccess,
  loadEditDeployData,
  loadEditDeployDataSuccess,
  deleteRecord,
  deleteRecordSuccess,
  exportList,
  exportListSuccess,
  addDeploy,
  addDeploySuccess,
  customerList,
  loadCustomerListSuccess,
  updateDeploy,
  updateDeploySuccess,
  updateCDeploy,
  updateCDeploySuccess,
  loadInsuranceList,
  loadInsuranceSuccess,
  deleteIRecord,
  deleteIRecordSuccess,
  insuranceDetails,
  insuranceDetailsSuccess,
  loadEditInsuranceData,
  loadEditInsuranceDataSuccess,
  updateInsurance,
  updateInsuranceSuccess,
  addInsurance,
  addInsuranceSuccess,
  loadIncentiveList,
  loadIncentiveListSuccess,
  incentiveDetails,
  incentiveDetailsSuccess,
  loadEditIncentiveData,
  loadEditIncentiveDataSuccess,
  updateIncentive,
  updateIncentiveSuccess,
  loadFrameworkAgreementList,
  loadFrameworkAgreementListSuccess,
  frameworkDetails,
  frameworkDetailsSuccess,
  updateFramework,
  updateFrameworkSuccess,
  loadRolesList,
  loadRolesSuccess,
  loadRights,
  loadRightsSuccess,
  loadLogsList,
  loadLogsListSuccess,
  loadAgentList,
  loadAgentListSuccess,
  loadRightsList,
  loadRightsListSuccess,
  RightsSave,
  RightsSaveSuccess,
  UpdateRights,
  UpdateRightsSuccess,
  loadMailLogList,
  loadMailLogListSuccess,
  addNewInsurance,
  addNewInsuranceSuccess,
  addgtcs,
  addgtcsSuccess,
  loadMailLogListFreelancer,
  loadMailLogListFreelancerSuccess,
  loadLogsDataList,
  loadLogsDataListSuccess,
  loadMailLogsDataList,
  loadMailLogsDataListSuccess,
  loadClientList,
  loadClientListSuccess,
  loadSiteDataList,
  loadSiteDataListSuccess,
  updateFieldClient,
  updateFieldClientSuccess,
  deleteFieldClient,
  deleteFieldClientSuccess,
  loadInsuranceDataList,
  loadInsuranceDataListSuccess,
  loadClientDownloadList,
  loadClientDownloadListSuccess
};
