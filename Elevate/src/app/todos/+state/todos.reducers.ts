import { Action, createReducer, on } from '@ngrx/store';
import { TodosList } from '../../model/todos.model';
import { TodosActions } from './todos.actions';

export const featureKey = 'todos';

export interface TodosState {
  todosList: TodosList | TodosList[];
  client: TodosList | TodosList[];
  loading: boolean;
  updateModal: TodosList | TodosList[];
}

export const initialState: TodosState = {
  todosList: [],
  client: [],
  loading: false,
  updateModal: []
};

export interface TodosAppState {
  [featureKey]: TodosState;
}

export const todosReducer = createReducer<TodosState>(
  initialState,
  on(TodosActions.loadTodoClient, (state,  { params} ) => ( {
    ...state,
    loading: true
  })),
  on(TodosActions.loadTodoClientSuccess, (state,  { lists} ) => ( {
    ...state,
    client: lists,
    loading: false
  })),
  on(TodosActions.loadTodoList, (state,  { params} ) => ( {
    ...state,
    loading: true
  })),
  on(TodosActions.loadTodoListSuccess, (state,  { lists } ) => ( {
    ...state,
    todosList: lists,
    loading: false
  })),
  on(TodosActions.addTodoModalUpdateSuccess, ( state,  { lists} ) => {
    // @ts-ignore
    const findIndex = state.todosList.data.findIndex((res) => res.id === lists?.data?.id);
    // @ts-ignore
    const newChangedValue = [ ...state.todosList.data ];
    newChangedValue[findIndex] = {
      ...newChangedValue[findIndex],
      subject: lists?.data?.subject,
      creatorName: lists?.data?.creator,
      important: lists?.data?.important,
      created_at: lists?.data?.created_at,
      state: lists?.data?.state
    };
    return {
      ...state,
      todosList: { ...state.todosList, data: newChangedValue }
    };
  }),
);

// tslint:disable-next-line:typedef
export function reducer(state: TodosState | undefined, action: Action) {
  return todosReducer(state, action);
}
