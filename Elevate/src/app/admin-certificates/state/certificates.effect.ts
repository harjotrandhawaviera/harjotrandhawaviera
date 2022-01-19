import * as fromCertificate from './index';
import * as fromCertificateAction from './certificates.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultipleResponse, SingleResponse } from './../../model/response';
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
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
      this.certificateService
        .getCertificate(this.certificateMappingService.searchRequest(payload))
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
  @Effect()
  toggleEnabledCertificate$: Observable<Action> = this.actions$.pipe(
    ofType(fromCertificateAction.CertificateActionTypes.ToggleEnabledCertificate),
    map((action: fromCertificateAction.ToggleEnabledCertificate) => action.payload),
    switchMap(payload =>
      this.certificateService.updateCertificate(payload.id, payload).pipe(
        map((res: HttpResponse<SingleResponse<CertificateResponse>>) => {
          if (res.body?.data) {
            const obj = this.certificateMappingService.certificateResponseToVM(res.body.data);
            return new fromCertificateAction.ToggleEnabledCertificateSuccess({ id: obj.id, is_enabled: obj.is_enabled, state: obj.state });
          } else {
            return new fromCertificateAction.ToggleEnabledCertificateFailed({});
          }

        }),
        catchError((err) => of(new fromCertificateAction.ToggleEnabledCertificateFailed(err)))
      )
    )
  );
  @Effect()
  toggleRecommendationCertificate$: Observable<Action> = this.actions$.pipe(
    ofType(fromCertificateAction.CertificateActionTypes.ToggleRecommendationCertificate),
    map((action: fromCertificateAction.ToggleRecommendationCertificate) => action.payload),
    switchMap(payload =>
      this.certificateService.updateCertificate(payload.id, payload).pipe(
        map((res: HttpResponse<SingleResponse<CertificateResponse>>) => {
          if (res.body?.data) {
            const obj = this.certificateMappingService.certificateResponseToVM(res.body.data);
            return new fromCertificateAction.ToggleRecommendationCertificateSuccess({ id: obj.id, is_recommended: obj.is_recommended, state: obj.state });
          } else {
            return  new fromCertificateAction.ToggleRecommendationCertificateFailed({});
          }
        }),
        catchError((err) => of(new fromCertificateAction.ToggleRecommendationCertificateFailed(err)))
      )
    )
  );
}
