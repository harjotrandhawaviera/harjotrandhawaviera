import { CertificateActionTypes, CertificateActions } from './certificates.actions';
import { CertificateSearchVM, CertificateVM } from './../../model/certificate.model';

import { PaginationVM } from './../../model/pagination.model';

export interface CertificateState {
  searchModel?: CertificateSearchVM;
  resultList?: CertificateVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): CertificateState {
  let stored = undefined;
  // try {
  //   const data = localStorage.getItem('certificate.search');
  //   stored = data != null ? JSON.parse(data) : undefined;
  // } catch {
  //   localStorage.removeItem('certificate.search')
  // }

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
export function reducer(
  state = initialState(),
  action: CertificateActions
): CertificateState {
  switch (action.type) {
    case CertificateActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case CertificateActionTypes.LoadCertificateList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case CertificateActionTypes.LoadCertificateListSuccess:
      // localStorage.setItem('certificate.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case CertificateActionTypes.LoadCertificateListFailed:
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
