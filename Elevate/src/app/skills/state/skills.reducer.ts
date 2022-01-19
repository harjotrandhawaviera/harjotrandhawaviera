import { SkillsActionTypes, SkillActions } from './skills.actions';
import { PaginationVM } from '../../model/pagination.model';
import { SkillSearchVM, SkillVM } from '../../model/skill.model';

export interface SkillState {
  searchModel?: SkillSearchVM;
  resultList?: SkillVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): SkillState {
  const stored = localStorage.getItem('skill.search');
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
  action: SkillActions
): SkillState {
  switch (action.type) {
    case SkillsActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };

    case SkillsActionTypes.LoadSkillList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case SkillsActionTypes.LoadSkillListSuccess:
      if (state.searchModel) {
        localStorage.setItem('skill.search', JSON.stringify(state.searchModel));
      } else {
        localStorage.removeItem('skill.search');
      }
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case SkillsActionTypes.LoadSkillListFailed:
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
