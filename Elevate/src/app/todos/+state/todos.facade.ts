import { Injectable } from '@angular/core';
import { TodosAppState } from './todos.reducers';
import { Store } from '@ngrx/store';
import { TodosActions } from './todos.actions';
import { fromTodo } from './todos.selector';
import {TodoAddModel, TodoUpdateModel} from '../../model/todos.model';
import * as fromCurrentUser from '../../root-state/user-state';


@Injectable({
  providedIn: 'root'
})

export class TodosFacade {
  loggedUser: any;

  constructor(private store: Store<TodosAppState>) {}
  getLoadingStatus$ = this.store.select(fromTodo.getLoadingStatus);
  getAgentList$ = this.store.select(fromTodo.getAgentList);
  getTodoList$ = this.store.select(fromTodo.getTodoList);

  loadClientList() {
    const params ='/agents?limit=100000&include=user&only_active=true&only_fields=agent.id,agent.lastname,agent.firstname,user.id';
    this.store.dispatch(TodosActions.loadTodoClient({ params }));
  }
  loadTodoList(value?: { client_id?: string; status?: number; created_by?: string; search?: string, pageIndex?: any, pageSize?: any }) {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedUser = res?.role_id;
        if (this.loggedUser) {
          let params = '/todos?include=owner,creator&limit=24&order_by=target_at&order_dir=asc&agent_id=' + this.loggedUser;
          if (value?.client_id) {
            params += '&agent_id=' + value.client_id;
          }
          if (value?.status) {
            params += '&state=' + value.status;
          }
          if (value?.created_by) {
            params += '&creator_id=' + value.created_by;
          }
          if (value?.search) {
            params += '&search=' + value.search;
          }
          if (value?.pageIndex) {
            params += '&page=' + value.pageIndex;
          }
          this.store.dispatch(TodosActions.loadTodoList({params}));
        }
      }
    });
  }
  updateModal(search: TodoUpdateModel) {
    this.store.dispatch(TodosActions.addTodoModalUpdate({ params: search }));
  }
  addTodo(search: TodoAddModel) {
    this.store.dispatch(TodosActions.addTodo({ params: search }));
  }
}
