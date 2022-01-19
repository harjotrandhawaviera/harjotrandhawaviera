import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NewsAction } from './news.actions';
import { fromNews } from './news.selector';
import { NewsState } from './news.reducer';
@Injectable({
  providedIn: 'root'
})

export class NewsFacade {
  constructor(private store: Store<NewsState>) {}
  getAgentList$ = this.store.select(fromNews.getAgentList);
  getNewsJobs$ = this.store.select(fromNews.getNewsJob);
  getFreelancersList$ = this.store.select(fromNews.getFreelancer);
  getNewsList$ = this.store.select(fromNews.getNewsList);
  getSendAns$ = this.store.select(fromNews.getSendAns);

  agentLoad() {
    const agent = '/agents?limit=100000&include=user&only_active=true&only_fields=agent.id,agent.lastname,agent.firstname,user.id';
    this.store.dispatch(NewsAction.agentList({ agent }));
  }
  job() {
    const jobs = '/jobs?limit=100000&order_by=title&&only_fields=job.id,job.title';
    this.store.dispatch(NewsAction.loadNewsJobs({ jobs }));
  }
  freelancersLoad() {
    const params = '/freelancers?limit=100000&only_approved=true&include=user&only_fields=freelancer.id,freelancer.lastname,freelancer.firstname,freelancer.zip,freelancer.city,user.id,user.status';
    this.store.dispatch(NewsAction.loadNewsFreelancer({ params }));
  }
  newsLoading() {
    const msg = '/jobs/messages?limit=24&page=1&include=question,sender,recipient&order_by=created_at&order_dir=desc';
    this.store.dispatch(NewsAction.loadMessage({ msg }));
  }
  newsList(
    data?:
      {
        agent_id?: number,
        job_id?: number;
        sender_id?: number,
        search?: any
      }
  ) {
    let params = '/jobs/messages?limit=24&page=1&include=question,sender,recipient&order_by=created_at&order_dir=desc';
    if (data?.agent_id) {
      params += '&agent_id=' + data?.agent_id;
    }
    if (data?.job_id) {
      params += '&job_id=' + data.job_id;
    }
    if (data?.sender_id) {
      params += '&sender_id=' + data?.sender_id;
    }
    if (data?.search) {
      params += '&search=' + data?.search;
    }
    this.store.dispatch(NewsAction.newsList({ params }));
  }

  sendAnswerValue(paramId: number, params: any) {
    let param = '';
    if (paramId) {
      param = '/jobs/' + paramId + '/messages';
    }
    this.store.dispatch(NewsAction.sendAnswer({ param, params }));
  }

  removeTender(qId: number) {
    this.store.dispatch(NewsAction.removeTender({ questionId: qId }));
  }
}

