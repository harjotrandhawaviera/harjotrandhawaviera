import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TodosActions } from './todos.actions';
import { map, mergeMap } from 'rxjs/operators';
import { TodoResponse, TodoUpdateModelResponse } from '../../model/todos.model';
import { TodoService } from '../../services/todos.service';

@Injectable()
export class TodosEffects {
  loadClientUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadTodoClient),
      mergeMap(( { params }) => {
        // @ts-ignore
        return this.todoService.todoClient(params);
      }),
      map((lists: TodoResponse | TodoResponse[]) => TodosActions.loadTodoClientSuccess({ lists }))
    )
  );

  loadTasksLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadTodoList),
      mergeMap(( { params }) => {
        // @ts-ignore
        return this.todoService.todoClient(params);
      }),
      map((lists: TodoResponse | TodoResponse[]) => TodosActions.loadTodoListSuccess({ lists }))
    )
  );

  updateModalValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.addTodoModalUpdate),
      mergeMap(( { params }) => this.todoService.updateModal(params)),
      map((lists: TodoUpdateModelResponse) => TodosActions.addTodoModalUpdateSuccess({ lists }))
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.addTodo),
      mergeMap(( { params }) => this.todoService.addTodo(params)),
      map((lists: TodoUpdateModelResponse) => TodosActions.addTodoSuccess({ lists }))
    )
  );


  constructor(private actions$: Actions,
              private store: Store<any>,
              private todoService: TodoService) {}

}
