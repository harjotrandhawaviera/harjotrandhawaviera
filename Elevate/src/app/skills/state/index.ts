import * as fromSkill from './skills.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  skills: fromSkill.SkillState;
}

const getSkillFeatureState =
  createFeatureSelector<fromSkill.SkillState>('skills');

export const getSearchModel = createSelector(
  getSkillFeatureState,
  (state) => state.searchModel
);
export const getLoading = createSelector(
  getSkillFeatureState,
  (state) => state.loading
);
export const getSearchResult = createSelector(getSkillFeatureState, (state) =>
  state.resultList ? state.resultList : []
);

export const getTotalRecord = createSelector(
  getSkillFeatureState,
  (state) => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getSkillFeatureState,
  (state) => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(getSkillFeatureState, (state) =>
  state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0
);
export const getPageSize = createSelector(getSkillFeatureState, (state) =>
  state.pageInfo?.per_page ? state.pageInfo?.per_page : 0
);
export const getNoRecords = createSelector(
  getSkillFeatureState,
  (state) => state.noRecord
);
