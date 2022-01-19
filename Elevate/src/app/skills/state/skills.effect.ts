import * as fromSkill from './index';
import * as fromSkillAction from './skills.actions';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  OrderMappingService,
  SkillMappingService,
} from '../../services/mapping-services';
import { SkillService } from '../../services/skill.service';

@Injectable()
export class SkillsEffect {
  constructor(
    private skillService: SkillService,
    private actions$: Actions,
    private skillMappingService: SkillMappingService
  ) {}

  @Effect()
  loadSkillList$: Observable<Action> = this.actions$.pipe(
    ofType(fromSkillAction.SkillsActionTypes.LoadSkillList),
    map((action: fromSkillAction.LoadSkillList) => action.payload),
    switchMap((payload) => {
      return this.skillService
        .getSkills(this.skillMappingService.searchRequest(payload))
        .pipe(
          map((skillRes: any) => {
            return new fromSkillAction.LoadSkillListSuccess(
              this.skillMappingService.searchResponseToVM(skillRes)
            );
          }),
          catchError((err) => of(new fromSkillAction.LoadSkillListFailed(err)))
        );
    })
  );
}
