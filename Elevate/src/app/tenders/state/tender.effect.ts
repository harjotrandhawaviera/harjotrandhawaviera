import * as fromTender from './index';
import * as fromTenderAction from './tender.actions';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultipleResponse, SingleResponse } from './../../model/response';
import { Observable, forkJoin, of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { AssignmentMappingService } from '../../services/mapping-services/assignment-mapping.service';
import { AssignmentResponse } from '../../model/assignment.response';
import { AssignmentService } from '../../services/assignment.service';
import { Injectable } from '@angular/core';
import { OfferMappingService } from '../../services/mapping-services/offer-mapping.service';
import { OfferServices } from '../../services/mapping-services/offer.services';
import { Router } from '@angular/router';
import { TenderMappingService } from '../../services/mapping-services/tender-mapping.service';
import { TenderResponse } from '../../model/tender.response';
import { TenderSearchVM } from '../../model/tender.model';
import { TenderService } from '../../services/tender.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';

@Injectable()
export class TenderEffect {
  constructor(
    private tenderService: TenderService,
    private assignmentService: AssignmentService,
    private actions$: Actions,
    private store: Store<fromTender.State>,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private tenderMappingService: TenderMappingService,
    private assignmentMappingService: AssignmentMappingService,
    private offerservice: OfferServices,
    private offerMappingService: OfferMappingService,
    private router: Router,
  ) {}

  @Effect()
  loadTenderList$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadTenderList),
    map((action: fromTenderAction.LoadTenderList) => action.payload),
    switchMap((payload) =>
      this.tenderService
        .getTenders(this.tenderMappingService.searchRequest(payload.search))
        .pipe(
          map((res: MultipleResponse<TenderResponse>) => {
            return new fromTenderAction.LoadTenderListSuccess(
              this.tenderMappingService.tenderSearchResponseToVM(res)
            );
          }),
          catchError((err) => of(new fromTenderAction.LoadTenderListFailed(err)))
        )
    )
  );

  @Effect()
  deleteTender$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.DeleteTender),
    withLatestFrom(
      this.store.select(fromTender.getSearchModel),
      (action: fromTenderAction.DeleteTender, model: TenderSearchVM) => {
        return {
          id: action.payload.id,
          role_id: action.payload.role_id,
          searchModel: model,
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([
        this.tenderService.deleteTender(payload.id, payload.role_id).pipe(
          map((res) => res),
          catchError(async (err) => {
            this.toastrService.error(
              '<b>' +
                this.translateService.instant(
                  'notification.delete.jobs.error'
                ) +
                '</b>' +
                '<br/>' +
                err.error.message
            );
          })
        ),
        of(payload.searchModel),
      ])
    ),
    switchMap((payload: any) => {
      if (payload[0] && payload[0].status === 204) {
        this.toastrService.success(
          this.translateService.instant(
            'notification.delete.tenders.success'
          )
        );
        return of(new fromTenderAction.LoadTenderList({ search: payload[1] }));
      } else {
        this.toastrService.success(
          this.translateService.instant(
            'notification.delete.tenders.error'
          )
        );
        return of(new fromTenderAction.DeleteTenderFailed(payload[0]));
      }
    })
  );

  @Effect()
  loadTenderDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadTenderDetail),
    map((action: fromTenderAction.LoadTenderDetail) => action.payload),
    switchMap((payload) =>
      this.tenderService
        .getAdvertisementById(payload.id, payload.role_id, this.tenderMappingService.getByIdRequest(payload.id, payload.mode))
        .pipe(
          map((res: SingleResponse<TenderResponse>) => {
            if (res?.data) {
              return new fromTenderAction.LoadTenderDetailSuccess(
                this.tenderMappingService.tenderResponseToVM(res.data)
              );
            } else {
              return new fromTenderAction.LoadTenderDetailFailed(res);
            }
          }),
          catchError((err) => of(new fromTenderAction.LoadTenderDetailFailed(err)))
        )
    )
  );

  @Effect()
  loadTenderDetailWithLogs$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadTenderDetailWithLogs),
    map((action: fromTenderAction.LoadTenderDetailWithLogs) => action.payload),
    switchMap((payload) =>
      this.tenderService
        .getTenderById(this.tenderMappingService.getByIdRequest(payload.id, payload.mode))
        .pipe(
          map((res: SingleResponse<TenderResponse>) => {
            if (res?.data) {
              return new fromTenderAction.LoadTenderDetailSuccess(
                this.tenderMappingService.tenderResponseToVM(res.data)
              );
            } else {
              return new fromTenderAction.LoadTenderDetailFailed(res);
            }
          }),
          catchError((err) => of(new fromTenderAction.LoadTenderDetailFailed(err)))
        )
    )
  );

  @Effect()
  loadAssignmentDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadAssignmentDetail),
    map((action: fromTenderAction.LoadAssignmentDetail) => action.payload),
    switchMap((payload) =>
      this.assignmentService
        .getAssignmentById(
          this.assignmentMappingService.getByIdRequest(payload)
        )
        .pipe(
          map((res: SingleResponse<AssignmentResponse>) => {
            if (res?.data) {
              return new fromTenderAction.LoadAssignmentDetailSuccess(
                this.assignmentMappingService.assignmentResponseToVM(res.data)
              );
            } else {
              return new fromTenderAction.LoadAssignmentDetailFailed(res);
            }
          }),
          catchError((err) =>
            of(new fromTenderAction.LoadAssignmentDetailFailed(err))
          )
        )
    )
  );

  @Effect()
  CreateJobTenders$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.CreateTenders),
    map((action: fromTenderAction.CreateTenders) => action.payload),
    switchMap((payload) =>
      forkJoin([
        of(payload),
        this.tenderService.createTender({tender: payload.tender}),
      ])
    ),
    switchMap((payload: any) => {
      if (
        payload[1].status === 201 ||
        (payload[1].body && payload[1].body.data && payload[1].body.data.id)
      ) {
        this.toastrService.success(
          this.translateService.instant('notification.post.tenders.success')
        );
        return of(
          new fromTenderAction.CreateTendersSuccess({
            id: payload[1].body.data.id
          })
        );
      } else {
        this.toastrService.error(
          this.translateService.instant('notification.post.tenders.error')
        );
        return of(new fromTenderAction.CreateTendersFailed({}));
      }
    })
  );

  @Effect({ dispatch: false })
  CreateTendersSuccess$ = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.CreateTendersSuccess),
    map((action: fromTenderAction.CreateTendersSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['/tenders', payload.id]);
    })
  );
  @Effect()
  loadOffer$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadOffer),
    mergeMap((action: any) =>
      this.tenderService.getOffers(action?.payload?.search).pipe(map(Offers => (new fromTenderAction.LoadOfferSuccess({ data: Offers })))
      )
    )
  );
  @Effect()
  loadFreelancerOffer$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadFreelancerOffer),
    mergeMap((action: any) =>
      this.tenderService.getFreelancerOffers(action?.payload?.search).pipe
      (map(FreelancerOffers => (new fromTenderAction.LoadFreelancerTMOfferSuccess({ data: FreelancerOffers })))
      )
    )
  );
  @Effect()
  loadFreelancerOfferDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadFreelancerOfferDetail),
    mergeMap((action: any ) =>
      this.tenderService.getFreelancerOfferDetail(action?.payload?.id).pipe
      (map(FreelancerOfferDetail => (new fromTenderAction.LoadFreelancerOfferDetailSuccess({data: FreelancerOfferDetail}))))
    )
  );

  @Effect()
  loadAdminOfferDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadAdminOfferDetail),
    mergeMap((action: any ) => {
      return this.tenderService.confirmOffer(action?.payload).pipe
      (map(FreelancerOfferDetail => (new fromTenderAction.LoadAdminOfferDetailSuccess({data: FreelancerOfferDetail}))))
    }
    )
  );

  @Effect()
  loadAdminOfferRejectDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadAdminOfferRejectDetail),
    mergeMap((action: any ) => {
        return this.tenderService.rejectOffer(action?.payload).pipe
        (map(FreelancerOfferRejectDetail => (new fromTenderAction.LoadAdminOfferRejectDetailSuccess({data: FreelancerOfferRejectDetail}))))
      }
    )
  );

  @Effect()
  loadAdminFreelancer$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.LoadAdminFreelancer),
    mergeMap((action: any ) => {
        return this.tenderService.adminFreelancerData(action?.payload).pipe
        (map(AdminFreelancer => (new fromTenderAction.LoadAdminFreelancerSuccess({data: AdminFreelancer}))))
      }
    )
  );

  @Effect()
  CreateShortlist$: Observable<Action> = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.CreateShortlist),
    mergeMap((action: any ) => {
        return this.tenderService.createShortlist(action?.payload).pipe
        (map(CreateShortlist => (new fromTenderAction.CreateShortlistSuccess({data: CreateShortlist}))))
      }
    )
  );

  @Effect({ dispatch: false })
  createClientSuccess$ = this.actions$.pipe(
    ofType(fromTenderAction.TenderActionTypes.CreateShortlistSuccess),
    map((action: fromTenderAction.CreateShortlistSuccess) => action.data),
    tap((payload) => {
      this.router.navigate(['/tenders/offers']);
    })
  );
}
