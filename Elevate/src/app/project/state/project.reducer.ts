import { ProjectActionTypes, ProjectActions } from './project.actions';
import { ProjectSearchVM, ProjectVM } from './../../model/project.model';

import { PaginationVM } from './../../model/pagination.model';

export interface ProjectState {
  searchModel?: ProjectSearchVM;
  resultList?: ProjectVM[];
  project?: ProjectVM;
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
}

function initialState(): ProjectState {
  const stored = localStorage.getItem('project.search');
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
  action: ProjectActions
): ProjectState {
  switch (action.type) {
    case ProjectActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case ProjectActionTypes.LoadProjectList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case ProjectActionTypes.LoadProjectListSuccess:
      localStorage.setItem('project.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case ProjectActionTypes.LoadProjectListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };

    case ProjectActionTypes.LoadProjectDetail:
      return {
        ...state,
        project: undefined,
      };
    case ProjectActionTypes.LoadProjectDetailSuccess: {
      const project = action.payload.project;
      const mode = action.payload.mode;
      return {
        ...state,
        project:
          mode === 'copy'
            ? {
                ...project,
                id: undefined,
                documents: project.documents?.map((a) => {
                  return { ...a, project_id: undefined, id: undefined };
                }),
              }
            : project,
      };
    }
    case ProjectActionTypes.LoadProjectDetailFailed:
      return {
        ...state,
        project: undefined,
      };
    case ProjectActionTypes.NewProjectDetail:
      return {
        ...state,
        project: {},
      };
    default:
      return state;
  }
}
