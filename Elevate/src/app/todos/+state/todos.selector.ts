import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, TodosState } from './todos.reducers';

export const getFeatureState = createFeatureSelector<TodosState>(featureKey);

export const fromTodo = {
  getAgentList: createSelector(getFeatureState, (state) => state.client),
  getTodoList: createSelector(getFeatureState, (state) => state.todosList),
  getLoadingStatus: createSelector(getFeatureState, (state) => state.loading)
};
