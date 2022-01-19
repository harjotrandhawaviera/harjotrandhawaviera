import * as fromInvoice from './index';
import * as fromInvoiceAction from './invoice.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  catchError,
  map,
  switchMap
} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { InvoiceMappingService } from '../../services/mapping-services';
import { InvoiceResponse } from '../../model/invoice.response';
import { InvoiceService } from '../../services/invoice.service';
import { MultipleResponse } from './../../model/response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from './../../services/user.service';

@Injectable()
export class InvoiceEffect {
  constructor(
    private invoiceService: InvoiceService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService,
    private store: Store<fromInvoice.State>,
    private actions$: Actions,
    private invoiceMappingService: InvoiceMappingService
  ) { }

  @Effect()
  loadCertificateList$: Observable<Action> = this.actions$.pipe(
    ofType(fromInvoiceAction.InvoiceActionTypes.LoadInvoiceList),
    map((action: fromInvoiceAction.LoadInvoiceList) => action.payload),
    switchMap((payload) =>

      (this.userService.user().role() === 'freelancer' ?
        this.invoiceService
          .getFreelancerInvoices(this.userService.user().roleId(), this.invoiceMappingService.searchRequest(payload)) : this.invoiceService
            .getInvoices(this.invoiceMappingService.searchRequest(payload)))
        .pipe(
          map((invoiceRes: MultipleResponse<InvoiceResponse>) => {
            return new fromInvoiceAction.LoadInvoiceListSuccess(
              this.invoiceMappingService.invoiceMultipleResponseToVM(
                invoiceRes
              )
            );
          }),
          catchError((err) =>
            of(new fromInvoiceAction.LoadInvoiceListFailed(err))
          )
        )
    )
  );
}
