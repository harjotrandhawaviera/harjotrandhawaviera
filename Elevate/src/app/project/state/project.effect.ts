import * as fromProject from './index';
import * as fromProjectAction from './project.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultipleResponse, SingleResponse } from './../../model/response';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectMappingService } from '../../services/mapping-services';
import { ProjectResponse } from '../../model/project.response';
import { ProjectSearchVM } from '../../model/project.model';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Injectable()
export class ProjectEffect {
  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private store: Store<fromProject.State>,
    private actions$: Actions,
    private projectMappingService: ProjectMappingService
  ) {}

  @Effect()
  loadProjectList$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectAction.ProjectActionTypes.LoadProjectList),
    map((action: fromProjectAction.LoadProjectList) => action.payload),
    switchMap((payload) =>
      this.projectService
        .getProjects(this.projectMappingService.searchRequest(payload))
        .pipe(
          map((projectRes: MultipleResponse<ProjectResponse>) => {
            return new fromProjectAction.LoadProjectListSuccess(
              this.projectMappingService.projectSearchResponseToVM(projectRes)
            );
          }),
          catchError((err) =>
            of(new fromProjectAction.LoadProjectListFailed(err))
          )
        )
    )
  );

  @Effect()
  loadProjectDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectAction.ProjectActionTypes.LoadProjectDetail),
    map((action: fromProjectAction.LoadProjectDetail) => action.payload),
    switchMap((payload) =>
      this.projectService
        .getProjectById(this.projectMappingService.getByIdRequest(payload.id))
        .pipe(
          map((ProjectRes: SingleResponse<ProjectResponse>) => {
            if (ProjectRes?.data) {
              return new fromProjectAction.LoadProjectDetailSuccess({
                project: this.projectMappingService.projectResponseToVM(
                  ProjectRes.data
                ),
                mode: payload.mode,
              });
            } else {
              return new fromProjectAction.LoadProjectDetailFailed(ProjectRes);
            }
          }),
          catchError((err) =>
            of(new fromProjectAction.LoadProjectDetailFailed(err))
          )
        )
    )
  );

  @Effect()
  updateProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectAction.ProjectActionTypes.UpdateProject),
    map((action: fromProjectAction.UpdateProject) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.projectService.updateProject({
          project: this.projectMappingService.projectVMToResponse(
            payload.project
          ),
        }),
      ])
    ),
    switchMap((payload) => {
      const originalPayload = payload[0];
      const updateProjectResponse = payload[1];
      const newDocRequest = originalPayload.newDocuments.map((a) =>
        this.projectService.createProjectDocument({
          projectId: Number(originalPayload.project.id),
          document: { ...a, document_id: a.id },
        })
      );
      const updatedDocRequest = originalPayload.updatedDocuments.map((a) =>
        this.projectService.updateProjectDocument({
          projectId: Number(originalPayload.project.id),
          document: a,
        })
      );
      const deletedDocRequest = originalPayload.deletedDocuments.map((a) =>
        this.projectService.deleteProjectDocument({
          projectId: Number(originalPayload.project.id),
          documentId: a,
        })
      );
      return forkJoin([
        of(originalPayload),
        of(updateProjectResponse),
        ...newDocRequest,
        ...updatedDocRequest,
        ...deletedDocRequest,
      ]);
    }),
    switchMap((payload: any) => {
      const updateProjectResponse = payload[1];
      if (
        updateProjectResponse.body &&
        updateProjectResponse.body.data &&
        updateProjectResponse.body.data.id
      ) {
        this.toastrService.success(
          this.translateService.instant('notification.post.projects.success')
        );
        return of(
          new fromProjectAction.UpdateProjectSuccess({
            id: updateProjectResponse.body.data.id,
          })
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.projects.error')
        );
        return of(
          new fromProjectAction.UpdateProjectFailed(updateProjectResponse)
        );
      }
    })
  );

  @Effect({ dispatch: false })
  updateProjectSuccess$ = this.actions$.pipe(
    ofType(fromProjectAction.ProjectActionTypes.UpdateProjectSuccess),
    map((action: fromProjectAction.UpdateProjectSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['projects', payload.id]);
    })
  );

  @Effect()
  createProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectAction.ProjectActionTypes.CreateProject),
    map((action: fromProjectAction.CreateProject) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.projectService.createProject({
          project: this.projectMappingService.projectVMToResponse(
            payload.project
          ),
        }),
      ])
    ),
    switchMap((payload) => {
      const originalPayload = payload[0];
      const createProjectResponse = payload[1];
      let newDocRequest: Observable<any>[] = [of([])];
      if (
        createProjectResponse &&
        createProjectResponse.status === 201 &&
        createProjectResponse.body &&
        createProjectResponse.body.data
      ) {
        const projectId = createProjectResponse.body.data.id;
        newDocRequest = originalPayload.newDocuments.map((a) =>
          this.projectService.createProjectDocument({
            projectId: Number(projectId),
            document: { ...a, project_id: projectId, document_id: a.id },
          })
        );
      }
      return forkJoin([
        of(originalPayload),
        of(createProjectResponse),
        ...newDocRequest,
      ]);
    }),
    switchMap((payload: any) => {
      const createProjectResponse = payload[1];
      if (
        createProjectResponse.body &&
        createProjectResponse.body.data &&
        createProjectResponse.body.data.id
      ) {
        this.toastrService.success(
          this.translateService.instant('notification.post.projects.success')
        );
        return of(
          new fromProjectAction.CreateProjectSuccess({
            id: createProjectResponse.body.data.id,
          })
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.projects.error')
        );
        return of(
          new fromProjectAction.CreateProjectFailed(createProjectResponse)
        );
      }
    })
  );

  @Effect({ dispatch: false })
  createProjectSuccess$ = this.actions$.pipe(
    ofType(fromProjectAction.ProjectActionTypes.CreateProjectSuccess),
    map((action: fromProjectAction.CreateProjectSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['projects', payload.id]);
    })
  );


  @Effect()
  deleteProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectAction.ProjectActionTypes.DeleteProject),
    withLatestFrom(
      this.store.select(fromProject.getSearchModel),
      (action: fromProjectAction.DeleteProject, model: ProjectSearchVM) => {
        return {
          id: action.payload,
          searchModel: model
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([this.projectService.deleteProject(payload.id), of(payload.searchModel)])
    ),
    switchMap((payload: any) => {
      if (payload[0].status === 204) {
        return of(new fromProjectAction.LoadProjectList(payload[1]));
      } else {
        return of(new fromProjectAction.LoadProjectList(payload[1]));
      }
    })
  );
}
