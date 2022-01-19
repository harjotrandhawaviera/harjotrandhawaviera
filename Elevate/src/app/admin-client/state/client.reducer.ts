import { ClientActionTypes, ClientActions } from './client.actions';
import { ClientSearchVM, ClientVM } from '../../model/client.model';

import { ContactVM } from './../../model/contact.model';
import { PaginationVM } from './../../model/pagination.model';

export interface ClientState {
  searchModel?: ClientSearchVM;
  resultList?: ClientVM[];
  client?: ClientVM;
  contact?: ContactVM;
  contactMode?: string;
  clientContacts?: ContactVM[];
  noRecord: boolean;
  loading: boolean;
  loadingClientContact: boolean;
  pageInfo?: PaginationVM;
  createClient: any;
  successCreateClient: any;
}
function initialState(): ClientState {
  const stored = localStorage.getItem('client.search');
  return {
    searchModel: stored !== null ? JSON.parse(stored) : undefined,
    resultList: [],
    clientContacts: [],
    noRecord: false,
    loading: false,
    loadingClientContact: false,
    pageInfo: {
      total: 0,
      current_page: 1,
      total_pages: 0,
    },
    createClient: [],
    successCreateClient: []
  };
}
export function reducer(
  state = initialState(),
  action: ClientActions
): ClientState {
  switch (action.type) {
    case ClientActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case ClientActionTypes.LoadClientList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };
    case ClientActionTypes.LoadClientContacts:
      return {
        ...state,
        loadingClientContact: true,
      };
    case ClientActionTypes.NewContactDetail:
      return {
        ...state,
        contactMode: 'create',
        contact: {},
      };
    case ClientActionTypes.ClearContactDetail:
      return {
        ...state,
        contactMode: undefined,
        contact: undefined,
      };
    case ClientActionTypes.LoadContactDetail:
      return {
        ...state,
        contactMode: 'edit',
        contact: state.clientContacts?.find((a) => a.id === action.payload),
      };
    case ClientActionTypes.LoadClientContactsSuccess:
      return {
        ...state,
        clientContacts: action.payload,
        contactMode: undefined,
        contact: undefined,
        loadingClientContact: false,
      };
    case ClientActionTypes.LoadClientDetail:
      return {
        ...state,
        loading: true,
        client: undefined,
        clientContacts: [],
      };
    case ClientActionTypes.LoadClientDetailSuccess:
      return {
        ...state,
        loading: true,
        client: action.payload,
      };
    case ClientActionTypes.newClientData  :

      return {
        ...state,
        createClient: action.payload,
      };
    case ClientActionTypes.CreateClientSuccess  :

      return {
        ...state,
        successCreateClient: action.payload,
      };

    case ClientActionTypes.LoadClientListSuccess:
      localStorage.setItem('client.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };
    case ClientActionTypes.LoadClientDetailFailed:
    case ClientActionTypes.LoadClientContactsSuccess:
      return {
        ...state,
        client: undefined,
        clientContacts: [],
        loadingClientContact: false,
        loading: false,
      };
    case ClientActionTypes.ClearClient:
      return {
        ...state,
        client: undefined,
        contact: undefined,
        contactMode: undefined,
        clientContacts: [],
        loading: false,
      };
    case ClientActionTypes.LoadClientListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };
    case ClientActionTypes.NewClientDetail:
      return {
        ...state,
        client: {},
        contact: undefined,
        contactMode: undefined,
        clientContacts: [],
        loadingClientContact: false,
        loading: false,
      };
    default:
      return state;
  }
}
