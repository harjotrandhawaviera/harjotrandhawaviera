import {
  FreelancerSearchVM,
  FreelancerVM,
} from './../../model/freelancer.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';

export enum FreelancerActionTypes {
  UpdateSearch = '[Freelancer] Update search',
  LoadFreelancerList = '[Freelancer] Load Freelancer list',
  LoadFreelancerListSuccess = '[Freelancer] Search success',
  LoadFreelancerListFailed = '[Freelancer] Search failed',

  LoadFreelancerDetail = '[Freelancer] Load Freelancer Detail',
  LoadFreelancerDetailSuccess = '[Freelancer] Freelancer Detail success',
  LoadFreelancerDetailFailed = '[Freelancer] Freelancer Detail failed',

  // CreateFreelancer = '[Freelancer] Create Freelancer',
  // CreateFreelancerSuccess = '[Freelancer] Create Freelancer success',
  // CreateFreelancerFailed = '[Freelancer] Create Freelancer failed',

  // UpdateFreelancer = '[Freelancer] Update Freelancer',
  // UpdateFreelancerSuccess = '[Freelancer] Update Freelancer success',
  // UpdateFreelancerFailed = '[Freelancer] Update Freelancer failed',

  DeleteFreelancer = '[Freelancer] Delete Freelancer',
  DeleteFreelancerSuccess = '[Freelancer] Delete success',
  DeleteFreelancerFailed = '[Freelancer] Delete failed',

  ClearFreelancer = '[Freelancer] Clear Freelancer',
  ClearSearchResult = '[Freelancer] Clear search result',

  LoadUserList = '[Freelancer] Load User list',
  LoadUserListSuccess = '[Freelancer] Load User list success',
}
export class UpdateSearch implements Action {
  readonly type = FreelancerActionTypes.UpdateSearch;
  constructor(public payload: FreelancerSearchVM) {}
}

export class LoadFreelancerList implements Action {
  readonly type = FreelancerActionTypes.LoadFreelancerList;
  constructor(public payload: FreelancerSearchVM) {}
}
export class LoadFreelancerListSuccess implements Action {
  readonly type = FreelancerActionTypes.LoadFreelancerListSuccess;
  constructor(public payload: PagedResult<FreelancerVM>) {}
}
export class LoadFreelancerListFailed implements Action {
  readonly type = FreelancerActionTypes.LoadFreelancerListFailed;
  constructor(public payload: any) {}
}

// export class NewFreelancerDetail implements Action {
//   readonly type = FreelancerActionTypes.NewFreelancerDetail;
//   constructor() {}
// }
// export class LoadFreelancerDetail implements Action {
//   readonly type = FreelancerActionTypes.LoadFreelancerDetail;
//   constructor(public payload: { id: string; mode: string }) {}
// }
// export class LoadFreelancerDetailSuccess implements Action {
//   readonly type = FreelancerActionTypes.LoadFreelancerDetailSuccess;
//   constructor(public payload: { freelancer: FreelancerVM; mode: string }) {}
// }
// export class LoadFreelancerDetailFailed implements Action {
//   readonly type = FreelancerActionTypes.LoadFreelancerDetailFailed;
//   constructor(public payload: any) {}
// }

// export class UpdateFreelancer implements Action {
//   readonly type = FreelancerActionTypes.UpdateFreelancer;
//   constructor(
//     public payload: {
//       freelancer: FreelancerVM;
//       newDocuments: FreelancerDocumentVM[];
//       updatedDocuments: FreelancerDocumentVM[];
//       deletedDocuments: number[];
//     }
//   ) {}
// }
// export class UpdateFreelancerSuccess implements Action {
//   readonly type = FreelancerActionTypes.UpdateFreelancerSuccess;
//   constructor(public payload: { id: number }) {}
// }
// export class UpdateFreelancerFailed implements Action {
//   readonly type = FreelancerActionTypes.UpdateFreelancerFailed;
//   constructor(public payload: any) {}
// }

// export class CreateFreelancer implements Action {
//   readonly type = FreelancerActionTypes.CreateFreelancer;
//   constructor(
//     public payload: { freelancer: FreelancerVM; newDocuments: FreelancerDocumentVM[] }
//   ) {}
// }
// export class CreateFreelancerSuccess implements Action {
//   readonly type = FreelancerActionTypes.CreateFreelancerSuccess;
//   constructor(public payload: { id: number }) {}
// }
// export class CreateFreelancerFailed implements Action {
//   readonly type = FreelancerActionTypes.CreateFreelancerFailed;
//   constructor(public payload: { id: number }) {}
// }

export class ClearSearchResult implements Action {
  readonly type = FreelancerActionTypes.ClearSearchResult;
  constructor() {}
}

export class ClearFreelancer implements Action {
  readonly type = FreelancerActionTypes.ClearFreelancer;
  constructor() {}
}

export class DeleteFreelancer implements Action {
  readonly type = FreelancerActionTypes.DeleteFreelancer;
  constructor(public payload: number) { }
}
export class DeleteFreelancerFailed implements Action {
  readonly type = FreelancerActionTypes.DeleteFreelancerFailed;
  constructor(public payload: any) { }
}

export class LoadUserList implements Action {
  readonly type = FreelancerActionTypes.LoadUserList;
  constructor(public payload?: any) {}
}
export class LoadUserListSuccess implements Action {
  readonly type = FreelancerActionTypes.LoadUserListSuccess;
  constructor(public payload: any) {}
}

export type FreelancerActions =
  | UpdateSearch
  // load freelancer list
  | LoadFreelancerList
  | LoadFreelancerListSuccess
  | LoadFreelancerListFailed
  // create freelancer
  // | CreateFreelancer
  // | CreateFreelancerSuccess
  // | CreateFreelancerFailed
  // updated freelancer
  // | UpdateFreelancer
  // | UpdateFreelancerSuccess
  // | UpdateFreelancerFailed
  // new freelancer init
  // | NewFreelancerDetail
  // load freelancer detail
  // | LoadFreelancerDetail
  // | LoadFreelancerDetailSuccess
  // | LoadFreelancerDetailFailed
  // delete freelancer
  | DeleteFreelancer
  | DeleteFreelancerFailed
  | LoadUserList
  | LoadUserListSuccess
  // clear freelancer detail
  | ClearFreelancer
  // clear freelancer list
  | ClearSearchResult;
