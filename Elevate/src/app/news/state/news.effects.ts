import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { NewsAction } from './news.actions';
import { map, mergeMap } from 'rxjs/operators';
import { NewsService } from '../../services/news.service';
import { NewsList } from '../model/newsList';
@Injectable()
export class NewsEffects {

  agentList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsAction.agentList),
      mergeMap(({ agent }) => this.newsSvc.agentList(agent)),
      map((lists: NewsList) => NewsAction.agentListSuccess({ lists }))
    )
  );

  loadNewsJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsAction.loadNewsJobs),
      mergeMap(({ jobs }) => this.newsSvc.jobList(jobs)),
      map((lists: any) => NewsAction.loadNewsJobsSuccess ({ lists }))
    )
  );

  loadFreelancers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsAction.loadNewsFreelancer),
      mergeMap(({ params }) => this.newsSvc.freelancer(params)),
      map((lists: any) => NewsAction.loadNewsFreelancerSuccess({ lists }))
    )
  );

  loadMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsAction.loadMessage),
      mergeMap(({ msg }) => this.newsSvc.message(msg)),
      map((lists: any) => NewsAction.loadMessageSuccess({ lists }))
    )
  );

  loadNewsLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsAction.newsList),
      mergeMap(({ params }) => this.newsSvc.loadNews(params)),
      map((lists: any) => NewsAction.newsListSuccess({ lists }))
    )
  );

  sendAnswer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsAction.sendAnswer),
      mergeMap(({ param, params }) => this.newsSvc.sendAnswer( param, params )),
      map((lists: any) => NewsAction.sendAnswerSuccess({ lists }))
    )
  );

  deleteTender$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsAction.removeTender),
      mergeMap(({ questionId }) => this.newsSvc.removeTender( questionId )),
      map((questionId: any) => NewsAction.removeTenderSuccess({ questionId }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private http: HttpClient,
    private newsSvc: NewsService
  ) {}
}
