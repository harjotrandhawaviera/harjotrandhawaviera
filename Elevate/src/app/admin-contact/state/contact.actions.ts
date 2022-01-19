import { PaginationVM, PagedResult } from './../../model/pagination.model';
import { Action } from "@ngrx/store";
import { ContactSearchVM, ContactVM } from "./../../model/contact.model";

export enum ContactActionTypes {
  UpdateSearch = '[Contact] Update search',
  LoadContactList = '[Contact] Load Contact list',
  LoadContactListSuccess = '[Contact] Search success',
  LoadContactListFailed = '[Contact] Search failed',

  ClearContact = '[Contact] Clear client',
  ClearSearchResult = '[Contact] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = ContactActionTypes.UpdateSearch;
  constructor(public payload: ContactSearchVM) { }
}


export class LoadContactList implements Action {
  readonly type = ContactActionTypes.LoadContactList;
  constructor(public payload: ContactSearchVM) { }
}
export class LoadContactListSuccess implements Action {
  readonly type = ContactActionTypes.LoadContactListSuccess;
  constructor(public payload: PagedResult<ContactVM>) { }
}
export class LoadContactListFailed implements Action {
  readonly type = ContactActionTypes.LoadContactListFailed;
  constructor(public payload: any) { }
}




export class ClearSearchResult implements Action {
  readonly type = ContactActionTypes.ClearSearchResult;
  constructor() { }
}

export class ClearContact implements Action {
  readonly type = ContactActionTypes.ClearContact;
  constructor() { }
}

export type ContactActions = UpdateSearch
  | LoadContactList
  | LoadContactListSuccess
  | LoadContactListFailed


  | ClearContact
  | ClearSearchResult;
