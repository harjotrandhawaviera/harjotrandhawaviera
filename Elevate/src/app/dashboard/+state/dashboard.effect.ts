import { Injectable } from '@angular/core';
import { DashboardAction } from './dashboard.action';
import { DashboardResponse, NewsList } from '../../model/dashboard.model';
import { map, mergeMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from '../../services/dashboard.service';

@Injectable()
export class DashboardEffect {
  constructor(private actions$: Actions, private dashboardService: DashboardService) { }
  loadDashboardAttendance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardAttendance),
      mergeMap(({ attend }) => this.dashboardService.dashboardAttendList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardAttendanceSuccess({ list }))
    )
  );

  loadDashboardJobOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardJobOffer),
      mergeMap(({ attend }) => this.dashboardService.dashboardAttendList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardJobOfferSuccess({ list }))
    )
  );

  loadDashboardOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardOffers),
      mergeMap(({ offer }) => this.dashboardService.dashboardOfferList(offer)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardOffersSuccess({ list }))
    )
  );

  oadDashboardChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardChanges),
      mergeMap(({ change }) => this.dashboardService.dashboardChangeList(change)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardChangeSuccess({ list }))
    )
  );

  oadDashboardTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardTask),
      mergeMap(({ task }) => this.dashboardService.dashboardTaskList(task)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardTaskSuccess({ list }))
    )
  );

  loadMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadMessage),
      mergeMap(({ msg }) => this.dashboardService.message(msg)),
      map((lists: any) => DashboardAction.loadMessageSuccess({ lists }))
    )
  );

  newsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.newsList),
      mergeMap(({ msg }) => this.dashboardService.message(msg)),
      map((lists: any) => DashboardAction.newsListSuccess({ lists }))
    )
  );

  deleteTender$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.removeTender),
      mergeMap(({ questionId }) => this.dashboardService.removeTender(questionId)),
      map((questionId: any) => DashboardAction.removeTenderSuccess({ questionId }))
    )
  );

  oadDashboardCon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardConsultants),
      mergeMap(({ cons }) => this.dashboardService.dashboardConList(cons)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardConsultantsSuccess({ list }))
    )
  );
  DashboardChangeRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardOnBoarding),
      mergeMap(({ onboard }) => this.dashboardService.dashboardConList(onboard)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardOnBoardingSuccess({ list }))
    )
  );
  DashboardCurrentJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardCurrentJobs),
      mergeMap(({ jobs }) => this.dashboardService.dashboardConList(jobs)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardCurrentJobsSuccess({ list }))
    )
  );
  loadDashboardProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardProject),
      mergeMap(({ attend }) => this.dashboardService.dashboardAttendList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardProjectSuccess({ list }))
    )
  );
  loadDashboardJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardJobs),
      mergeMap(({ attend }) => this.dashboardService.dashboardAttendList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardJobsSuccess({ list }))
    )
  );
  loadDashboardContract$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardContract),
      mergeMap(({ attend }) => this.dashboardService.dashboardAttendList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardContractSuccess({ list }))
    )
  );
  loadDashboardCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardCertificate),
      mergeMap(({ attend }) => this.dashboardService.dashboardCertificateList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardCertificateSuccess({ list }))
    )
  );
  loadDashboardUnsuitableJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardUnsuitableJob),
      mergeMap(({ attend }) => this.dashboardService.dashboardUnsuitableJobList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardUnsuitableJobSuccess({ list }))
    )
  );
  loadDashboardJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadJDashboardSuitableJob),
      mergeMap(({ attend }) => this.dashboardService.dashboardSuitableJobList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadJDashboardSuitableJobSuccess({ list }))
    )
  );
  loadDashboardInvitedJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardInviteJob),
      mergeMap(({ attend }) => this.dashboardService.dashboardInvitedJobList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardInviteJobSuccess({ list }))
    )
  );
  loadDashboardAssignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardAssignment),
      mergeMap(({ attend }) => this.dashboardService.dashboardAssignmentList(attend)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardAssignmentSuccess({ list }))
    )
  );
  loadDashboardUnconfirmedAttendance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAction.loadDashboardUnconfirmedAttendance),
      mergeMap(({ attends }) => this.dashboardService.dashboardUnconfirmedAttendance(attends)),
      map((list: DashboardResponse | DashboardResponse[]) => DashboardAction.loadDashboardUnconfirmedAttendanceSuccess({ list }))
    )
  );
}
