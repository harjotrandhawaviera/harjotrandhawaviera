import * as fromBudget from './index';
import * as fromBudgetAction from './budget.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  catchError,
  map,
  switchMap
} from 'rxjs/operators';

import { BudgetMappingService } from '../../services/mapping-services';
import { BudgetResponse } from '../../model/budget.response';
import { BudgetService } from '../../services/budget.service';
import { Injectable } from '@angular/core';
import { MultipleResponse } from './../../model/response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from '../../services/user.service';

@Injectable()
export class BudgetEffect {
  constructor(
    private budgetService: BudgetService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService,
    private store: Store<fromBudget.State>,
    private actions$: Actions,
    private budgetMappingService: BudgetMappingService
  ) { }

  @Effect()
  loadCertificateList$: Observable<Action> = this.actions$.pipe(
    ofType(fromBudgetAction.BudgetActionTypes.LoadBudgetList),
    map((action: fromBudgetAction.LoadBudgetList) => action.payload),
    switchMap((payload) =>
      this.budgetService
        .getBudgets(this.budgetMappingService.searchRequest(payload))
        .pipe(
          map((budgetRes: MultipleResponse<BudgetResponse>) => {
            return new fromBudgetAction.LoadBudgetListSuccess(
              this.budgetMappingService.budgetMultipleResponseToVM(
                budgetRes
              )
            );
          }),
          catchError((err) =>
            of(new fromBudgetAction.LoadBudgetListFailed(err))
          )
        )
    )
  );
}
