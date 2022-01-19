import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  IdRequestVM,
  ProjectSearchRequestVM,
  SearchRequestVM,
} from './../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectDocumentResponse } from './../model/project.response';
import { ProjectResponse } from '../model/project.response';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import {ProfileState} from "../profile/state/profile.reducer";
import {Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {
  constructor(private http: HttpClient,
              private store: Store<ProfileState>) {
    super();
  }
  getProjects(
    searchRequest: SearchRequestVM
  ): Observable<MultipleResponse<ProjectResponse>> {
    return this.http.get<MultipleResponse<ProjectResponse>>(
      environment.api + this.getSearchURL('/projects', searchRequest)
    );
  }
  getProjectsLK(): Observable<MultipleResponse<ProjectResponse>> {
    return this.getProjects({
      limit: 100000,
      order_by: 'name',
      only_fields: [
        'project.id',
        'project.name',
        'project.category',
        'project.started_at',
        'project.finished_at',
        'project.client_id',
        'project.state',
        'project.target_budget',
        'project.staff_id'
      ],
    });
  }

  getProjectsByClientId(
    searchRequest: SearchRequestVM, id?: number
  ): Observable<MultipleResponse<ProjectResponse>> {
    return this.http.get<MultipleResponse<ProjectResponse>>(
      environment.api + this.getSearchURL(id ? '/projects?client_id='+id : '/projects', searchRequest)
    );
  }

  getProjectById(
    idRequest: IdRequestVM
  ): Observable<SingleResponse<ProjectResponse>> {
    return this.http.get<SingleResponse<ProjectResponse>>(
      environment.api + this.getByIdURL('/projects', idRequest)
    );
  }
  orders(id: string) {
    if (id) {
      return this.getClientOrders({ id: id });
    } else {
      return this.getOrders({ limit: 10000 });
    }
  }
  // transformOrder(order: any) {
  //   order.budgets = order.budget && [budgetsService.transform(order.budget.data)];
  //   order.classes = order.state === 'active' ? undefined : 'option-disabled';
  //   return order;
  // }
  getClientOrders(obj: { id: string }): Observable<any> {
    return this.http.get(
      environment.api +
        this.transformPath('/clients/{id}/orders?include=budget', obj)
    );
  }
  createProject(req: {
    project: ProjectResponse;
  }): Observable<HttpResponse<SingleResponse<ProjectResponse>>> {
    return this.http.post(environment.api + `/projects`, req.project, {
      observe: 'response',
    });
  }
  deleteProject(
    id: string
  ): Observable<HttpResponse<SingleResponse<ProjectResponse>>> {
    return this.http.delete(environment.api + `/projects/${id}`, {
      observe: 'response',
    });
  }
  createProjectDocument(req: {
    projectId: number;
    document: ProjectDocumentResponse;
  }): Observable<HttpResponse<SingleResponse<ProjectDocumentResponse>>> {
    return this.http.post(
      environment.api + `/projects/${req.projectId}/documents`,
      req.document,
      { observe: 'response' }
    );
  }
  updateProjectDocument(req: {
    projectId: number;
    document: ProjectDocumentResponse;
  }): Observable<HttpResponse<SingleResponse<ProjectDocumentResponse>>> {
    return this.http.post(
      environment.api +
        `/projects/${req.projectId}/documents/${req.document.id}`,
      req.document,
      { observe: 'response' }
    );
  }
  deleteProjectDocument(req: {
    projectId: number;
    documentId: number;
  }): Observable<HttpResponse<SingleResponse<ProjectDocumentResponse>>> {
    return this.http.delete(
      environment.api +
        `/projects/${req.projectId}/documents/${req.documentId}`,
      { observe: 'response' }
    );
  }
  updateProject(req: {
    project: ProjectResponse;
  }): Observable<HttpResponse<SingleResponse<ProjectResponse>>> {
    return this.http.post(
      environment.api + `/projects/${req.project.id}`,
      req.project,
      { observe: 'response' }
    );
  }
  getOrders(data: any): Observable<any> {
    var path = this.query(
      '/orders?include=client,budget',
      ['limit', 'page', 'search'],
      data
    );
    return this.http.get(environment.api + this.transformPath(path, data));
  }
}
