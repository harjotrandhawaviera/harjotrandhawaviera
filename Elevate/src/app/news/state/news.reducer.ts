import { Action, createReducer, on } from '@ngrx/store';
import { NewsAction } from './news.actions';
import { NewsList } from '../model/newsList';

export const featureKey = 'news';

// tslint:disable-next-line:no-empty-interface
export interface NewsState {
agentList: NewsList | NewsList[];
newsJobs: NewsList | NewsList[];
freelancers: NewsList | NewsList[];
message: NewsList | NewsList[];
loadNews: NewsList | NewsList[];
sendAns: NewsList | NewsList[];
}

export interface NewsAppState {
  [featureKey]: NewsState;
}

export const initialState: NewsState = {
  agentList: [],
  newsJobs: [],
  freelancers: [],
  message: [],
  loadNews: [],
  sendAns: []
};

export const newsReducer = createReducer<NewsState>(
  initialState,
  on(NewsAction.agentList, (state,  { agent } ) => ({
    ...state,
    loading: true
  })),
  on(NewsAction.agentListSuccess, (state,  { lists} ) => ({
    ...state,
    agentList: lists,
    loading: false
  })),
  on(NewsAction.loadNewsJobs, (state,  { jobs } ) => ({
    ...state,
    loading: true
  })),
  on(NewsAction.loadNewsJobsSuccess, (state, { lists} ) => ({
    ...state,
    newsJobs: lists,
    loading: false
  })),
  on(NewsAction.loadNewsFreelancer, (state, { params } ) => ({
    ...state,
    loading: true
  })),
  on(NewsAction.loadNewsFreelancerSuccess, (state, { lists } ) => ({
    ...state,
    loading: false,
    freelancers: lists
  })),
  on(NewsAction.loadMessage, (state,  { msg } ) => ({
    ...state,
    loading: true
  })),
  on(NewsAction.loadMessageSuccess, (state, { lists} ) => ({
    ...state,
    message: lists,
    loading: false
  })),
  on(NewsAction.newsList, (state, { params } ) => ({
    ...state,
    loading: true
  })),
  on(NewsAction.newsListSuccess, (state, { lists } ) => ({
    ...state,
    loading: false,
    loadNews: lists
  })),
  on(NewsAction.sendAnswer, (state, { param }) => ({
    ...state,
    loading: true
  })),
  on(NewsAction.sendAnswerSuccess, (state, { lists }) => ({
    ...state,
    loading: false,
    sendAns: lists
  })),
  on(NewsAction.removeTenderSuccess, (state, { questionId }) => ({
    ...state,
    loading: false
  })),
);

// tslint:disable-next-line:typedef
export function reducer(state: NewsState | undefined, action: Action) {
  return newsReducer(state, action);
}
