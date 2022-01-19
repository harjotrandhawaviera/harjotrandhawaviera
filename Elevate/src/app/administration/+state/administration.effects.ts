import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {map, mergeMap} from 'rxjs/operators';
import {AdministrationList} from '../model/administartionList';
import {AdministrationServices} from '../../services/administartion.services';
import {AdministrationAction} from '../+state/administration.actions';

@Injectable()
export class AdministrationEffects {
  loadDeployment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.customerList),
      mergeMap(({params}) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadCustomerListSuccess({lists}))
    )
  );

  loadCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadDeploymentList),
      mergeMap(({ params }) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadDeploymentListSuccess({ lists }))
    )
  );


  loadAdministrationSearchList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadAdministrationSearchList),
      mergeMap(({ params }) => this.administrationSvc.administrationUsers(params)),
      map((lists: any) => AdministrationAction.loadAdministrationSearchListSuccess({ lists }))
    )
  );

  deployDetailsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.deployDetails),
      mergeMap(({ paramId, updateInvoiceValue }) => this.administrationSvc.deployDetails( paramId, updateInvoiceValue )),
      map((lists: any) => AdministrationAction.  deployDetailsSuccess({ lists }))
    )
  );

  deployClientDetailsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.deployClientDetails),
      mergeMap(({ paramId, updateInvoiceValue }) => this.administrationSvc.deployClientDetails( paramId, updateInvoiceValue )),
      map((lists: any) => AdministrationAction.  deployClientDetailsSuccess({ lists }))
    )
  );

  editDeployData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadEditDeployData),
      mergeMap(({ params }) => this.administrationSvc.deployment(params)),
      map((lists: any) => AdministrationAction.loadEditDeployDataSuccess({ lists }))
    )
  );

  deleteDeploy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.deleteRecord),
      mergeMap(({ id }) => this.administrationSvc.deletedeploy(id)),
      map((id: any) => AdministrationAction.deleteRecordSuccess({ id }))
    )
  );

  exportList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.exportList),
      mergeMap(({params}) => this.administrationSvc.deployment(params)),
      map((lists: any) => AdministrationAction.exportListSuccess({ lists }))
    )
  );

  addDeploy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.addDeploy),
      mergeMap(( { params }) => this.administrationSvc.addDeploy(params)),
      map((lists: any) => AdministrationAction.addDeploySuccess({ lists }))
    )
  );


  addInsurance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.addInsurance),
      mergeMap(({params}) => this.administrationSvc.addInsurance(params)),
      map((lists: any) => AdministrationAction.addInsuranceSuccess({lists}))
    )
  );
  addNewInsurance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.addNewInsurance),
      mergeMap(( { params }) => this.administrationSvc.addNewInsurance(params)),
      map((lists: any) => AdministrationAction.addNewInsuranceSuccess({ lists }))
    )
  );


  updateDeployEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.updateDeploy),
      mergeMap(({ id , params }) => this.administrationSvc.updatedeploySvc(id, params)),
      map((lists: any) => AdministrationAction.updateDeploySuccess({ lists }))
    )
  );

  updateCDeployEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.updateCDeploy),
      mergeMap(({ id , params }) => this.administrationSvc.updateCdeploySvc(id, params)),
      map((lists: any) => AdministrationAction.updateCDeploySuccess({ lists }))
    )
  );

  updateFieldClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.updateFieldClient),
      mergeMap(({ id , params }) => this.administrationSvc.updateFieldClient(id, params)),
      map((lists: any) => AdministrationAction.updateFieldClientSuccess({ lists }))
    )
  );

  loadInsurance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadInsuranceList),
      mergeMap(({ params }) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadInsuranceSuccess({ lists }))
    )
  );

  deleteInsurance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.deleteIRecord),
      mergeMap(({ id }) => this.administrationSvc.deleteinsurance(id)),
      map((id: any) => AdministrationAction.deleteIRecordSuccess({ id }))
    )
  );

  InsuranceDetailsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.insuranceDetails),
      mergeMap(({ paramId, updateInvoiceValue }) => this.administrationSvc.InsuranceDetails( paramId, updateInvoiceValue )),
      map((lists: any) => AdministrationAction.  insuranceDetailsSuccess({ lists }))
    )
  );

  editInsuranceData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadEditInsuranceData),
      mergeMap(({ params }) => this.administrationSvc.deployment(params)),
      map((lists: any) => AdministrationAction.loadEditInsuranceDataSuccess({ lists }))
    )
  );

  updateInsuranceEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.updateInsurance),
      mergeMap(({ id , params }) => this.administrationSvc.updateInsuranceSvc(id, params)),
      map((lists: any) => AdministrationAction.updateInsuranceSuccess({ lists }))
    )
  );



  // updateRights$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AdministrationAction.UpdateRights),
  //     mergeMap(({name, params}) => this.administrationSvc.Right(name, params)),
  //     map((lists: any) => AdministrationAction.UpdateRightsSuccess({lists}))
  //   )
  // );


  loadIncentive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadIncentiveList),
      mergeMap(({params}) => this.administrationSvc.Incentive(params)),
      map((lists: any) => AdministrationAction.loadIncentiveListSuccess({lists}))
    )
  );

  IncentiveDetailsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.incentiveDetails),
      mergeMap(({ paramId, updateInvoiceValue }) => this.administrationSvc.InsuranceDetails( paramId, updateInvoiceValue )),
      map((lists: any) => AdministrationAction.  incentiveDetailsSuccess({ lists }))
    )
  );

  editIncentiveData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadEditIncentiveData),
      mergeMap(({ params }) => this.administrationSvc.deployment(params)),
      map((lists: any) => AdministrationAction.loadEditIncentiveDataSuccess({ lists }))
    )
  );

  updateIncentiveEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.updateIncentive),
      mergeMap(({ id , params }) => this.administrationSvc.updateIncentiveSvc(id, params)),
      map((lists: any) => AdministrationAction.updateIncentiveSuccess({ lists }))
    )
  );

  loadFrameworkAgreement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadFrameworkAgreementList),
      mergeMap(({ params }) => this.administrationSvc.FrameworkAgreement(params)),
      map((lists: any) => AdministrationAction.loadFrameworkAgreementListSuccess({ lists }))
    )
  );

  frameworkDetailsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.frameworkDetails),
      mergeMap(({ paramId, updateInvoiceValue }) => this.administrationSvc.FrameworkDetails( paramId, updateInvoiceValue )),
      map((lists: any) => AdministrationAction.  frameworkDetailsSuccess({ lists }))
    )
  );

  updateFrameworkEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.updateFramework),
      mergeMap(({ id , params }) => this.administrationSvc.updateFrameworkSvc(id, params)),
      map((lists: any) => AdministrationAction.updateFrameworkSuccess({ lists }))
    )
  );

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadRolesList),
      mergeMap(({ params }) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadRolesSuccess({ lists }))
    )
  );

  loadRights$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadRights),
      mergeMap(({ params }) => this.administrationSvc.loadRights(params)),
      map((lists: any) => AdministrationAction.loadRightsSuccess({ lists }))
    )
  );

  loadRightSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.RightsSave),
      mergeMap(({ name }) => this.administrationSvc.Right(name)),
      map((lists: any) => AdministrationAction.RightsSaveSuccess({ lists }))
    )
  );

  loadUpdateRights$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.UpdateRights),
      mergeMap(({ name , param, data }) => this.administrationSvc.updateRights(name , param, data)),
      map((lists: any) => AdministrationAction.UpdateRightsSuccess({ lists }))
    )
  );

  loadLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadLogsList),
      mergeMap(({ params }) => this.administrationSvc.LogsList(params)),
      map((lists: any) => AdministrationAction.loadLogsListSuccess({ lists }))
    )
  );

  loadLogsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadLogsDataList),
      mergeMap(({ params }) => this.administrationSvc.LogsDataList(params)),
      map((lists: any) => AdministrationAction.loadLogsDataListSuccess({ lists }))
    )
  );

  loadMailLogsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadMailLogsDataList),
      mergeMap(({ params }) => this.administrationSvc.MailLogsDataList(params)),
      map((lists: any) => AdministrationAction.loadMailLogsDataListSuccess({ lists }))
    )
  );

  loadAgent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadAgentList),
      mergeMap(({ params }) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadAgentListSuccess({ lists }))
    )
  );


  loadMailLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadMailLogList),
      mergeMap(({params}) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadMailLogListSuccess({ lists }))
    )
  );

  addGtcs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.addgtcs),
      mergeMap(( { params }) => this.administrationSvc.addgtcs(params)),
      map((lists: any) => AdministrationAction.addgtcsSuccess({ lists }))
    )
  );

  loadMailLogFreelancer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadMailLogListFreelancer),
      mergeMap(({params}) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadMailLogListFreelancerSuccess({ lists }))
    )
  );

  loadClientList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadClientList),
      mergeMap(({params}) => this.administrationSvc.ClientList(params)),
      map((lists: any) => AdministrationAction.loadClientListSuccess({lists}))
    )
  );

  loadSitesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadSiteDataList),
      mergeMap(({params}) => this.administrationSvc.SiteDataList(params)),
      map((lists: any) => AdministrationAction.loadSiteDataListSuccess({lists}))
    )
  );

  deleteFieldClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.deleteFieldClient),
      mergeMap(({ id, cid }) => this.administrationSvc.deleteFieldClient(id, cid)),
      map((id: any, cid: any) => AdministrationAction.deleteFieldClientSuccess({ id, cid }))
    )
  );

  loadInsuranceData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadInsuranceDataList),
      mergeMap(({params}) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadInsuranceDataListSuccess({ lists }))
    )
  );

  loadClientDownloadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationAction.loadClientDownloadList),
      mergeMap(({params}) => this.administrationSvc.deployment(params)),
      map((lists: AdministrationList) => AdministrationAction.loadClientDownloadListSuccess({ lists }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private http: HttpClient,
    private administrationSvc: AdministrationServices
  ) {
  }
}
