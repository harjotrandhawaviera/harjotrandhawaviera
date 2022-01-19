import { PaginationVM } from './../../model/pagination.model';
import { ContactSearchVM, ContactVM } from './../../model/contact.model';
import { ContactActions, ContactActionTypes } from './contact.actions';

export interface ContactState {
  searchModel?: ContactSearchVM;
  resultList?: ContactVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}
function initialState(): ContactState {
  const stored = localStorage.getItem('contact.search');
  return {
    searchModel: undefined,
    resultList: [],
    loading: false,
    noRecord: false,
    pageInfo: {
      total: 0,
      current_page: 1,
      total_pages: 0,
    },
  };
}
export function reducer(state = initialState(), action: ContactActions): ContactState {
  switch (action.type) {
    case ContactActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case ContactActionTypes.LoadContactList:
      localStorage.setItem('contact.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case ContactActionTypes.LoadContactListSuccess:
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case ContactActionTypes.LoadContactListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };
    default:
      return state;
  }
}
