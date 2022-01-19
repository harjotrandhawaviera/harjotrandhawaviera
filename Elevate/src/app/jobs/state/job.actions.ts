import {JobAdvertiseSearchVM, JobAdvertiseVM, JobDocumentVM, JobSearchVM, JobVM} from '../../model/job.model';
import { PagedResult, PaginationVM } from './../../model/pagination.model';
import { ProjectDocumentVM, ProjectVM } from '../../model/project.model';
import {TenderRequestVM, TenderSearchVM, TenderVM} from '../../model/tender.model';

import { Action } from '@ngrx/store';
import { BudgetVM } from '../../model/budget.model';
export enum JobActionTypes {
  UpdateSearch = '[Job] Update search',
  UpdateJobAdvertiseSearch = '[Job] Update Job Advertise search',
  UpdateFreelancerJobSearch = '[Job] Freelancer Job search',
  LoadJobList = '[Job] Load job list',
  LoadJobListSuccess = '[Job] Load job list success',
  LoadJobListFailed = '[Job] Load job list failed',

  DeleteJob = '[Job] Delete Job',
  DeleteJobFailed = '[Job] Delete Job failed',

  LoadJobDetail = '[Job] Load job detail',
  LoadJobDetailSuccess = '[Job] Load job detail success',
  LoadJobDetailFailed = '[Job] Load job detail failed',

  LoadBudgetDetail = '[Job] Load budget detail',
  LoadBudgetDetailSuccess = '[Job] Load budget detail success',
  LoadBudgetDetailFailed = '[Job] Load budget detail failed',

  LoadProjectDetail = '[Job] Load Project Detail',
  LoadProjectDetailSuccess = '[Job] Project Detail success',
  LoadProjectDetailFailed = '[Job] Project Detail failed',

  CreateJob = '[Job] Create job',
  CreateClientJob = '[Job] Create client job',
  CreateJobSuccess = '[Job] Create job success',
  CreateJobFailed = '[Job] Create job failed',

  UpdateJob = '[Job] Update job',
  UpdateJobSuccess = '[Job] Update job success',
  UpdateJobFailed = '[Job] Update job failed',

  LoadJobOffer = '[Job] Load job offer',
  LoadJobOfferSuccess = '[Job] Load job offer success',
  LoadJobOfferFailed = '[Job] Load job offer failed',

  CreateJobTenders = '[Job] create job tenders assignment',
  CreateJobTendersSuccess = '[Job] create job tenders assignment success',
  CreateJobTendersFailed = '[Job] create job tenders assignment failed',

  LoadFreelancerJobOffer = '[Job] Job Load Freelancer Job Offer',
  LoadFreelancerJobOfferSuccess = '[Job] Job Load Freelancer Job Offer Success',

  LoadFreelancerJobDetail = '[Job] Load freelancer job Detail',
  LoadFreelancerJobDetailSuccess = '[Job] freelancer job Detail success',

  LoadFreelancerJobDetailQuestion = '[Job] Load Freelancer Job Detail Question',
  LoadFreelancerJobDetailQuestionSuccess = '[Job] Load Freelancer Job Detail Question Success',

  LoadFreelancerJobDetailSubmitOffers = '[Job] Add Freelancer Submitted Offers',
  LoadFreelancerJobDetailSubmitOffersSuccess = '[Job] Add Freelancer Submitted Offers Success',

  LoadFreelancerJobDetailRejected = '[Job] Add Freelancer Rejected Offers',
  LoadFreelancerJobDetailRejectedSuccess = '[Job] Add Freelancer Rejected Offers Success',

  LoadJobAdvertise = '[Job]  Load  Job Advertise',
  LoadJobAdvertiseSuccess = '[Job]  Load Job Advertise Success',

  LoadUserList = '[Job]  Load  User List',
  LoadUserListSuccess = '[Job]  Load User List Success',

  SendInvite = '[Job] Send Invite ',
  SendInviteSuccess = '[Job Send Invite Success ',

  LoadJobInvite = '[Job] Load Job Invite',
  LoadJobInviteSuccess = '[Job] Load Job Invite Success',

  LoadShortlistOffer = '[Job] Load Shortlist Offer',
  LoadShortlistOfferSuccess = '[Job] Load Shortlist Offer Success',

  LoadShortlistOfferDetails = '[Job] Load Shortlist Offer Details',
  LoadShortlistOfferDetailsSuccess = '[Job] Load Shortlist Offer Details Success',

  LoadAdminOfferDetail = '[Job] Load Admin Offer Detail',
  LoadAdminOfferDetailSuccess = '[Job] Load Admin Offer Detail Success',

  LoadAdminOfferRejectDetail = '[Job] Load Admin Offer Reject Detail',
  LoadAdminOfferRejectDetailSuccess = '[Job] Load Admin Offer Reject Detail Success',

  LoadAdminFreelancer = '[Job] Load Admin Freelancer ',
  LoadAdminFreelancerSuccess = '[Job] Load  Admin Freelancer success',

  JobSubmittedOffer = '[Job] Job Submitted Offer',
  JobSubmittedOfferSuccess = '[Job] Job Submitted Offer Success',

  ClearSearchResult = '[Job] Clear search result',
}
export class UpdateSearch implements Action {
  readonly type = JobActionTypes.UpdateSearch;
  constructor(public payload: JobSearchVM) {}
}
export class UpdateJobAdvertiseSearch implements Action {
  readonly type = JobActionTypes.UpdateJobAdvertiseSearch;
  constructor(public payload: JobAdvertiseSearchVM) {}
}
export class UpdateFreelancerJobSearch implements Action {
  readonly type = JobActionTypes.UpdateFreelancerJobSearch;
  constructor(public payload: JobSearchVM) {}
}

export class LoadJobList implements Action {
  readonly type = JobActionTypes.LoadJobList;
  constructor(public payload: { search: JobSearchVM; view?: string }) {}
}
export class LoadJobListSuccess implements Action {
  readonly type = JobActionTypes.LoadJobListSuccess;
  constructor(public payload: PagedResult<JobVM>) {}
}
export class LoadJobListFailed implements Action {
  readonly type = JobActionTypes.LoadJobListFailed;
  constructor(public payload: any) {}
}
export class ClearSearchResult implements Action {
  readonly type = JobActionTypes.ClearSearchResult;
  constructor() {}
}

export class DeleteJob implements Action {
  readonly type = JobActionTypes.DeleteJob;
  constructor(public payload: number) {}
}
export class DeleteJobFailed implements Action {
  readonly type = JobActionTypes.DeleteJobFailed;
  constructor(public payload: any) {}
}

export class LoadJobDetail implements Action {
  readonly type = JobActionTypes.LoadJobDetail;
  constructor(public payload: { id: string; mode: string }) {}
}
export class LoadJobDetailSuccess implements Action {
  readonly type = JobActionTypes.LoadJobDetailSuccess;
  constructor(public payload: JobVM) {}
}
export class LoadJobDetailFailed implements Action {
  readonly type = JobActionTypes.LoadJobDetailFailed;
  constructor(public payload: any) {}
}

export class LoadBudgetDetail implements Action {
  readonly type = JobActionTypes.LoadBudgetDetail;
  constructor(public payload: number) {}
}
export class LoadBudgetDetailSuccess implements Action {
  readonly type = JobActionTypes.LoadBudgetDetailSuccess;
  constructor(public payload: BudgetVM) {}
}
export class LoadBudgetDetailFailed implements Action {
  readonly type = JobActionTypes.LoadBudgetDetailFailed;
  constructor(public payload: any) {}
}

export class LoadProjectDetail implements Action {
  readonly type = JobActionTypes.LoadProjectDetail;
  constructor(public payload: { id: string; mode: string }) {}
}
export class LoadProjectDetailSuccess implements Action {
  readonly type = JobActionTypes.LoadProjectDetailSuccess;
  constructor(public payload: { project: ProjectVM; mode: string }) {}
}
export class LoadProjectDetailFailed implements Action {
  readonly type = JobActionTypes.LoadProjectDetailFailed;
  constructor(public payload: any) {}
}

export class UpdateJob implements Action {
  readonly type = JobActionTypes.UpdateJob;
  constructor(
    public payload: {
      job: JobVM;
      newDocuments: JobDocumentVM[];
      updatedDocuments: JobDocumentVM[];
      deletedDocuments: number[];
    }
  ) {}
}
export class UpdateJobSuccess implements Action {
  readonly type = JobActionTypes.UpdateJobSuccess;
  constructor(public payload: { id: number }) {}
}
export class UpdateJobFailed implements Action {
  readonly type = JobActionTypes.UpdateJobFailed;
  constructor(public payload: any) {}
}

export class CreateJob implements Action {
  readonly type = JobActionTypes.CreateJob;
  constructor(
    public payload: {
      job: JobVM;
      documents: JobDocumentVM[];
      projectId: number;
    }
  ) {}
}
export class CreateClientJob implements Action {
  readonly type = JobActionTypes.CreateClientJob;
  constructor(public payload: { job: JobVM; projectId: number }) {}
}
export class CreateJobSuccess implements Action {
  readonly type = JobActionTypes.CreateJobSuccess;
  constructor(public payload: any) {}
}
export class CreateJobFailed implements Action {
  readonly type = JobActionTypes.CreateJobFailed;
  constructor(public payload: {}) {}
}

export class LoadJobOffer implements Action {
  readonly type = JobActionTypes.LoadJobOffer;
  constructor(public payload: { id: string; type: string }) {}
}
export class LoadJobOfferSuccess implements Action {
  readonly type = JobActionTypes.LoadJobOfferSuccess;
  constructor(public payload: PagedResult<TenderVM>) {}
}
export class LoadJobOfferFailed implements Action {
  readonly type = JobActionTypes.LoadJobOfferFailed;
  constructor(public payload: any) {}
}

export class CreateJobTenders implements Action {
  readonly type = JobActionTypes.CreateJobTenders;
  constructor(public payload: { tender: TenderRequestVM; jobId: string }) {}
}
export class CreateJobTendersSuccess implements Action {
  readonly type = JobActionTypes.CreateJobTendersSuccess;
  constructor(public payload: string[]) {}
}
export class CreateJobTendersFailed implements Action {
  readonly type = JobActionTypes.CreateJobTendersFailed;
  constructor(public payload: {}) {}
}
export class LoadFreelancerJobOffer implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobOffer;
  constructor(public payload: { search: JobSearchVM; }) {}
}
export class LoadFreelancerJobOfferSuccess implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobOfferSuccess;
  constructor(public payload: any) {}
}

export class LoadFreelancerJobDetail implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobDetail;
  constructor(public payload: { id: any; fid: any; role_id: any; is_matched: any; }) {}
}
export class LoadFreelancerJobDetailSuccess implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobDetailSuccess;
  constructor(public payload: any) {}
}

export class LoadFreelancerJobDetailSubmitOffers implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobDetailSubmitOffers;
  constructor(public payload: any) {}
}

export class LoadFreelancerJobDetailSubmitOffersSuccess implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobDetailSubmitOffersSuccess;
  constructor(public payload: any) {}
}

export class LoadFreelancerJobDetailQuestion implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobDetailQuestion;
  constructor(public payload: { content: string; subject: string, tender_ids: any[] }, public jobId: number) {}
}
export class LoadFreelancerJobDetailQuestionSuccess implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobDetailQuestionSuccess;
  constructor(public payload: any) {}
}

export class LoadFreelancerJobDetailRejected implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobDetailRejected;
  constructor(public payload: { reason: string; freelancer_id: number, tender_id: number }) {}
}
export class LoadFreelancerJobDetailRejectedSuccess implements Action {
  readonly type = JobActionTypes.LoadFreelancerJobDetailRejectedSuccess;
  constructor(public payload: any) {}
}

export class LoadJobAdvertise implements Action {
  readonly type = JobActionTypes.LoadJobAdvertise;
  constructor(public payload: { search: JobAdvertiseSearchVM; }) {}
}
export class LoadJobAdvertiseSuccess implements Action {
  readonly type = JobActionTypes.LoadJobAdvertiseSuccess;
  constructor(public payload: PagedResult<JobAdvertiseVM>) {}
}

export class LoadUserList implements Action {
  readonly type = JobActionTypes.LoadUserList;
  constructor(public payload?: any) {}
}
export class LoadUserListSuccess implements Action {
  readonly type = JobActionTypes.LoadUserListSuccess;
  constructor(public payload: any) {}
}
export class SendInvite implements Action{
  readonly type = JobActionTypes.SendInvite;
  constructor(public payload: any) {  }
}

export class SendInviteSuccess implements Action{
  readonly type = JobActionTypes.SendInviteSuccess;
  constructor(public payload: any) {}
}

export class LoadJobInvite implements Action {
  readonly type = JobActionTypes.LoadJobInvite;
  constructor(public payload: any) {}
}
export class LoadJobInviteSuccess implements Action {
  readonly type = JobActionTypes.LoadJobInviteSuccess;
  constructor(public payload: any) {}
}

export class LoadShortlistOffer implements Action {
  readonly type = JobActionTypes.LoadShortlistOffer;
  constructor(public payload: any) {}
}
export class LoadShortlistOfferSuccess implements Action {
  readonly type = JobActionTypes.LoadShortlistOfferSuccess;
  constructor(public payload: any) {}
}

export class LoadShortlistOfferDetails implements Action {
  readonly type = JobActionTypes.LoadShortlistOfferDetails;
  constructor(public payload: { id: any }) {}
}
export class LoadShortlistOfferDetailsSuccess implements Action {
  readonly type = JobActionTypes.LoadShortlistOfferDetailsSuccess;
  constructor(public payload: any) {}
}
export class LoadAdminOfferDetail implements Action {
  readonly type = JobActionTypes.LoadAdminOfferDetail;
  constructor(public payload: { fid: number, data: any }) {}
}
export class LoadAdminOfferDetailSuccess implements Action {
  readonly type = JobActionTypes.LoadAdminOfferDetailSuccess;
  constructor(public data: any) {}
}
export class LoadAdminOfferRejectDetail implements Action {
  readonly type = JobActionTypes.LoadAdminOfferRejectDetail;
  constructor(public payload: { id: number}) {}
}
export class LoadAdminOfferRejectDetailSuccess implements Action {
  readonly type = JobActionTypes.LoadAdminOfferRejectDetailSuccess;
  constructor(public data: any) {}
}
export class LoadAdminFreelancer implements Action {
  readonly type = JobActionTypes.LoadAdminFreelancer;
  constructor(public payload: { fid: number }) {}
}
export class LoadAdminFreelancerSuccess implements Action {
  readonly type = JobActionTypes.LoadAdminFreelancerSuccess;
  constructor(public fid: any) {}
}

export class JobSubmittedOffer implements Action {
  readonly type = JobActionTypes.JobSubmittedOffer;
  constructor(public payload: any) {}
}

export class JobSubmittedOfferSuccess implements Action {
  readonly type = JobActionTypes.JobSubmittedOfferSuccess;
  constructor(public payload: any) {}
}



export type JobActions =
  | UpdateSearch
  | UpdateJobAdvertiseSearch
  | UpdateFreelancerJobSearch
  | LoadJobList
  | LoadJobListSuccess
  | LoadJobListFailed
  | ClearSearchResult
  | DeleteJob
  | DeleteJobFailed
  | LoadJobDetail
  | LoadJobDetailSuccess
  | LoadJobDetailFailed
  | LoadBudgetDetail
  | LoadBudgetDetailSuccess
  | LoadBudgetDetailFailed
  | LoadProjectDetail
  | LoadProjectDetailSuccess
  | LoadProjectDetailFailed
  | CreateJob
  | CreateClientJob
  | CreateJobSuccess
  | CreateJobFailed
  | UpdateJob
  | UpdateJobSuccess
  | UpdateJobFailed
  | LoadJobOffer
  | LoadJobOfferSuccess
  | LoadJobOfferFailed
  | CreateJobTenders
  | CreateJobTendersSuccess
  | CreateJobTendersFailed
  | LoadFreelancerJobOffer
  | LoadFreelancerJobOfferSuccess
  | LoadFreelancerJobDetail
  | LoadFreelancerJobDetailSuccess
  | LoadFreelancerJobDetailQuestion
  | LoadFreelancerJobDetailQuestionSuccess
  | LoadFreelancerJobDetailSubmitOffers
  | LoadFreelancerJobDetailSubmitOffersSuccess
  | LoadFreelancerJobDetailRejected
  | LoadFreelancerJobDetailRejectedSuccess
  | LoadJobAdvertise
  | LoadJobAdvertiseSuccess
  | LoadUserList
  | LoadUserListSuccess
  | SendInvite
  | SendInviteSuccess
  | LoadJobInvite
  | LoadJobInviteSuccess
  | LoadShortlistOffer
  | LoadShortlistOfferSuccess
  | LoadShortlistOfferDetails
  | LoadShortlistOfferDetailsSuccess
  | LoadAdminOfferDetail
  | LoadAdminOfferDetailSuccess
  | LoadAdminOfferRejectDetail
  | LoadAdminOfferRejectDetailSuccess
  | LoadAdminFreelancer
  | LoadAdminFreelancerSuccess
  | JobSubmittedOffer
  | JobSubmittedOfferSuccess;
