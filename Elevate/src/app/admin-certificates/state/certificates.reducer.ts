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
  const stored = localStorage.getItem('admin.certificate.search');
  return {
    searchModel: stored !== null ? JSON.parse(stored) : undefined,
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
      if (state.searchModel) {
        localStorage.setItem('admin.certificate.search', JSON.stringify(state.searchModel));
      } else {
        localStorage.removeItem('admin.certificate.search');
      }
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
    case CertificateActionTypes.ToggleEnabledCertificateSuccess:
      return {
        ...state,
        resultList: state.resultList?.map(a => {
          if (a.id === action.payload.id) {
            return {
              ...a,
              is_enabled: action.payload.is_enabled,
              state: action.payload.state
            }
          } else {
            return a;
          }
        }),
      };
    case CertificateActionTypes.ToggleRecommendationCertificateSuccess:
      return {
        ...state,
        resultList: state.resultList?.map(a => {
          if (a.id === action.payload.id) {
            return {
              ...a,
              is_recommended: action.payload.is_recommended,
              state: action.payload.state
            }
          } else {
            return a;
          }
        }),
      };
    default:
      return state;
  }
}
