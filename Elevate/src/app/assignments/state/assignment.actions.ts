import { AssignmentSearchVM, AssignmentVM } from '../../model/assignment.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';

import { Action } from '@ngrx/store';
import { BudgetVM } from '../../model/budget.model';
import { CheckinVM } from '../../model/checkin.model';
import { DatesVM } from '../../model/dates.model';
import { JobDocumentVM } from '../../model/job.model';

export enum AssignmentActionTypes {
  UpdateSearch = '[Assignment] Update search',
  LoadAssignmentList = '[Assignment] Load assignment list',
  LoadAssignmentListSuccess = '[Assignment] Load assignment list success',
  LoadAssignmentListFailed = '[Assignment] Load assignment list failed',

  DeleteAssignment = '[Assignment] Delete assignment',
  DeleteAssignmentFailed = '[Assignment] Delete assignment failed',

  UpdateAssignment = '[Assignment] Update assignment',
  UpdateAssignmentSuccess = '[Assignment] Update assignment success',
  UpdateAssignmentFailed = '[Assignment] Update assignment failed',

  UpdateCheckin = '[Assignment] Update checkin',
  UpdateCheckinSuccess = '[Assignment] Update checkin success',
  UpdateCheckinFailed = '[Assignment] Update checkin failed',

  LoadAssignmentDetail = '[Assignment] Load assignment detail',
  LoadAssignmentDetailSuccess = '[Assignment] Load assignment detail success',
  LoadAssignmentDetailFailed = '[Assignment] Load assignment detail failed',

  LoadBudgetDetail = '[Assignment] Load budget detail',
  LoadBudgetDetailSuccess = '[Assignment] Load budget detail success',
  LoadBudgetDetailFailed = '[Assignment] Load budget detail failed',

  LoadDatesDetail = '[Dates] Load dates detail',
  LoadDatesDetailSuccess = '[Dates] Load dates detail success',
  LoadDatesDetailFailed = '[Dates] Load dates detail failed',

  CreateAssignment = '[Assignment] Create assignment',
  CreateAssignmentSuccess = '[Assignment] Create assignment success',
  CreateAssignmentFailed = '[Assignment] Create assignment failed',

  UpdateSurveyLink = '[Assignment] Update Survey Link ',
  UpdateSurveyLinkSuccess = '[Assignment] Update  Survey Link success',

  GetSurveyLink = '[Assignment] Get Survey Link ',
  GetSurveyLinkSuccess = '[Assignment] Get  Survey Link success',

  ClearSearchResult = '[Assignment] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = AssignmentActionTypes.UpdateSearch;
  constructor(public payload: AssignmentSearchVM) {}
}

export class LoadAssignmentList implements Action {
  readonly type = AssignmentActionTypes.LoadAssignmentList;
  constructor(public payload: { search: AssignmentSearchVM; view?: string }) {}
}
export class LoadAssignmentListSuccess implements Action {
  readonly type = AssignmentActionTypes.LoadAssignmentListSuccess;
  constructor(public payload: PagedResult<AssignmentVM>) {}
}
export class LoadAssignmentListFailed implements Action {
  readonly type = AssignmentActionTypes.LoadAssignmentListFailed;
  constructor(public payload: any) {}
}

export class DeleteAssignment implements Action {
  readonly type = AssignmentActionTypes.DeleteAssignment;
  constructor(public payload: number) {}
}
export class DeleteAssignmentFailed implements Action {
  readonly type = AssignmentActionTypes.DeleteAssignmentFailed;
  constructor(public payload: any) {}
}

export class UpdateAssignment implements Action {
  readonly type = AssignmentActionTypes.UpdateAssignment;
  constructor(public payload: { id: number; assignment: AssignmentVM }) {}
}
export class UpdateAssignmentSuccess implements Action {
  readonly type = AssignmentActionTypes.UpdateAssignmentSuccess;
  constructor(public payload: { id: number }) {}
}
export class UpdateAssignmentFailed implements Action {
  readonly type = AssignmentActionTypes.UpdateAssignmentFailed;
  constructor(public payload: any) {}
}

export class UpdateCheckin implements Action {
  readonly type = AssignmentActionTypes.UpdateCheckin;
  constructor(public payload: { id: number; checkin: CheckinVM }) {}
}
export class UpdateCheckinSuccess implements Action {
  readonly type = AssignmentActionTypes.UpdateCheckinSuccess;
  constructor(public payload: { id: number }) {}
}
export class UpdateCheckinFailed implements Action {
  readonly type = AssignmentActionTypes.UpdateCheckinFailed;
  constructor(public payload: any) {}
}

export class LoadAssignmentDetail implements Action {
  readonly type = AssignmentActionTypes.LoadAssignmentDetail;
  constructor(public payload: string) {}
}
export class LoadAssignmentDetailSuccess implements Action {
  readonly type = AssignmentActionTypes.LoadAssignmentDetailSuccess;
  constructor(public payload: AssignmentVM) {}
}
export class LoadAssignmentDetailFailed implements Action {
  readonly type = AssignmentActionTypes.LoadAssignmentDetailFailed;
  constructor(public payload: any) {}
}

export class LoadBudgetDetail implements Action {
  readonly type = AssignmentActionTypes.LoadBudgetDetail;
  constructor(public payload: number) {}
}
export class LoadBudgetDetailSuccess implements Action {
  readonly type = AssignmentActionTypes.LoadBudgetDetailSuccess;
  constructor(public payload: BudgetVM) {}
}
export class LoadBudgetDetailFailed implements Action {
  readonly type = AssignmentActionTypes.LoadBudgetDetailFailed;
  constructor(public payload: any) {}
}

export class LoadDatesDetail implements Action {
  readonly type = AssignmentActionTypes.LoadDatesDetail;
  constructor(public payload: { id: string; mode: string }) {}
}
export class LoadDatesDetailSuccess implements Action {
  readonly type = AssignmentActionTypes.LoadDatesDetailSuccess;
  constructor(public payload: DatesVM) {}
}
export class LoadDatesDetailFailed implements Action {
  readonly type = AssignmentActionTypes.LoadDatesDetailFailed;
  constructor(public payload: any) {}
}

export class CreateAssignment implements Action {
  readonly type = AssignmentActionTypes.CreateAssignment;
  constructor(
    public payload: {
      assignment: AssignmentVM;
      documents: JobDocumentVM[];
    }
  ) {}
}
export class CreateAssignmentSuccess implements Action {
  readonly type = AssignmentActionTypes.CreateAssignmentSuccess;
  constructor(public payload: { id: number }) {}
}
export class CreateAssignmentFailed implements Action {
  readonly type = AssignmentActionTypes.CreateAssignmentFailed;
  constructor(public payload: {}) {}
}

export class ClearSearchResult implements Action {
  readonly type = AssignmentActionTypes.ClearSearchResult;
  constructor() {}
}

export class GetSurveyLink implements Action {
  readonly type = AssignmentActionTypes.GetSurveyLink;
  constructor(public payload: { data: any }) {}
}
export class GetSurveyLinkSuccess implements Action {
  readonly type = AssignmentActionTypes.GetSurveyLinkSuccess;
  constructor(public data: any) {}
}

export class UpdateSurveyLink implements Action {
  readonly type = AssignmentActionTypes.UpdateSurveyLink;
  constructor(public payload: { data: any }) {}
}
export class UpdateSurveyLinkSuccess implements Action {
  readonly type = AssignmentActionTypes.UpdateSurveyLinkSuccess;
  constructor(public data: any) {}
}

export type AssignmentActions =
  | UpdateSearch
  | LoadAssignmentList
  | LoadAssignmentListSuccess
  | LoadAssignmentListFailed
  | DeleteAssignment
  | DeleteAssignmentFailed
  | UpdateAssignment
  | UpdateAssignmentSuccess
  | UpdateAssignmentFailed
  | UpdateCheckin
  | UpdateCheckinSuccess
  | UpdateCheckinFailed
  | LoadAssignmentDetail
  | LoadAssignmentDetailSuccess
  | LoadAssignmentDetailFailed
  | LoadBudgetDetail
  | LoadBudgetDetailSuccess
  | LoadBudgetDetailFailed
  | LoadDatesDetail
  | LoadDatesDetailSuccess
  | LoadDatesDetailFailed
  | CreateAssignment
  | CreateAssignmentSuccess
  | CreateAssignmentFailed
  | GetSurveyLink
  | GetSurveyLinkSuccess
  | UpdateSurveyLink
  | UpdateSurveyLinkSuccess;
