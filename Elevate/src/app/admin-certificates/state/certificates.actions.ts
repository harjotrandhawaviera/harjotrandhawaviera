import {
  CertificateSearchVM,
  CertificateVM,
} from './../../model/certificate.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';

export enum CertificateActionTypes {
  UpdateSearch = '[Admin Certificate] Update search',
  LoadCertificateList = '[Admin Certificate] Load Certificate list',
  LoadCertificateListSuccess = '[Admin Certificate] Search success',
  LoadCertificateListFailed = '[Admin Certificate] Search failed',

  LoadCertificateDetail = '[Admin Certificate] Load Certificate Detail',
  LoadCertificateDetailSuccess = '[Admin Certificate] Certificate Detail success',
  LoadCertificateDetailFailed = '[Admin Certificate] Certificate Detail failed',

  DeleteCertificate = '[Admin Certificate] Delete Certificate',
  DeleteCertificateSuccess = '[Admin Certificate] Delete success',
  DeleteCertificateFailed = '[Admin Certificate] Delete failed',

  ToggleRecommendationCertificate = '[Admin Certificate] Toggle Recommendation Certificate',
  ToggleRecommendationCertificateSuccess = '[Admin Certificate] Toggle Recommendation success',
  ToggleRecommendationCertificateFailed = '[Admin Certificate] Toggle Recommendation failed',

  ToggleEnabledCertificate = '[Admin Certificate] Toggle Enabled Certificate',
  ToggleEnabledCertificateSuccess = '[Admin Certificate] Toggle Enabled success',
  ToggleEnabledCertificateFailed = '[Admin Certificate] Toggle Enabled failed',

  ClearCertificate = '[Admin Certificate] Clear Certificate',
  ClearSearchResult = '[Admin Certificate] Clear search result',
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

export class ToggleRecommendationCertificate implements Action {
  readonly type = CertificateActionTypes.ToggleRecommendationCertificate;
  constructor(public payload: {id: number, is_recommended: boolean}) { }
}
export class ToggleRecommendationCertificateSuccess implements Action {
  readonly type = CertificateActionTypes.ToggleRecommendationCertificateSuccess;
  constructor(public payload: {id?: number, is_recommended?: boolean, state?: string}) { }
}
export class ToggleRecommendationCertificateFailed implements Action {
  readonly type = CertificateActionTypes.ToggleRecommendationCertificateFailed;
  constructor(public payload: any) { }
}

export class ToggleEnabledCertificate implements Action {
  readonly type = CertificateActionTypes.ToggleEnabledCertificate;
  constructor(public payload: {id: number, is_enabled: boolean}) { }
}
export class ToggleEnabledCertificateSuccess implements Action {
  readonly type = CertificateActionTypes.ToggleEnabledCertificateSuccess;
  constructor(public payload: {id?: number, is_enabled?: boolean, state?: string}) { }
}
export class ToggleEnabledCertificateFailed implements Action {
  readonly type = CertificateActionTypes.ToggleEnabledCertificateFailed;
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
  | ClearSearchResult
  | ToggleEnabledCertificate
  | ToggleEnabledCertificateSuccess
  | ToggleEnabledCertificateFailed

  | ToggleRecommendationCertificate
  | ToggleRecommendationCertificateSuccess
  | ToggleRecommendationCertificateFailed;
