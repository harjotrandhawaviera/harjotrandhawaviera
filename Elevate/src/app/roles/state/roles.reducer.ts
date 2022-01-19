import { RolesActionTypes, RoleActions } from './roles.actions';
import { PaginationVM } from '../../model/pagination.model';
import { RoleSearchVM, RoleVM } from '../../model/role.model';

export interface RoleState {
  searchModel?: RoleSearchVM;
  resultList?: RoleVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): RoleState {
  const stored = localStorage.getItem('role.search');
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
  action: RoleActions
): RoleState {
  switch (action.type) {
    case RolesActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };

    case RolesActionTypes.LoadRoleList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case RolesActionTypes.LoadRoleListSuccess:
      if (state.searchModel) {
        localStorage.setItem('role.search', JSON.stringify(state.searchModel));
      } else {
        localStorage.removeItem('role.search');
      }
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case RolesActionTypes.LoadRoleListFailed:
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
