import { createAction, props } from '@ngrx/store';
import {TodoAddModel, TodoResponse, TodoUpdateModel, TodoUpdateModelResponse} from '../../model/todos.model';

const loadTodoClient = createAction('[Todo] Load Todo Client List', props<{ params: string }>());
const loadTodoClientSuccess = createAction(
  '[Todo] Load Todo Client List Success',
  props<{ lists: TodoResponse[] | TodoResponse }>()
);
const loadTodoList = createAction('[Todo] Load Todo List', props<{ params: string }>());
const loadTodoListSuccess = createAction(
  '[Todo] Load Todo List Success',
  props<{ lists: TodoResponse[] | TodoResponse }>()
);
const addTodoModalUpdate = createAction('[Todo] Todo Modal Update', props<{ params: TodoUpdateModel }>());
const addTodoModalUpdateSuccess = createAction(
  '[Todo] Todo Modal Update Success',
  props<{ lists: TodoUpdateModelResponse}>()
);
const addTodo = createAction('[Todo] Todo Add', props<{ params: TodoAddModel }>());
const addTodoSuccess = createAction(
  '[Todo] Todo Added Success',
  props<{ lists: TodoUpdateModelResponse}>()
);

export const TodosActions = {
  loadTodoClient,
  loadTodoClientSuccess,
  loadTodoList,
  loadTodoListSuccess,
  addTodoModalUpdate,
  addTodoModalUpdateSuccess,
  addTodo,
  addTodoSuccess
};
