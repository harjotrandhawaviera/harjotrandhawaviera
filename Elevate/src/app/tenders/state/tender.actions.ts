import { PagedResult, PaginationVM } from './../../model/pagination.model';
import { TenderSearchVM, TenderVM } from '../../model/tender.model';

import { Action } from '@ngrx/store';
import { AssignmentVM } from '../../model/assignment.model';
import {OfferSearchVM, OfferVM} from '../../model/offer.model';


export enum TenderActionTypes {
  UpdateSearch = '[Tender] Update search',
  UpdateOfferSearch = '[Offer] Update Offer search',
  UpdateFreelancerOfferSearch = '[Offer] Update Freelancer Offer search',
  LoadTenderList = '[Tender] Load tender list',
  LoadTenderListSuccess = '[Tender] Load tender list success',
  LoadTenderListFailed = '[Tender] Load tender list failed',

  DeleteTender = '[Tender] Delete tender',
  DeleteTenderSuccess = '[Tender] Delete tender success',
  DeleteTenderFailed = '[Tender] Delete tender failed',

  LoadTenderDetail = '[Tender] Load tender detail',
  LoadTenderDetailWithLogs = '[Tender] Load tender detail with logs',
  LoadTenderDetailSuccess = '[Tender] Load tender detail success',
  LoadTenderDetailFailed = '[Tender] Load tender detail failed',

  LoadAssignmentDetail = '[Tender] Load assignment detail',
  LoadAssignmentDetailSuccess = '[Tender] Load assignment detail success',
  LoadAssignmentDetailFailed = '[Tender] Load assignment detail failed',

  CreateTenders = '[Tender] create tender',
  CreateTendersSuccess = '[Tender] create tender success',
  CreateTendersFailed = '[Tender] create tender failed',

  LoadOffer = '[Tender] Load Offer',
  LoadOfferSuccess = '[Tender] Load Offer success',

  LoadFreelancerOffer = '[Tender] Load Freelancer Offer',
  LoadFreelancerOfferSuccess = '[Tender] Load Freelancer Offer success',

  LoadFreelancerOfferDetail = '[Tender] Load Freelancer Offer Detail',
  LoadFreelancerOfferDetailSuccess = '[Tender] Load Freelancer Offer Detail Success',

  LoadAdminOfferDetail = '[Tender] Load Admin Offer Detail',
  LoadAdminOfferDetailSuccess = '[Tender] Load Admin Offer Detail Success',

  LoadAdminOfferRejectDetail = '[Tender] Load Admin Offer Reject Detail',
  LoadAdminOfferRejectDetailSuccess = '[Tender] Load Admin Offer Reject Detail Success',

  LoadAdminFreelancer = '[Tender] Load Admin Freelancer ',
  LoadAdminFreelancerSuccess = '[Tender] Load  Admin Freelancer success',

  CreateShortlist = '[Tender] Create Shortlist ',
  CreateShortlistSuccess = '[Tender] Create  Shortlist  success',
  ClearSearchResult = '[Tender] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = TenderActionTypes.UpdateSearch;
  constructor(public payload: TenderSearchVM) {}
}

export class UpdateOfferSearch implements Action {
  readonly type = TenderActionTypes.UpdateOfferSearch;
  constructor(public payload: OfferSearchVM) {}
}

export class UpdateFreelancerOfferSearch implements Action {
  readonly type = TenderActionTypes.UpdateFreelancerOfferSearch;
  constructor(public payload: OfferSearchVM) {}
}

export class LoadTenderList implements Action {
  readonly type = TenderActionTypes.LoadTenderList;
  constructor(public payload: { search: TenderSearchVM; }) {}
}
export class LoadTenderListSuccess implements Action {
  readonly type = TenderActionTypes.LoadTenderListSuccess;
  constructor(public payload: PagedResult<TenderVM>) {}
}
export class LoadTenderListFailed implements Action {
  readonly type = TenderActionTypes.LoadTenderListFailed;
  constructor(public payload: any) {}
}
export class ClearSearchResult implements Action {
  readonly type = TenderActionTypes.ClearSearchResult;
  constructor() {}
}

export class DeleteTender implements Action {
  readonly type = TenderActionTypes.DeleteTender;
  constructor(public payload: { id: string; role_id: string | null | undefined;}) {}
}
export class DeleteTenderSuccess implements Action {
  readonly type = TenderActionTypes.DeleteTenderSuccess;
  constructor(public payload: any) {}
}
export class DeleteTenderFailed implements Action {
  readonly type = TenderActionTypes.DeleteTenderFailed;
  constructor(public payload: any) {}
}

export class LoadTenderDetail implements Action {
  readonly type = TenderActionTypes.LoadTenderDetail;
  constructor(public payload: { id: string; role_id: string | null; mode: string }) {}
}
export class LoadTenderDetailSuccess implements Action {
  readonly type = TenderActionTypes.LoadTenderDetailSuccess;
  constructor(public payload: TenderVM) {}
}
export class LoadTenderDetailFailed implements Action {
  readonly type = TenderActionTypes.LoadTenderDetailFailed;
  constructor(public payload: any) {}
}

export class LoadTenderDetailWithLogs implements Action {
  readonly type = TenderActionTypes.LoadTenderDetailWithLogs;
  constructor(public payload: { id: string; mode: string }) {}
}

export class LoadAssignmentDetail implements Action {
  readonly type = TenderActionTypes.LoadAssignmentDetail;
  constructor(public payload: string) {}
}
export class LoadAssignmentDetailSuccess implements Action {
  readonly type = TenderActionTypes.LoadAssignmentDetailSuccess;
  constructor(public payload: AssignmentVM) {}
}
export class LoadAssignmentDetailFailed implements Action {
  readonly type = TenderActionTypes.LoadAssignmentDetailFailed;
  constructor(public payload: any) {}
}

export class CreateTenders implements Action {
  readonly type = TenderActionTypes.CreateTenders;
  constructor(public payload: { tender: any }) {}
}
export class CreateTendersSuccess implements Action {
  readonly type = TenderActionTypes.CreateTendersSuccess;
  constructor(public payload: {id: number}) {}
}
export class CreateTendersFailed implements Action {
  readonly type = TenderActionTypes.CreateTendersFailed;
  constructor(public payload: {}) {}
}

export class LoadOffer implements Action {
  readonly type = TenderActionTypes.LoadOffer;
  constructor(public payload: { search: TenderSearchVM; }) {}
}
export class LoadOfferSuccess implements Action {
  readonly type = TenderActionTypes.LoadOfferSuccess;
  constructor(public payload: any) {}
}

export class LoadFreelancerOfferTM implements Action {
  readonly type = TenderActionTypes.LoadFreelancerOffer;
  constructor(public payload: { search: TenderSearchVM; }) {}
}
export class LoadFreelancerTMOfferSuccess implements Action {
  readonly type = TenderActionTypes.LoadFreelancerOfferSuccess;
  constructor(public payload: any) {}
}
export class LoadFreelancerOfferDetail implements Action {
  readonly type = TenderActionTypes.LoadFreelancerOfferDetail;
  constructor(public payload: { id: string; }) {}
}
export class LoadFreelancerOfferDetailSuccess implements Action {
  readonly type = TenderActionTypes.LoadFreelancerOfferDetailSuccess;
  constructor(public id: any) {}
}
export class LoadAdminOfferDetail implements Action {
  readonly type = TenderActionTypes.LoadAdminOfferDetail;
  constructor(public payload: { fid: number, data: any }) {}
}
export class LoadAdminOfferDetailSuccess implements Action {
  readonly type = TenderActionTypes.LoadAdminOfferDetailSuccess;
  constructor(public data: any) {}
}
export class LoadAdminOfferRejectDetail implements Action {
  readonly type = TenderActionTypes.LoadAdminOfferRejectDetail;
  constructor(public payload: { id: number}) {}
}
export class LoadAdminOfferRejectDetailSuccess implements Action {
  readonly type = TenderActionTypes.LoadAdminOfferRejectDetailSuccess;
  constructor(public data: any) {}
}
export class LoadAdminFreelancer implements Action {
  readonly type = TenderActionTypes.LoadAdminFreelancer;
  constructor(public payload: { fid: number }) {}
}
export class LoadAdminFreelancerSuccess implements Action {
  readonly type = TenderActionTypes.LoadAdminFreelancerSuccess;
  constructor(public fid: any) {}
}
export class CreateShortlist implements Action {
  readonly type = TenderActionTypes.CreateShortlist;
  constructor(public payload: { data: any }) {}
}
export class CreateShortlistSuccess implements Action {
  readonly type = TenderActionTypes.CreateShortlistSuccess;
  constructor(public data: any) {}
}

export type TenderActions =
  | UpdateSearch
  | UpdateOfferSearch
  | UpdateFreelancerOfferSearch
  | LoadTenderList
  | LoadTenderListSuccess
  | LoadTenderListFailed
  | ClearSearchResult
  | DeleteTender
  | DeleteTenderSuccess
  | DeleteTenderFailed
  | LoadTenderDetail
  | LoadTenderDetailWithLogs
  | LoadTenderDetailSuccess
  | LoadTenderDetailFailed
  | LoadAssignmentDetail
  | LoadAssignmentDetailSuccess
  | LoadAssignmentDetailFailed
  | CreateTenders
  | CreateTendersSuccess
  | CreateTendersFailed
  | LoadOffer
  | LoadOfferSuccess
  | LoadFreelancerOfferTM
  | LoadFreelancerTMOfferSuccess
  | LoadFreelancerOfferDetail
  | LoadFreelancerOfferDetailSuccess
  | LoadAdminOfferDetail
  | LoadAdminOfferDetailSuccess
  | LoadAdminOfferRejectDetail
  | LoadAdminOfferRejectDetailSuccess
  | LoadAdminFreelancer
  | LoadAdminFreelancerSuccess
  | CreateShortlist
  | CreateShortlistSuccess;
