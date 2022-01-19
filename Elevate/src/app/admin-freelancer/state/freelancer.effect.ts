import * as fromFreelancer from './index';
import * as fromFreelancerAction from './freelancer.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, forkJoin, of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';

import { FreelancerMappingService } from '../../services/mapping-services';
import { FreelancerResponse } from '../../model/freelancer.response';
import { FreelancerSearchVM } from '../../model/freelancer.model';
import { FreelancerService } from '../../services/freelancer.service';
import { Injectable } from '@angular/core';
import { MultipleResponse } from './../../model/response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from '../../services/user.service';
import { UsersService } from '../../services/users.service';
import { FilterService } from '../../services/filter.service';

@Injectable()
export class FreelancerEffect {
  constructor(
    private freelancerService: FreelancerService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private usersService: UsersService,
    private store: Store<fromFreelancer.State>,
    private actions$: Actions,
    private filterService: FilterService,
    private freelancerMappingService: FreelancerMappingService
  ) {}

  @Effect()
  loadFreelancerList$: Observable<Action> = this.actions$.pipe(
    ofType(fromFreelancerAction.FreelancerActionTypes.LoadFreelancerList),
    map((action: fromFreelancerAction.LoadFreelancerList) => action.payload),
    switchMap((payload) =>
      this.freelancerService
        .getFreelancers(this.freelancerMappingService.searchRequest(payload))
        .pipe(
          map((freelancerRes: MultipleResponse<FreelancerResponse>) => {
            return new fromFreelancerAction.LoadFreelancerListSuccess(
              this.freelancerMappingService.freelancerSearchResponseToVM(
                freelancerRes
              )
            );
          }),
          catchError((err) =>
            of(new fromFreelancerAction.LoadFreelancerListFailed(err))
          )
        )
    )
  );

  @Effect()
  deleteFreelancer$: Observable<Action> = this.actions$.pipe(
    ofType(fromFreelancerAction.FreelancerActionTypes.DeleteFreelancer),
    withLatestFrom(
      this.store.select(fromFreelancer.getSearchModel),
      (action: fromFreelancerAction.DeleteFreelancer, model: FreelancerSearchVM) => {
        return {
          id: action.payload,
          searchModel: model
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([this.usersService.deleteUser(payload.id), of(payload.searchModel)])
    ),
    switchMap((payload: any) => {
      if (payload[0].status === 204) {
        return of(new fromFreelancerAction.LoadFreelancerList(payload[1]));
      } else {
        return of(new fromFreelancerAction.LoadFreelancerList(payload[1]));
      }
    })
  );

  @Effect()
  userList$: Observable<Action> = this.actions$.pipe(
    ofType(fromFreelancerAction.FreelancerActionTypes.LoadUserList),
    mergeMap((page) => this.filterService.userList(page).pipe(
      (map(userList => (new fromFreelancerAction.LoadUserListSuccess({data: userList}))))
    ))
  );
}
