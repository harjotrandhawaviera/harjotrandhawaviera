import {
  CertificateSearchVM,
  CertificateVM,
} from './../../model/certificate.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';

export enum CertificateActionTypes {
  UpdateSearch = '[Certificate] Update search',
  LoadCertificateList = '[Certificate] Load Certificate list',
  LoadCertificateListSuccess = '[Certificate] Search success',
  LoadCertificateListFailed = '[Certificate] Search failed',

  LoadCertificateDetail = '[Certificate] Load Certificate Detail',
  LoadCertificateDetailSuccess = '[Certificate] Certificate Detail success',
  LoadCertificateDetailFailed = '[Certificate] Certificate Detail failed',

  DeleteCertificate = '[Certificate] Delete Certificate',
  DeleteCertificateSuccess = '[Certificate] Delete success',
  DeleteCertificateFailed = '[Certificate] Delete failed',

  ClearCertificate = '[Certificate] Clear Certificate',
  ClearSearchResult = '[Certificate] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = CertificateActionTypes.UpdateSearch;
  constructor(public payload: CertificateSearchVM) {}
}

export class LoadCertificateList implements Action {
  readonly type = CertificateActionTypes.LoadCertificateList;
  constructor(public payload: CertificateSearchVM) {}
}
export class LoadCertificateListSuccess implements Action {
  readonly type = CertificateActionTypes.LoadCertificateListSuccess;
  constructor(public payload: PagedResult<CertificateVM>) {}
}
export class LoadCertificateListFailed implements Action {
  readonly type = CertificateActionTypes.LoadCertificateListFailed;
  constructor(public payload: any) {}
}

export class ClearSearchResult implements Action {
  readonly type = CertificateActionTypes.ClearSearchResult;
  constructor() {}
}

export class ClearCertificate implements Action {
  readonly type = CertificateActionTypes.ClearCertificate;
  constructor() {}
}

export class DeleteCertificate implements Action {
  readonly type = CertificateActionTypes.DeleteCertificate;
  constructor(public payload: number) { }
}
export class DeleteCertificateFailed implements Action {
  readonly type = CertificateActionTypes.DeleteCertificateFailed;
  constructor(public payload: any) { }
}

export type CertificateActions =
  | UpdateSearch
  // load certificate list
  | LoadCertificateList
  | LoadCertificateListSuccess
  | LoadCertificateListFailed
  // delete certificate
  | DeleteCertificate
  | DeleteCertificateFailed
  // clear certificate detail
  | ClearCertificate
  // clear certificate list
  | ClearSearchResult;
