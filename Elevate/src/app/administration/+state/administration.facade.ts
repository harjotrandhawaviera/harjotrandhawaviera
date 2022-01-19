import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AdministrationAction} from './administration.actions';
import {AdministrationAppState} from './administration.reducer';
import {fromAdministration} from './administration.selector';

@Injectable({
  providedIn: 'root'
})
export class AdministrationFacade {


  constructor(private store: Store<AdministrationAppState>) {
  }

  getDeploymentList$ = this.store.select(fromAdministration.getDeploymentList);
  getCustomerList$ = this.store.select(fromAdministration.getCustomerList);
  getLoading$ = this.store.select(fromAdministration.getLoading);
  getAdministrationSearchList$ = this.store.select(fromAdministration.getAdministrationSearchList);
  getDeploymentDetails$ = this.store.select(fromAdministration.getDeploymentDetails);
  getDeploymentClientDetails$ = this.store.select(fromAdministration.getDeploymentClientDetails);
  getEditDisplayRecord$ = this.store.select(fromAdministration.getEditDisplayRecord);
  getInsuranceList$ = this.store.select(fromAdministration.getInsuranceList);
  getInsuranceDetails$ = this.store.select(fromAdministration.getInsuranceDetails);
  getIEditDisplayRecord$ = this.store.select(fromAdministration.getIEditDisplayRecord);
  getIncentiveList$ = this.store.select(fromAdministration.getIncentiveList);
  getIncentiveDetails$ = this.store.select(fromAdministration.getIncentiveDetails);
  getIcEditDisplayRecord$ = this.store.select(fromAdministration.getIcEditDisplayRecord);
  getFrameworkList$ = this.store.select(fromAdministration.getFrameworkList);
  getFrameworkDetails$ = this.store.select(fromAdministration.getFrameworkDetails);
  getRoles$ = this.store.select(fromAdministration.getRoles);
  getRights$ = this.store.select(fromAdministration.getRights);
  getLogsList$ = this.store.select(fromAdministration.getLogsList);
  getLogsDataList$ = this.store.select(fromAdministration.getLogsDataList);
  getAgentList$ = this.store.select(fromAdministration.getAgentList);
  getRightsList$ = this.store.select(fromAdministration.getRightsList);
  getMailLogList$ = this.store.select(fromAdministration.getMailList);
  getNewDeployData$ = this.store.select(fromAdministration.getNewDeployData);
  getNewInsuranceData$ = this.store.select(fromAdministration.getNewInsuranceData);
  getMailLogFreelancerData$ = this.store.select(fromAdministration.getMailLogFreelancerData);
  getMailLogsDataList$ = this.store.select(fromAdministration.getMailLogsDataList);
  getClientList$ = this.store.select(fromAdministration.getClientList);
  getSiteDataList$ = this.store.select(fromAdministration.getSiteDataList);
  getInsuranceDownloadList$ = this.store.select(fromAdministration.getInsuranceDownloadList);
  getClientDownloadList$ = this.store.select(fromAdministration.getClientDownloadList);

  loadDemployment() {
    const params = '/sites?include=contact&limit=50';
    this.store.dispatch(AdministrationAction.loadDeploymentList({ params }));
  }
  loadCustomer() {
    const params = '/clients?limit=100000';
    this.store.dispatch(AdministrationAction.customerList({ params }));
  }
  loadUpdateDeploymentSearchList(updateValue: any) {
    const form = updateValue.from;
    const to = updateValue.to;
    const pageValue = updateValue.pageIndex;
    const searchValue = updateValue.search;
    let params = '/sites?include=contact&limit=50';
    if (form) {
      params += '&zip_from=' + form;
    }
    if (to) {
      params += '&zip_to=' + to;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AdministrationAction.loadDeploymentList({params}));
  }

  loadSiteData(updateValue: any) {
    const form = updateValue.from;
    const to = updateValue.to;
    const pageValue = updateValue.pageIndex;
    const searchValue = updateValue.search;
    let params = '/sites?include=contact&limit=1000000';
    if (form) {
      params += '&zip_from=' + form;
    }
    if (to) {
      params += '&zip_to=' + to;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AdministrationAction.loadSiteDataList({params}));
  }

  deploymentDetail(paramId: number) {
    const updateInvoiceValue = '?include=contact';
    this.store.dispatch(AdministrationAction.deployDetails({paramId, updateInvoiceValue}));
  }

  deploymentClientDetail(paramId: number) {
    const updateInvoiceValue = '?include=contacts,parent,children';
    this.store.dispatch(AdministrationAction.deployClientDetails({paramId, updateInvoiceValue}));
  }

  loadEditDeployData(paramsId: string) {
    const params = '/sites/' + paramsId + '?include=contact';
    this.store.dispatch(AdministrationAction.loadEditDeployData({params}));
  }

  deleteDeployInvoice(id: number | undefined) {
    this.store.dispatch(AdministrationAction.deleteRecord({ id }));
  }
  deleteFieldClient(id: number | undefined, cid: number | undefined) {
    this.store.dispatch(AdministrationAction.deleteFieldClient({ id, cid }));
  }
  updateDeploy(id: number , search: any) {
    this.store.dispatch(AdministrationAction.updateDeploy({ id , params: search }));
  }
  updateCDeploy(id: number , search: any) {
    this.store.dispatch(AdministrationAction.updateCDeploy({ id , params: search  }));
  }
  updateFieldClient(id: number , search: any) {
    this.store.dispatch(AdministrationAction.updateFieldClient({ id , params: search }));
  }
  add(data: any){
    this.store.dispatch(AdministrationAction.addDeploy({ params: data }));
  }
  addI(data: any) {
    this.store.dispatch(AdministrationAction.addInsurance({params: data}));
  }
  // addInsurance(data: any){
  //   this.store.dispatch(AdministrationAction.addNewInsurance({ params: data }));
  // }
  loadInsurance() {
    const params = '/health-insurances?limit=50&order_by=name&order_dir=asc';
    this.store.dispatch(AdministrationAction.loadInsuranceList({ params }));
  }

  loadUpdateInsuranceSearchList(updateValue: any) {
    // tslint:disable-next-line:variable-name
    const option = updateValue.to;
    const pageValue = updateValue.pageIndex;
    const searchValue = updateValue.search;
    let params = '/health-insurances?limit=50&order_by=name&order_dir=asc';
    if (option) {
      params += '&type=' + option;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AdministrationAction.loadInsuranceList({ params }));
  }

  loadInsuranceDownloadList(updateValue: any) {
    // tslint:disable-next-line:variable-name
    const option = updateValue.to;
    const pageValue = updateValue.pageIndex;
    const searchValue = updateValue.search;
    let params = '/health-insurances?limit=1000000&order_by=name&order_dir=asc';
    if (option) {
      params += '&type=' + option;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AdministrationAction.loadInsuranceDataList({ params }));
  }

  InsuranceDetail(paramId: number) {
    const updateInvoiceValue = '/health-insurances';
    this.store.dispatch(AdministrationAction.insuranceDetails({paramId, updateInvoiceValue}));
  }

  loadEditInsuranceData(paramsId: string) {
    const params = '/health-insurances/' + paramsId;
    this.store.dispatch(AdministrationAction.loadEditInsuranceData({params}));
  }

  updateInsurance(id: number, search: any) {
    this.store.dispatch(AdministrationAction.updateInsurance({id, params: search}));
  }

  // updateRights(name: any, search: any) {
  //   this.store.dispatch(AdministrationAction.UpdateRights({name, params: search}));
  // }



  deleteInsurance(id: number | undefined) {
    this.store.dispatch(AdministrationAction.deleteIRecord({id}));
  }

  loadIncentive() {
    const params = '/incentive-models?limit=50';
    this.store.dispatch(AdministrationAction.loadIncentiveList({params}));
  }
  loadUpdateIncentiveSearchList(updateValue: any) {
    // tslint:disable-next-line:variable-name
    const searchValue = updateValue.search;
    const pageValue = updateValue.pageIndex;
    let params = '/incentive-models?limit=50&page=1';
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AdministrationAction.loadIncentiveList({ params }));
  }
  IncentiveDetail(paramId: number) {
    const updateInvoiceValue = '/incentive-models';
    this.store.dispatch(AdministrationAction.incentiveDetails({ paramId, updateInvoiceValue }));
  }
  loadEditIncentiveData(paramsId: string) {
    const params = '/incentive-models/' + paramsId ;
    this.store.dispatch(AdministrationAction.loadEditIncentiveData({ params }));
  }
  updateIncentive(id: number , search: any) {
    this.store.dispatch(AdministrationAction.updateIncentive({ id , params: search }));
  }
  loadFramework() {
    const params = '/gtcs?include=documents,contract_type';
    this.store.dispatch(AdministrationAction.loadFrameworkAgreementList({ params }));
  }
  FrameworkDetail(paramId: number) {
    const updateInvoiceValue = '?include=documents.document,contract_type';
    this.store.dispatch(AdministrationAction.frameworkDetails({ paramId, updateInvoiceValue }));
  }
  updateFramework(id: number , search: any) {
    this.store.dispatch(AdministrationAction.updateFramework({id, params: search}));
  }

  loadRole() {
    const params = '/roles';
    this.store.dispatch(AdministrationAction.loadRolesList({params}));
  }

  loadRights() {
    const params = '/rights';
    this.store.dispatch(AdministrationAction.loadRights({params}));
  }

  loadfilterRight(updateValue: any) {
    const name = updateValue.agentName;
    const param = 'rights';
    this.store.dispatch(AdministrationAction.RightsSave({name}));
  }

  updateRights(value: any) {
    const name = value.agentName;
    const data = value.rightIdentifier;
    const param = 'rights'
    this.store.dispatch(AdministrationAction.UpdateRights({name, param, data}));
  }

  loadLogsList() {
    const params = '/eventlogs?limit=50&order_dir=desc&order_by=created_at';
    this.store.dispatch(AdministrationAction.loadLogsList({params}));
  }

  // loadLogsDataList() {
  //   const params = '/eventlogs?limit=1000000&order_dir=desc&order_by=created_at';
  //   this.store.dispatch(AdministrationAction.loadLogsDataList({ params }));
  // }
  loadAgentlist() {
    const params = '/agents?limit=100000&only_fields=agent.id,agent.lastname,agent.firstname,user.id';
    this.store.dispatch(AdministrationAction.loadAgentList({ params }));
  }
  loadUpdateLogSearchList(updateValue: any) {
    // tslint:disable-next-line:variable-name
    const agent = updateValue.agentName;
    const eventName = updateValue.eventNames;
    const searchValue = updateValue.search;
    const pageValue = updateValue.pageIndex;
    let params = '/eventlogs?limit=50&order_dir=desc&eventnames=FreelancerDeletedEvent&order_by=created_at';
    if (agent) {
      params += '&agent_id=' + agent;
    }
    if (eventName) {
      params += '&eventnames=' + eventName;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AdministrationAction.loadLogsList({ params }));
  }
  loadLogsDataList(updateValue: any) {
    // tslint:disable-next-line:variable-name
    const agent = updateValue.agentName;
    const eventName = updateValue.eventNames;
    const searchValue = updateValue.search;
    const pageValue = updateValue.pageIndex;
    let params = '/eventlogs?limit=1000000&page=1&order_dir=desc&order_by=created_at';
    if (agent) {
      params += '&agent_id=' + agent;
    }
    if (eventName) {
      params += '&eventnames=' + eventName;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AdministrationAction.loadLogsDataList({ params }));
  }


  loadMailLogList() {
    const params = '/maillogs?limit=50&page=1&order_by=sent_at&order_dir=asc';
    // @ts-ignore
    this.store.dispatch(AdministrationAction.loadMailLogList({ params }));
  }
  loadMailLogListUpdate(updateValue: any) {
    const client = updateValue?.client;
    const form = updateValue.from;
    const to = updateValue.to;
    const searchValue = updateValue.search;
    const pageValue = updateValue.pageIndex;
    let params = '/maillogs?limit=50&page=1&order_by=sent_at&order_dir=asc';
    if (client) {
      params += '&to_email=' + client;
    }
    if (form) {
      params += '&date_from=' + form;
    }
    if (to) {
      params += '&date_to=' + to;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    // @ts-ignore
    this.store.dispatch(AdministrationAction.loadMailLogList({ params }));

  }
  loadMailLogDataList(updateValue: any) {
    const client = updateValue?.client;
    const form = updateValue.from;
    const to = updateValue.to;
    const searchValue = updateValue.search;
    const pageValue = updateValue.pageIndex;
    let params = '/maillogs?limit=1000000&page=1&order_by=sent_at&order_dir=asc';
    if (client) {
      params += '&to_email=' + client;
    }
    if (form) {
      params += '&date_from=' + form;
    }
    if (to) {
      params += '&date_to=' + to;
    }
    if (searchValue) {
      params += '&search=' + searchValue;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    // @ts-ignore
    this.store.dispatch(AdministrationAction.loadMailLogsDataList({ params }));

  }

  addgtcs(data: any){
    this.store.dispatch(AdministrationAction.addgtcs({params: data}));
  }

  loadMailLogFreelancerlist() {
    const params = '/freelancers?limit=100000&include=user&only_fields=freelancer.lastname,freelancer.firstname,freelancer.zip,freelancer.city,user.email';
    this.store.dispatch(AdministrationAction.loadMailLogListFreelancer({params}));
  }

  loadClientList(paramsId: string) {
    const params = '/sites/' + paramsId + '/clients?include=client_site_contact,contacts';
    this.store.dispatch(AdministrationAction.loadClientList({params}));
  }

  loadClientSearchList(paramsId: string, updateValue: any) {
    const pageValue = updateValue.pageIndex;
    let params = '/sites/' + paramsId + '/clients?include=client_site_contact,contacts';
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(AdministrationAction.loadClientList({params}));
  }

  loadClientDownloadList() {
    const params = '/incentive-models?limit=1000000&page=1';
    this.store.dispatch(AdministrationAction.loadClientDownloadList({params}));
  }
}
