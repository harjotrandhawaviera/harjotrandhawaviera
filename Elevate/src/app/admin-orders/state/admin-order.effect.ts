import * as fromOrder from './index';
import * as fromOrderAction from './admin-order.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  catchError,
  map,
  switchMap
} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { MultipleResponse } from './../../model/response';
import { OrderMappingService } from '../../services/mapping-services';
import { OrderResponse } from '../../model/order.response';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from '../../services/user.service';

@Injectable()
export class AdminOrderEffect {
  constructor(
    private orderService: OrderService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService,
    private store: Store<fromOrder.State>,
    private actions$: Actions,
    private orderMappingService: OrderMappingService
  ) { }

  @Effect()
  loadCertificateList$: Observable<Action> = this.actions$.pipe(
    ofType(fromOrderAction.AdminOrderActionTypes.LoadOrderList),
    map((action: fromOrderAction.LoadOrderList) => action.payload),
    switchMap((payload) =>
      this.orderService
        .getOrders(this.orderMappingService.searchRequest(payload))
        .pipe(
          map((orderRes: MultipleResponse<OrderResponse>) => {
            return new fromOrderAction.LoadOrderListSuccess(
              this.orderMappingService.orderMultipleResponseToVM(
                orderRes
              )
            );
          }),
          catchError((err) =>
            of(new fromOrderAction.LoadOrderListFailed(err))
          )
        )
    )
  );
}
