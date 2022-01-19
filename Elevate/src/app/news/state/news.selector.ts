import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NewsState, featureKey } from './news.reducer';

export const getFeatureState = createFeatureSelector<NewsState>(featureKey);

export const fromNews = {
  getAgentList: createSelector(getFeatureState, (state) => state.agentList),
  getNewsJob: createSelector(getFeatureState, (state) => state.newsJobs),
  getFreelancer: createSelector(getFeatureState, (state) => state.freelancers),
  getMessage: createSelector(getFeatureState, (state) => state.message),
  getNewsList:  createSelector(getFeatureState, (state) => state.loadNews),
  getSendAns: createSelector(getFeatureState, (state) => state.sendAns)
};

