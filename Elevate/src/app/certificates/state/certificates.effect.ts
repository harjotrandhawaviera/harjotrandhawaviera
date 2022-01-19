import * as fromCertificate from './index';
import * as fromCertificateAction from './certificates.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, forkJoin, of } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';

import { CertificateMappingService } from '../../services/mapping-services';
import { CertificateResponse } from '../../model/certificate.response';
import { CertificateSearchVM } from '../../model/certificate.model';
import { CertificateService } from '../../services/certificate.service';
import { FreelancerService } from './../../services/freelancer.service';
import { Injectable } from '@angular/core';
import { MultipleResponse } from './../../model/response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from '../../services/user.service';
import { UsersService } from '../../services/users.service';

@Injectable()
export class CertificateEffect {
  constructor(
    private certificateService: CertificateService,
    private freelancerService: FreelancerService,
    private toastrService: ToastrService,
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService,
    private store: Store<fromCertificate.State>,
    private actions$: Actions,
    private certificateMappingService: CertificateMappingService
  ) { }

  @Effect()
  loadCertificateList$: Observable<Action> = this.actions$.pipe(
    ofType(fromCertificateAction.CertificateActionTypes.LoadCertificateList),
    map((action: fromCertificateAction.LoadCertificateList) => action.payload),
    switchMap((payload) =>
      this.freelancerService
        .getFreelancerCertificates(this.userService.user().roleId(), this.certificateMappingService.searchRequest(payload))
        .pipe(
          map((certificateRes: MultipleResponse<CertificateResponse>) => {
            return new fromCertificateAction.LoadCertificateListSuccess(
              this.certificateMappingService.certificateMultipleResponseToVM(
                certificateRes
              )
            );
          }),
          catchError((err) =>
            of(new fromCertificateAction.LoadCertificateListFailed(err))
          )
        )
    )
  );

}
