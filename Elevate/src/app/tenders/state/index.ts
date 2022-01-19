import * as fromRoot from '../../root-state';
import * as fromTender from './tender.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  tenders: fromTender.TenderState;
}

const getTenderFeatureState = createFeatureSelector<fromTender.TenderState>('tenders');

export const getSearchModel = createSelector(
  getTenderFeatureState,
  state => state.searchModel
);
export const getLoading = createSelector(
  getTenderFeatureState,
  state => state.loading
);
export const getSearchResult = createSelector(
  getTenderFeatureState,
  state => state.resultList ? state.resultList : []
);
export const getTenderDetail = createSelector(
  getTenderFeatureState,
  state => state.tender
);
export const getTenderDetailWithLogs = createSelector(
  getTenderFeatureState,
  state => state.tenderWithLogs
);
export const getAssignmentDetail = createSelector(
  getTenderFeatureState,
  state => state.assignment
);

export const getTotalRecord = createSelector(
  getTenderFeatureState,
  state => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getTenderFeatureState,
  state => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getTenderFeatureState,
  state => (state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0)
);
export const getPageSize = createSelector(
  getTenderFeatureState,
  state => (state.pageInfo?.per_page ? state.pageInfo?.per_page : 0)
);
export const getNoRecords = createSelector(
  getTenderFeatureState,
  state => state.noRecord
);
export const getOffers = createSelector(
  getTenderFeatureState,
  state => state.offers
);
export const getOffersList = createSelector(
  getTenderFeatureState,
  state => state.offerList
)
export const getFreelancerOffers = createSelector(
  getTenderFeatureState,
  state => state.freelancerOffer
);
export const getFreelancerOffersList = createSelector(
  getTenderFeatureState,
  state => state.freelancerOfferList
);
export const getFreelancerOfferDetail = createSelector(
  getTenderFeatureState,
  state => state.freelancerOfferDetail
);
export const getAdminOfferDetail = createSelector(
  getTenderFeatureState,
    state => state.adminOfferDetail);
export const getAdminFreelancerDetail = createSelector(
  getTenderFeatureState,
  state => state.adminFreelancerDetail
);
export const createShortlist = createSelector(
  getTenderFeatureState,
  state => state.createShortlist
);
