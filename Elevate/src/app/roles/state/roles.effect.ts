import * as fromRole from './index';
import * as fromRoleAction from './roles.actions';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { OrderMappingService, RoleMappingService } from '../../services/mapping-services';
import { RoleService } from '../../services/role.service';

@Injectable()
export class RolesEffect {
  constructor(
    private roleService: RoleService,
    private actions$: Actions,
    private roleMappingService: RoleMappingService
  ) {}

  @Effect()
  loadRoleList$: Observable<Action> = this.actions$.pipe(
    ofType(fromRoleAction.RolesActionTypes.LoadRoleList),
    map((action: fromRoleAction.LoadRoleList) => action.payload),
    switchMap((payload) =>
      this.roleService
        .getRoles(this.roleMappingService.searchRequest(payload))
        .pipe(
          map((roleRes: any) => {
            return new fromRoleAction.LoadRoleListSuccess(
              this.roleMappingService.searchResponseToVM(roleRes)
            );
          }),
          catchError((err) => of(new fromRoleAction.LoadRoleListFailed(err)))
        )
    )
  );
}
