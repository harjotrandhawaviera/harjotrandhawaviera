import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, mergeMap } from 'rxjs/operators';
import { ReportAdminActions } from './report-admin.actions';
import { ReportAdminList } from '../../model/report-admin';
import { ReportAdminService } from '../../services/mapping-services/report-admin.service';

@Injectable()
export class ReportAdminEffects {
  loadFreelancer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportAdminActions.loadAdminFreelancerList),
      mergeMap(({ params }) => this.reportAdminSvc.AdminFreelancerList(params)),
      map((lists: ReportAdminList) => ReportAdminActions.loadAdminFreelancerListSuccess({ lists }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private http: HttpClient,
    private reportAdminSvc: ReportAdminService
  ) {
  }
}

