import { AdditionalCostVM, JobVM } from './job.model';

import { AgentVM } from './agent.model';
import { AssignmentVM } from './assignment.model';
import { ClientVM } from './client.model';
import { DatesVM } from './dates.model';
import { DocumentVM } from './document.model';
import { IncentiveModelVM } from './incentive_model.model';
import { OfferVM } from './offer.model';
import { ProjectVM } from './project.model';
import { SiteVM } from './site.model';

export interface JobSearchVM {
  agent?: string;
  client?: string;
  project?: string;
  contractType?: string;
  attributes?: string;
  search?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
  start?: string;
  end?: string;
  certificate?: string;
  zip_from?: string;
  zip_to?: string;
}

export interface TenderSearchVM {
  job?: string;
  state?: string;
  date_from?: string;
  date_to?: string;
  zip_from?: string;
  zip_to?: string;
  radius?: string;
  gender?: string;
  agent?: string;
  contractType?: string;
  skill?: string;
  certificate?: string;
  search?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
  client?: any;
  project?: any;
  site?: any;
  freelancer?: any;
  start?: any;
  end?: any;
  status?: any;
}

export interface TenderVM {
  id?: number;
  agent?: AgentVM;
  assignment?: AssignmentVM;
  assignment_id?: number;
  category?: string;
  certificate_ids?: number[];
  cities?: string[];
  contract_type?: any;
  contract_type_id?: number;
  contract_type_identifier?: string;
  tenderContractType?: string;
  created_at?: string;
  daily_rate_max?: number;
  daily_rate_min?: number;
  deleted_at?: string;
  federal_state?: string;
  invalid_at?: string;
  job_id?: number;
  offers?: OfferVM[];
  offers_count?: number;
  published_at?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  snapshots?: {
    assignment?: AssignmentVM;
    client?: ClientVM;
    contacts?: {
      agency?: any;
      site?: any;
    };
    date?: DatesVM;
    documents?: DocumentVM[];
    incentive_model?: IncentiveModelVM;
    job?: JobVM;
    project?: ProjectVM;
    site?: SiteVM;
  }
  state?: string;
  tender_id?: string;
  zip_max?: string;
  zip_min?: string;
  logs?: any;
  gender?: string;
  radius?: string;
  contractType? : string;
  skill?: string;
  certificate?: string;
  job_name?: string;
  client_name?: string;
  job_code?: string;
  job_status?: string;
  role_name?: string;
  staff_manager?: string;
  job_location?: string;
  job_start_date?: string;
  job_finish_date?: string;
  job_start_time?: string;
  job_finish_time?: string;
  staff_count?: string;
  start_date?: string;
  end_date?: string;
  days?: string;
  job_advert_end_date?: string;
  job_advert_end_date_time?: string;
  job_advert_start_date?: string;
  job_advert_start_date_time?: string;
  staff_role_id?: string;
  job_advertisement_id?: string;
  job_info?: any;
  tenders?: any;
}

export interface TenderRequestVM {
  additional_costs?: AdditionalCostVM[];
  assignment_budget?: number;
  budget_id?: number;
  cities?: string[];
  dates?: string[];
  finish_time?: string;
  published_at?: any;
  start_time?: string;
  wage?: string;
  zip_max?: string;
  zip_min?: string;
  gender?: string;
  radius?: string;
  contractType? : string;
  skill?: string;
  certificate?: string;
}

export interface TenderExportVM {
  jobTitle: string;
  clientName: string;
  start_date: string;
  finish_date: string;
  siteName: string;
  status: string;
  publishedAt: string;
  invalidAt: string;
  role: string;
  days: string;
  staff_count: string;
  staff_manager: string;
}

export interface TenderLogExportVM {
  timestamp: string;
  performer_name: string;
  message: string;
}
