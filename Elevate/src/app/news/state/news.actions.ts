import { createAction, props } from '@ngrx/store';
import { NewsList } from '../model/newsList';

const agentList = createAction('[news] Agent List', props<{ agent: string }>());
const agentListSuccess = createAction(
  '[news] Agent Success',
  props<{ lists: NewsList[] | NewsList }>()
);
const loadNewsJobs = createAction('[news] Load News Jobs', props<{ jobs: string }>());
const loadNewsJobsSuccess = createAction(
  '[news] Load News Jobs Success',
  props<{ lists: NewsList[] | NewsList }>()
);
const loadNewsFreelancer = createAction('[news] Load Freelancer', props<{ params: string }>());
const loadNewsFreelancerSuccess = createAction(
  '[news] Load Freelancer Success',
  props<{ lists: NewsList[] | NewsList }>()
);
const loadMessage = createAction('[news] Load Messages', props<{ msg: string }>());
const loadMessageSuccess = createAction(
  '[news] Load Messages Success',
  props<{ lists: NewsList[] | NewsList }>()
);
const newsList = createAction('[news] Load News List', props<{ params: string }>());
const newsListSuccess = createAction(
  '[news] Load News List Success',
  props<{ lists: NewsList[] | NewsList }>()
);
const sendAnswer = createAction('[news] Send Answer', props<{ param: any, params: any }>());
const sendAnswerSuccess = createAction(
  '[news] Send Answer Success',
  props<{ lists: NewsList[] | NewsList }>()
);
const removeTender = createAction('[news] Remove Tender', props<{ questionId: number }>());
const removeTenderSuccess = createAction('[news] Remove Tender Success', props<{ questionId: number }>());

export const NewsAction = {
  agentList,
  agentListSuccess,
  loadNewsJobs,
  loadNewsJobsSuccess,
  loadNewsFreelancer,
  loadNewsFreelancerSuccess,
  loadMessage,
  loadMessageSuccess,
  newsList,
  newsListSuccess,
  sendAnswer,
  sendAnswerSuccess,
  removeTender,
  removeTenderSuccess
};
