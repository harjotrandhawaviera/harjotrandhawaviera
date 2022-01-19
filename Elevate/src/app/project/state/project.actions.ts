import { PagedResult, PaginationVM } from './../../model/pagination.model';
import {
  ProjectDocumentVM,
  ProjectSearchVM,
  ProjectVM,
} from './../../model/project.model';

import { Action } from '@ngrx/store';

export enum ProjectActionTypes {
  UpdateSearch = '[Project] Update search',
  LoadProjectList = '[Project] Load Project list',
  LoadProjectListSuccess = '[Project] Search success',
  LoadProjectListFailed = '[Project] Search failed',

  NewProjectDetail = '[Project] New Project Detail',
  LoadProjectDetail = '[Project] Load Project Detail',
  LoadProjectDetailSuccess = '[Project] Project Detail success',
  LoadProjectDetailFailed = '[Project] Project Detail failed',

  CreateProject = '[Project] Create Project',
  CreateProjectSuccess = '[Project] Create Project success',
  CreateProjectFailed = '[Project] Create Project failed',

  UpdateProject = '[Project] Update Project',
  UpdateProjectSuccess = '[Project] Update Project success',
  UpdateProjectFailed = '[Project] Update Project failed',

  DeleteProject = '[Project] Delete Project',
  DeleteProjectSuccess = '[Project] Delete success',
  DeleteProjectFailed = '[Project] Delete failed',

  ClearProject = '[Project] Clear Project',
  ClearSearchResult = '[Project] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = ProjectActionTypes.UpdateSearch;
  constructor(public payload: ProjectSearchVM) {}
}

export class LoadProjectList implements Action {
  readonly type = ProjectActionTypes.LoadProjectList;
  constructor(public payload: ProjectSearchVM) {}
}
export class LoadProjectListSuccess implements Action {
  readonly type = ProjectActionTypes.LoadProjectListSuccess;
  constructor(public payload: PagedResult<ProjectVM>) {}
}
export class LoadProjectListFailed implements Action {
  readonly type = ProjectActionTypes.LoadProjectListFailed;
  constructor(public payload: any) {}
}

export class NewProjectDetail implements Action {
  readonly type = ProjectActionTypes.NewProjectDetail;
  constructor() {}
}
export class LoadProjectDetail implements Action {
  readonly type = ProjectActionTypes.LoadProjectDetail;
  constructor(public payload: { id: string; mode: string }) {}
}
export class LoadProjectDetailSuccess implements Action {
  readonly type = ProjectActionTypes.LoadProjectDetailSuccess;
  constructor(public payload: { project: ProjectVM; mode: string }) {}
}
export class LoadProjectDetailFailed implements Action {
  readonly type = ProjectActionTypes.LoadProjectDetailFailed;
  constructor(public payload: any) {}
}

export class UpdateProject implements Action {
  readonly type = ProjectActionTypes.UpdateProject;
  constructor(
    public payload: {
      project: ProjectVM;
      newDocuments: ProjectDocumentVM[];
      updatedDocuments: ProjectDocumentVM[];
      deletedDocuments: number[];
    }
  ) {}
}
export class UpdateProjectSuccess implements Action {
  readonly type = ProjectActionTypes.UpdateProjectSuccess;
  constructor(public payload: { id: number }) {}
}
export class UpdateProjectFailed implements Action {
  readonly type = ProjectActionTypes.UpdateProjectFailed;
  constructor(public payload: any) {}
}

export class CreateProject implements Action {
  readonly type = ProjectActionTypes.CreateProject;
  constructor(
    public payload: { project: ProjectVM; newDocuments: ProjectDocumentVM[] }
  ) {}
}
export class CreateProjectSuccess implements Action {
  readonly type = ProjectActionTypes.CreateProjectSuccess;
  constructor(public payload: { id: number }) {}
}
export class CreateProjectFailed implements Action {
  readonly type = ProjectActionTypes.CreateProjectFailed;
  constructor(public payload: { id: number }) {}
}

export class ClearSearchResult implements Action {
  readonly type = ProjectActionTypes.ClearSearchResult;
  constructor() {}
}

export class ClearProject implements Action {
  readonly type = ProjectActionTypes.ClearProject;
  constructor() {}
}

export class DeleteProject implements Action {
  readonly type = ProjectActionTypes.DeleteProject;
  constructor(public payload: number) { }
}
export class DeleteProjectFailed implements Action {
  readonly type = ProjectActionTypes.DeleteProjectFailed;
  constructor(public payload: any) { }
}

export type ProjectActions =
  | UpdateSearch
  // load project list
  | LoadProjectList
  | LoadProjectListSuccess
  | LoadProjectListFailed
  // create project
  | CreateProject
  | CreateProjectSuccess
  | CreateProjectFailed
  // updated project
  | UpdateProject
  | UpdateProjectSuccess
  | UpdateProjectFailed
  // new project init
  | NewProjectDetail
  // load project detail
  | LoadProjectDetail
  | LoadProjectDetailSuccess
  | LoadProjectDetailFailed
  // delete project
  | DeleteProject
  | DeleteProjectFailed
  // clear project detail
  | ClearProject
  // clear project list
  | ClearSearchResult;
