import * as fromUser from './index';
import * as fromUserAction from './user.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultipleResponse, SingleResponse } from './../../model/response';
import { Observable, forkJoin, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AgentResponse } from '../../model/agent.response';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserMappingService } from '../services/user-mapping.service';
import { UserResponse } from '../../model/user.response';
import { UserSearchVM } from '../models/user.model';
import { UsersService } from '../../services/users.service';

@Injectable()
export class UserEffect {
  constructor(
    private usersService: UsersService,
    private actions$: Actions,
    private router: Router,
    private store: Store<fromUser.State>,
    private userMappingService: UserMappingService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {}

  @Effect()
  loadUserList$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.LoadUserList),
    map((action: fromUserAction.LoadUserList) => action.payload),
    switchMap((payload) =>
      this.usersService
        .getUsers(this.userMappingService.searchRequest(payload))
        .pipe(
          map((userRes: MultipleResponse<UserResponse>) => {
            return new fromUserAction.LoadUserListSuccess(
              this.userMappingService.searchResponseToVM(userRes)
            );
          }),
          catchError((err) => of(new fromUserAction.LoadUserListFailed(err)))
        )
    )
  );

  @Effect()
  deleteUser$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.DeleteUser),
    withLatestFrom(
      this.store.select(fromUser.getSearchModel),
      (action: fromUserAction.DeleteUser, model: UserSearchVM) => {
        return {
          id: action.payload,
          searchModel: model,
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([
        this.usersService.deleteUser(payload.id),
        of(payload.searchModel),
      ])
    ),
    switchMap((payload: any) => {
      if (payload[0].status === 204) {
        this.toastrService.success(
          this.translateService.instant('notification.delete.users.success')
        );
        return of(new fromUserAction.LoadUserList(payload[1]));
      } else {
        this.toastrService.success(
          this.translateService.instant('notification.delete.users.success')
        );
        return of(new fromUserAction.LoadUserList(payload[1]));
      }
    })
  );

  // @Effect()
  // createUser$: Observable<Action> = this.actions$.pipe(
  //   ofType(fromUserAction.UserActionTypes.CreateUser),
  //   map((action: fromUserAction.CreateUser) => action.payload),
  //   switchMap((payload) =>
  //     forkJoin([
  //       of(payload),
  //       this.usersService.createUser({
  //         user: this.userMappingService.userVMToResponse(payload.user),
  //       }),
  //     ])
  //   ),
  //   switchMap((payload) =>
  //     this.usersService
  //       .updateAgent({
  //         id: payload[1].body?.data?.agent.data.id,
  //         agent: this.userMappingService.agentVMToResponse(payload[0].user),
  //       })
  //       .pipe(
  //         map((res: HttpResponse<SingleResponse<AgentResponse>>) => {
  //           if (res.body && res.body.data && res.body.data.id) {
  //             this.toastrService.success(
  //               this.translateService.instant('notification.post.users.success')
  //             );
  //             return new fromUserAction.CreateUserSuccess({
  //               id: res.body.data.id,
  //             });
  //           } else {
  //             this.toastrService.error(
  //               this.translateService.instant('notification.post.users.error')
  //             );
  //             return new fromUserAction.CreateUserFailed(res);
  //           }
  //         }),
  //         catchError((err) => of(new fromUserAction.CreateUserFailed(err)))
  //       )
  //   )
  // );

  @Effect()
  createUser$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.CreateUser),
    map((action: fromUserAction.CreateUser) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.usersService.createUser({
          user: this.userMappingService.userVMToResponse(payload.user),
        }),
      ])
    ),
    switchMap((payload) => {
      if ((payload[1].status === 201 || payload[1].status === 200) && payload[1].body?.data?.id) {
        return forkJoin([
          of(payload[0]),
          of(payload[1]),
          this.usersService.updateAgent({
            id: payload[1].body?.data?.agent.data.id,
            agent: this.userMappingService.agentVMToResponse(payload[0].user),
          }),
        ]);
      } else {
        return forkJoin([of(payload[0]), of(payload[1]), of(null)]);
      }
    }),
    switchMap((payload: any) => {
      if (payload[1].status === 201 || payload[1].status === 200) {
        this.toastrService.success(
          this.translateService.instant('notification.post.users.success')
        );
        return of(new fromUserAction.CreateUserSuccess({ id: payload.id }));
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.users.error')
        );
        return of(new fromUserAction.CreateUserFailed(payload));
      }
    })
  );

  @Effect()
  loadUserDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.LoadUserDetail),
    map((action: fromUserAction.LoadUserDetail) => action.payload),
    switchMap((payload) =>
      this.usersService
        .getUserById(this.userMappingService.getByIdRequest(payload))
        .pipe(
          map((userRes: SingleResponse<UserResponse>) => {
            if (userRes?.data) {
              return new fromUserAction.LoadUserDetailSuccess(
                this.userMappingService.userResponseToVM(userRes.data)
              );
            } else {
              return new fromUserAction.LoadUserDetailFailed(userRes);
            }
          }),
          catchError((err) => of(new fromUserAction.LoadUserDetailFailed(err)))
        )
    )
  );

  @Effect()
  loadBlockedByUser$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.LoadBlockedByUser),
    map((action: fromUserAction.LoadBlockedByUser) => action.payload),
    switchMap((payload) =>
      this.usersService
        .getUserById(this.userMappingService.getByIdRequest(payload))
        .pipe(
          map((userRes: SingleResponse<UserResponse>) => {
            if (userRes?.data) {
              return new fromUserAction.LoadBlockedByUserSuccess(
                this.userMappingService.userResponseToVM(userRes.data)
              );
            } else {
              return new fromUserAction.LoadBlockedByUserFailed(userRes);
            }
          }),
          catchError((err) =>
            of(new fromUserAction.LoadBlockedByUserFailed(err))
          )
        )
    )
  );

  @Effect()
  DeactivateUser$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.DeactivateUser),
    map((action: fromUserAction.DeactivateUser) => action.payload),
    switchMap((payload) =>
      this.usersService.deactivateUser(payload.id, payload.reason).pipe(
        map((userRes: HttpResponse<SingleResponse<UserResponse>>) => {
          if (userRes?.body?.data) {
            this.toastrService.success(
              this.translateService.instant(
                'notification.post.users-deactivate.success'
              )
            );
            return new fromUserAction.LoadUserDetailSuccess(
              this.userMappingService.userResponseToVM(userRes.body.data)
            );
          } else {
            return new fromUserAction.DeactivateUserFailed(userRes);
          }
        }),
        catchError((err) => of(new fromUserAction.DeactivateUserFailed(err)))
      )
    )
  );

  @Effect()
  ActivateUser$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.ActivateUser),
    map((action: fromUserAction.ActivateUser) => action.payload),
    switchMap((payload) =>
      this.usersService.activateUser(payload).pipe(
        map((userRes: SingleResponse<UserResponse>) => {
          if (userRes?.data) {
            this.toastrService.success(
              this.translateService.instant(
                'notification.post.users-reactivate.success'
              )
            );
            return new fromUserAction.LoadUserDetailSuccess(
              this.userMappingService.userResponseToVM(userRes?.data)
            );
          } else {
            return new fromUserAction.ActivateUserFailed(userRes);
          }
        }),
        catchError((err) => of(new fromUserAction.ActivateUserFailed(err)))
      )
    )
  );

  @Effect()
  DisableUser$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.DisableUser),
    map((action: fromUserAction.DisableUser) => action.payload),
    switchMap((payload) =>
      this.usersService.disableUser(payload.id, payload.reason).pipe(
        map((userRes: HttpResponse<SingleResponse<UserResponse>>) => {
          if (userRes?.body?.data) {
            this.toastrService.success(
              this.translateService.instant(
                'notification.post.users-disable.success'
              )
            );
            return new fromUserAction.LoadUserDetailSuccess(
              this.userMappingService.userResponseToVM(userRes.body.data)
            );
          } else {
            return new fromUserAction.DisableUserFailed(userRes);
          }
        }),
        catchError((err) => of(new fromUserAction.DisableUserFailed(err)))
      )
    )
  );

  @Effect()
  EnableUser$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.EnableUser),
    map((action: fromUserAction.EnableUser) => action.payload),
    switchMap((payload) =>
      this.usersService.enableUser(payload).pipe(
        map((userRes: SingleResponse<UserResponse>) => {
          if (userRes?.data) {
            this.toastrService.success(
              this.translateService.instant(
                'notification.post.users-enable.success'
              )
            );
            return new fromUserAction.LoadUserDetailSuccess(
              this.userMappingService.userResponseToVM(userRes?.data)
            );
          } else {
            return new fromUserAction.EnableUserFailed(userRes);
          }
        }),
        catchError((err) => of(new fromUserAction.EnableUserFailed(err)))
      )
    )
  );

  @Effect({ dispatch: false })
  CreateUserSuccess$ = this.actions$.pipe(
    ofType(fromUserAction.UserActionTypes.CreateUserSuccess),
    map((action: fromUserAction.CreateUserSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['administration/users']);
    })
  );
}
