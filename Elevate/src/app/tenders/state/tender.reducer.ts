import { TenderActionTypes, TenderActions, LoadOffer, LoadOfferSuccess } from './tender.actions';
import { TenderSearchVM, TenderVM } from '../../model/tender.model';

import { AssignmentVM } from '../../model/assignment.model';
import { PaginationVM } from './../../model/pagination.model';
import {OfferVM, ShortlistVM} from '../../model/offer.model';

export interface TenderState {
  searchModel?: TenderSearchVM;
  resultList?: TenderVM[];
  tender?: TenderVM;
  tenderWithLogs?: TenderVM;
  assignment?: AssignmentVM;
  offerList?: OfferVM[];
  offers?: OfferVM;
  siteIds?: number[];
  dates?: string[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
  freelancerOfferList?: OfferVM[];
  freelancerOffer?: OfferVM;
  freelancerOfferDetail?: OfferVM[];
  adminOfferDetail?: OfferVM[];
  adminFreelancerDetail?: OfferVM[];
  createShortlist?: ShortlistVM[];
}

function initialState(): TenderState {
  const stored = localStorage.getItem('tender.search');
  return {
    searchModel: stored !== null ? JSON.parse(stored) : undefined,
    resultList: [],
    offerList: [],
    freelancerOfferList: [],
    freelancerOfferDetail: [],
    adminFreelancerDetail: [],
    createShortlist: [],
    loading: false,
    noRecord: false,
    pageInfo: {
      total: 0,
      current_page: 1,
      total_pages: 0,
    },
  };
}
export function reducer(
  state = initialState(),
  action: TenderActions
): TenderState {
  switch (action.type) {
    case TenderActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case TenderActionTypes.UpdateOfferSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case TenderActionTypes.UpdateFreelancerOfferSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case TenderActionTypes.LoadTenderList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case TenderActionTypes.LoadTenderListSuccess:
      localStorage.setItem('tender.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case TenderActionTypes.LoadTenderListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };
    case TenderActionTypes.LoadTenderDetail:
      return {
        ...state,
        loading: true,
        tender: undefined,
      };
    case TenderActionTypes.LoadTenderDetailWithLogs:
      return {
        ...state,
        loading: true,
        tenderWithLogs: undefined,
      };
    case TenderActionTypes.LoadTenderDetailSuccess:
      return {
        ...state,
        loading: false,
        tender: action.payload,
        tenderWithLogs: action.payload,
      };
    case TenderActionTypes.LoadAssignmentDetail:
      return {
        ...state,
        loading: true,
        assignment: undefined,
      };
    case TenderActionTypes.LoadAssignmentDetailSuccess:
      return {
        ...state,
        loading: true,
        assignment: action.payload,
      };
    case TenderActionTypes.CreateTendersSuccess: {
      const tender = action.payload;
      return {
        ...state,
        tender: tender,
      };
    }
    case TenderActionTypes.LoadOffer:
      return {
        ...state,
        offerList: undefined,
        loading: true,
        noRecord: false,
      };

    case TenderActionTypes.LoadOfferSuccess:
      localStorage.setItem('offer.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        loading: true,
        offerList: action.payload
      };

    case TenderActionTypes.LoadFreelancerOffer:
      return {
        ...state,
        noRecord: false,
        loading: true,
        freelancerOfferList: [],
      };

    case TenderActionTypes.LoadFreelancerOfferSuccess:
      return {
        ...state,
        loading: false,
        freelancerOfferList: action.payload
      };

    case TenderActionTypes.LoadFreelancerOfferDetail:
      return {
        ...state,
        loading: true,
        freelancerOfferDetail: [],
      };

    case TenderActionTypes.LoadFreelancerOfferDetailSuccess:
      return {
        ...state,
        loading: false,
        freelancerOfferDetail: action.id
      };

    case TenderActionTypes.LoadAdminOfferDetail:
      return {
        ...state,
        loading: true,
        adminOfferDetail: []
      };

    case TenderActionTypes.LoadAdminOfferDetailSuccess:
      return {
        ...state,
        loading: true,
        adminOfferDetail: action.data
      };

    case TenderActionTypes.LoadAdminFreelancer:
      return {
        ...state,
        loading: true,
        adminFreelancerDetail: []
      };

    case TenderActionTypes.LoadAdminFreelancerSuccess:
      return {
        ...state,
        loading: true,
        adminFreelancerDetail: action.fid
      };

    case TenderActionTypes.CreateShortlist:
      return {
        ...state,
        loading: true,
        createShortlist: []
      };

    case TenderActionTypes.CreateShortlistSuccess:
      return {
        ...state,
        loading: true,
        createShortlist: action.data
      };

    default:
      return state;
  }
}
