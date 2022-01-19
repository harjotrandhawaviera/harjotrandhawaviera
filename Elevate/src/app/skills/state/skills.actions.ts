import { PagedResult } from '../../model/pagination.model';
import { Action } from '@ngrx/store';
import { SkillSearchVM, SkillVM } from '../../model/skill.model';

export enum SkillsActionTypes {
  UpdateSearch = '[Skills] Update search',
  LoadSkillList = '[Skills] Load Skill list',
  LoadSkillListSuccess = '[Skills] Search success',
  LoadSkillListFailed = '[Skills] Search failed',
}

export class UpdateSearch implements Action {
  readonly type = SkillsActionTypes.UpdateSearch;
  constructor(public payload: SkillSearchVM) {}
}

export class LoadSkillList implements Action {
  readonly type = SkillsActionTypes.LoadSkillList;
  constructor(public payload: SkillSearchVM) {}
}
export class LoadSkillListSuccess implements Action {
  readonly type = SkillsActionTypes.LoadSkillListSuccess;
  constructor(public payload: PagedResult<SkillVM>) {}
}
export class LoadSkillListFailed implements Action {
  readonly type = SkillsActionTypes.LoadSkillListFailed;
  constructor(public payload: any) {}
}

export type SkillActions =
  // load certificate list
  LoadSkillList | LoadSkillListSuccess | LoadSkillListFailed | UpdateSearch;
