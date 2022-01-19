import { JobActions, JobActionTypes } from './job.actions';
import {
  FreelancerInvite,
  JobAdvertiseSearchVM,
  JobAdvertiseVM,
  JobSearchVM,
  JobVM,
  ShortlistVM
} from '../../model/job.model';

import { BudgetVM } from '../../model/budget.model';
import { PaginationVM } from './../../model/pagination.model';
import { ProjectVM } from '../../model/project.model';
import { TenderVM } from '../../model/tender.model';
import {OfferVM} from '../../model/offer.model';

export interface JobState {
  searchModel?: JobSearchVM;
  resultList?: JobVM[];
  jobAdvertise?: JobAdvertiseVM[];
  freelanceJobOfferList: JobVM[];
  freelanceJobOfferDetailsList: JobVM[];
  adminOfferDetail?: OfferVM[];
  freelanceJobOffer?: JobVM;
  Email?: FreelancerInvite[];
  shortlist?: ShortlistVM[];
  adminFreelancerDetail?: OfferVM[];
  job?: JobVM;
  siteIds?: number[];
  dates?: string[];
  budget?: BudgetVM;
  project?: ProjectVM;
  jobOffer?: TenderVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;
  Question?: boolean;
  Subject?: boolean;
  Reject?: boolean;
  Submit?: boolean;
  userList?: [];
  jobInvite?: [];
  shortlistOffer?: [];
  shortlistOfferDetails?: [];
  jobId?: number | null;
  newJob?: [];
}

function initialState(): JobState {
  const stored = localStorage.getItem('job.search');
  return {
    searchModel: stored !== null ? JSON.parse(stored) : '',
    resultList: [],
    freelanceJobOfferList: [],
    freelanceJobOfferDetailsList: [],
    loading: false,
    noRecord: false,
    pageInfo: {
      total: 0,
      current_page: 1,
      total_pages: 0,
    },
  };
}
export function reducer(state = initialState(), action: JobActions): JobState {
  switch (action.type) {
    case JobActionTypes.UpdateSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case JobActionTypes.UpdateJobAdvertiseSearch:
      return {
        ...state,
        searchModel: action.payload,
      };
    case JobActionTypes.UpdateFreelancerJobSearch:
    return {
      ...state,
      searchModel: action.payload
    };
    case JobActionTypes.LoadJobList:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case JobActionTypes.LoadJobListSuccess:
      localStorage.setItem('job.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case JobActionTypes.LoadJobListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };
    case JobActionTypes.LoadJobDetail:
      return {
        ...state,
        loading: true,
        job: undefined,
      };
    case JobActionTypes.LoadJobDetailSuccess:
      return {
        ...state,
        loading: true,
        job: action.payload,
      };
    case JobActionTypes.LoadBudgetDetail:
      return {
        ...state,
        loading: true,
        budget: undefined,
      };
    case JobActionTypes.LoadBudgetDetailSuccess:
      return {
        ...state,
        loading: false,
        budget: action.payload,
      };
    case JobActionTypes.LoadBudgetDetailFailed:
      return {
        ...state,
        budget: undefined,
      };
    case JobActionTypes.LoadProjectDetail:
      return {
        ...state,
        project: undefined,
      };
    case JobActionTypes.LoadProjectDetailSuccess: {
      const project = action.payload.project;
      return {
        ...state,
        project,
      };
    }
    case JobActionTypes.LoadProjectDetailFailed:
      return {
        ...state,
        project: undefined,
      };
    case JobActionTypes.CreateJob: {
      const jobId = action.payload;
      return {
        ...state,
        newJob: [],
      };
    }
    case JobActionTypes.CreateJobSuccess: {
      const jobId = action.payload;
      return {
        ...state,
        newJob: action.payload,
      };
    }
    case JobActionTypes.LoadJobOffer:
      return {
        ...state,
        jobOffer: undefined,
      };
    case JobActionTypes.LoadJobOfferSuccess: {
      return {
        ...state,
        jobOffer: action.payload.list,
      };
    }
    case JobActionTypes.LoadJobOfferFailed:
      return {
        ...state,
        jobOffer: undefined,
      };
    case JobActionTypes.CreateJobTendersSuccess: {
      const dates = action.payload;
      return {
        ...state,
        dates,
      };
    }
    case JobActionTypes.LoadFreelancerJobOffer:
      return {
        ...state,
        noRecord: false,
        loading: true,
      };
    case JobActionTypes.LoadFreelancerJobOfferSuccess:
      return  {
        ...state,
        loading: false,
        freelanceJobOfferList: action.payload
      };
    case JobActionTypes.LoadFreelancerJobDetailSuccess:
      return {
        ...state,
        noRecord: false,
        loading: false,
        freelanceJobOfferDetailsList: action?.payload?.data,
      };
    case JobActionTypes.LoadFreelancerJobDetailQuestion:
      return {
        ...state,
        loading: true,
        Question: false,
      };
    case JobActionTypes.LoadFreelancerJobDetailQuestionSuccess:
      return {
        ...state,
        Question: true,
        loading: false,
      };
    case JobActionTypes.LoadFreelancerJobDetailSubmitOffers:
      return {
        ...state,
        loading: true,
        Subject: false,
      };
    case JobActionTypes.LoadFreelancerJobDetailSubmitOffersSuccess:
      return {
        ...state,
        Subject: true,
        loading: false,
      };
    case JobActionTypes.LoadFreelancerJobDetailRejected:
      return {
        ...state,
        loading: true,
        Reject: false,
      };
    case JobActionTypes.LoadFreelancerJobDetailRejectedSuccess:
      return {
        ...state,
        loading: false,
        Reject: true,
      };
    case JobActionTypes.LoadJobAdvertise:
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case JobActionTypes.LoadJobAdvertiseSuccess:
      // localStorage.setItem('tender.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        jobAdvertise: action.payload.list,
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case JobActionTypes.LoadUserList:
      return  {
        ...state,
        loading: true,
        userList: [],
      };

    case JobActionTypes.LoadUserListSuccess:
      return {
        ...state,
        userList: action.payload
      };

    case JobActionTypes.SendInvite:
      return  {
        ...state,
        loading: false,
        Email: [],
      };

    case JobActionTypes.SendInviteSuccess:
      return {
        ...state,
        loading: false,
        Email: action.payload
      };
    case JobActionTypes.LoadJobInvite:
      return {
        ...state,
        jobInvite: [],
      };
    case JobActionTypes.LoadJobInviteSuccess: {
      return {
        ...state,
        jobInvite: action.payload,
      };
    }
    case JobActionTypes.LoadShortlistOffer:
      return {
        ...state,
        shortlistOffer: [],
        searchModel: action.payload
      };
    case JobActionTypes.LoadShortlistOfferSuccess: {
      localStorage.setItem('job.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        shortlistOffer: action.payload
      };
    }
    case JobActionTypes.LoadShortlistOfferDetails:
      return {
        ...state,
        loading: true,
        shortlistOfferDetails: [],
      };

    case JobActionTypes.LoadShortlistOfferDetailsSuccess:
      return {
        ...state,
        loading: true,
        shortlistOfferDetails: action.payload
      };
    case JobActionTypes.LoadAdminOfferDetail:
      return {
        ...state,
        loading: true,
        adminOfferDetail: []
      };

    case JobActionTypes.LoadAdminOfferDetailSuccess:
      return {
        ...state,
        loading: true,
        adminOfferDetail: action.data
      };
    case JobActionTypes.LoadAdminFreelancer:
      return {
        ...state,
        loading: true,
        adminFreelancerDetail: []
      };

    case JobActionTypes.LoadAdminFreelancerSuccess:
      return {
        ...state,
        loading: true,
        adminFreelancerDetail: action.fid
      };
    case JobActionTypes.JobSubmittedOffer:
      return {
        ...state,
        loading: true,
        Submit: false,
      };
    case JobActionTypes.JobSubmittedOfferSuccess:
      return {
        ...state,
        Submit: true,
        loading: false,
      };
    default:
      return state;
  }
}
