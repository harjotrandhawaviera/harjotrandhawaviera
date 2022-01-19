import { PaginationVM, PagedResult } from './../../model/pagination.model';
import { Action } from "@ngrx/store";
import { ClientSearchVM, ClientVM } from "../../model/client.model";
import { ContactVM } from "./../../model/contact.model";

export enum ClientActionTypes {
  UpdateSearch = '[Client] Update search',
  LoadClientList = '[Client] Load client list',
  LoadClientListSuccess = '[Client] Search success',
  LoadClientListFailed = '[Client] Search failed',


  NewClientDetail = '[Client] New Client Detail',
  LoadClientDetail = '[Client] Load Client Detail',
  LoadClientDetailSuccess = '[Client] Client Detail success',
  LoadClientDetailFailed = '[Client] Client Detail failed',

  LoadClientContacts = '[Client] Load Client Contacts',
  LoadClientContactsSuccess = '[Client] Client Contacts success',
  LoadClientContactsFailed = '[Client] Client Contacts failed',

  LoadContactDetail = '[Client] Load Contact Detail',
  NewContactDetail = '[Client] New Contact Detail',
  ClearContactDetail = '[Client] Clear Contact Detail',

  DeleteContact = '[Client] Delete contact',
  DeleteContactFailed = '[Client] Delete contact failed',

  UpdateContact = '[Client] Update contact',
  UpdateContactFailed = '[Client] Update contact failed',

  UpdateClient = '[Client] Update client',
  UpdateClientSuccess = '[Client] Update client success',
  UpdateClientFailed = '[Client] Update client failed',

  CreateClient = '[Client] Create client',
  CreateClientSuccess = '[Client] Create client success',
  CreateClientFailed = '[Client] Create client failed',

  CreateContact = '[Client] Create contact',
  CreateContactFailed = '[Client] Create contact failed',

  DeleteClient = '[Client] Delete client',
  DeleteClientSuccess = '[Client] Delete success',
  DeleteClientFailed = '[Client] Delete failed',

  ClearClient = '[Client] Clear client',
  ClearSearchResult = '[Client] Clear search result',
  ClearMessages = '[Client] Clear messages',

  newClientData = '[Client] new client',
  newClientDataSuccess = '[Client] new client success',
}
export class UpdateSearch implements Action {
  readonly type = ClientActionTypes.UpdateSearch;
  constructor(public payload: ClientSearchVM) { }
}

export class DeleteClient implements Action {
  readonly type = ClientActionTypes.DeleteClient;
  constructor(public payload: string) { }
}
export class DeleteClientFailed implements Action {
  readonly type = ClientActionTypes.DeleteClientFailed;
  constructor(public payload: any) { }
}

export class DeleteContact implements Action {
  readonly type = ClientActionTypes.DeleteContact;
  constructor(public payload: { id: string, clientId: string }) { }
}
export class DeleteContactFailed implements Action {
  readonly type = ClientActionTypes.DeleteContactFailed;
  constructor(public payload: any) { }
}

export class CreateContact implements Action {
  readonly type = ClientActionTypes.CreateContact;
  constructor(public payload: { clientId: string, contact: ContactVM }) { }
}
export class CreateContactFailed implements Action {
  readonly type = ClientActionTypes.CreateContactFailed;
  constructor(public payload: any) { }
}

export class UpdateContact implements Action {
  readonly type = ClientActionTypes.UpdateContact;
  constructor(public payload: { id: string, clientId: string, contact: ContactVM }) { }
}
export class UpdateContactFailed implements Action {
  readonly type = ClientActionTypes.UpdateContactFailed;
  constructor(public payload: any) { }
}

export class LoadClientList implements Action {
  readonly type = ClientActionTypes.LoadClientList;
  constructor(public payload: ClientSearchVM) { }
}
export class LoadClientListSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientListSuccess;
  constructor(public payload: PagedResult<ClientVM>) { }
}
export class LoadClientListFailed implements Action {
  readonly type = ClientActionTypes.LoadClientListFailed;
  constructor(public payload: any) { }
}


export class LoadClientContacts implements Action {
  readonly type = ClientActionTypes.LoadClientContacts;
  constructor(public payload: string) { }
}
export class LoadClientContactsSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientContactsSuccess;
  constructor(public payload: ContactVM[]) { }
}
export class LoadClientContactsFailed implements Action {
  readonly type = ClientActionTypes.LoadClientContactsFailed;
  constructor(public payload: any) { }
}

export class LoadContactDetail implements Action {
  readonly type = ClientActionTypes.LoadContactDetail;
  constructor(public payload: string) { }
}

export class NewContactDetail implements Action {
  readonly type = ClientActionTypes.NewContactDetail;
  constructor() { }
}

export class ClearContactDetail implements Action {
  readonly type = ClientActionTypes.ClearContactDetail;
  constructor() { }
}

export class NewClientDetail implements Action {
  readonly type = ClientActionTypes.NewClientDetail;
  constructor() { }
}
export class LoadClientDetail implements Action {
  readonly type = ClientActionTypes.LoadClientDetail;
  constructor(public payload: string) { }
}
export class LoadClientDetailSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientDetailSuccess;
  constructor(public payload: ClientVM) { }
}
export class LoadClientDetailFailed implements Action {
  readonly type = ClientActionTypes.LoadClientDetailFailed;
  constructor(public payload: any) { }
}

export class ClearSearchResult implements Action {
  readonly type = ClientActionTypes.ClearSearchResult;
  constructor() { }
}

export class ClearClient implements Action {
  readonly type = ClientActionTypes.ClearClient;
  constructor() { }
}

export class CreateClient implements Action {
  readonly type = ClientActionTypes.CreateClient;
  constructor(public payload: { client: ClientVM, backToProject: boolean }) { }
}
export class CreateClientSuccess implements Action {
  readonly type = ClientActionTypes.CreateClientSuccess;
  constructor(public payload: { id: string, backToProject: boolean }) { }
}
export class CreateClientFailed implements Action {
  readonly type = ClientActionTypes.CreateClientFailed;
  constructor(public payload: any) { }
}

export class UpdateClient implements Action {
  readonly type = ClientActionTypes.UpdateClient;
  constructor(public payload: { client: ClientVM }) { }
}
export class UpdateClientSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientSuccess;
  constructor(public payload: { id: string }) { }
}
export class UpdateClientFailed implements Action {
  readonly type = ClientActionTypes.UpdateClientFailed;
  constructor(public payload: any) { }
}


export class NewClientData implements Action {
  readonly type = ClientActionTypes.newClientData;
  constructor(public payload: any) { }
}
export class NewClientDataSuccess implements Action {
  readonly type = ClientActionTypes.newClientDataSuccess;
  constructor(public payload: any) { }
}

export type ClientActions = UpdateSearch
  | LoadClientList
  | LoadClientListSuccess
  | LoadClientListFailed

  | NewClientDetail
  | LoadClientDetail
  | LoadClientDetailSuccess
  | LoadClientDetailFailed

  | LoadClientContacts
  | LoadClientContactsSuccess
  | LoadClientContactsFailed

  | LoadContactDetail
  | NewContactDetail
  | ClearContactDetail

  | DeleteContact
  | DeleteContactFailed

  | CreateContact
  | CreateContactFailed

  | CreateClient
  | CreateClientSuccess
  | CreateClientFailed

  | UpdateClient
  | UpdateClientSuccess
  | UpdateClientFailed

  | UpdateContact
  | UpdateContactFailed

  | ClearClient

  | DeleteClient
  | DeleteClientFailed
  | ClearSearchResult

  | NewClientData
  | NewClientDataSuccess;
