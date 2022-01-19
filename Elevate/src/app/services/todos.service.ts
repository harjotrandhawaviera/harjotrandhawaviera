import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MultipleResponse } from '../model/response';
import {TodoAddModel, TodoResponse, TodosList, TodoUpdateModel, TodoUpdateModelResponse} from '../model/todos.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  todoClient(searchRequest: TodosList): Observable<TodoResponse> {
    return this.http.get<MultipleResponse<TodoResponse>>(environment.api + searchRequest);
  }
  updateModal(search: TodoUpdateModel): Observable<TodoUpdateModelResponse> {
    return this.http.post<TodoUpdateModelResponse>(environment.api + '/todos/' + search.todosId, search);
  }

  addTodo(search: TodoAddModel): Observable<TodoUpdateModelResponse> {
    return this.http.post<TodoUpdateModelResponse>(environment.api + '/todos', search);
  }
}
