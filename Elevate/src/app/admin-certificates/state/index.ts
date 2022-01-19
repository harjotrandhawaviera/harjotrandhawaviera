import * as fromCertificate from './certificates.reducer';
import * as fromRoot from '../../root-state';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CertificateVM } from '../../model/certificate.model';

export interface State extends fromRoot.State {
  adminCertificates: fromCertificate.CertificateState;
}

const getCertificateFeatureState = createFeatureSelector<fromCertificate.CertificateState>(
  'admin-certificates'
);

export const getSearchModel = createSelector(
  getCertificateFeatureState,
  (state) => state.searchModel
);
export const getLoading = createSelector(
  getCertificateFeatureState,
  (state) => state.loading
);
export const getSearchResult = createSelector(
  getCertificateFeatureState,
  (state) => (state.resultList ? state.resultList : [])
);

export const getTotalRecord = createSelector(
  getCertificateFeatureState,
  (state) => state.pageInfo?.total
);
export const getCurrentPage = createSelector(
  getCertificateFeatureState,
  (state) => state.pageInfo?.current_page
);
export const getCurrentIndex = createSelector(
  getCertificateFeatureState,
  (state) =>
    state.pageInfo?.current_page ? state.pageInfo?.current_page - 1 : 0
);
export const getPageSize = createSelector(getCertificateFeatureState, (state) =>
  state.pageInfo?.per_page ? state.pageInfo?.per_page : 0
);
export const getNoRecords = createSelector(
  getCertificateFeatureState,
  (state) => state.noRecord
);
