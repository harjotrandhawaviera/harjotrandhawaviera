import { AgentVM } from './agent.model';
import { CertificateVM } from './certificate.model';
import { ProjectVM } from './project.model';
import {SalesSlotVM, TaskInfoVM, TeamInfoVM} from './client.model';
import {AssignmentVM} from './assignment.model';
import {OfferVM} from './offer.model';
import {DatesVM} from './dates.model';
import {DocumentVM} from './document.model';
import {IncentiveModelVM} from './incentive_model.model';
import {SiteVM} from './site.model';

export interface JobAdvertiseSearchVM {
  job?: string;
  jobName?: string;
  state?: string;
  date_from?: string;
  date_to?: string;
  zip_from?: string;
  zip_to?: string;
  radius?: string;
  gender?: string;
  agent?: string;
  contractType?: string;
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

export interface JobAdvertiseVM {
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
  };
  client?: {
    name?: string;
  };
  state?: string;
  tender_id?: string;
  zip_max?: string;
  zip_min?: string;
  logs?: any;
  gender?: string;
  radius?: string;
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
}


export interface JobSearchVM {
  agent?: string;
  client?: string;
  project?: string;
  contractType?: string;
  skill?: string;
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

export interface AdditionalCostVM {
  name?: string;
  value?: string;
  description?: string;
}

export interface JobDocumentVM {
  id?: number;
  document_ids?: number[];
  description?: string;
  document_id?: number;
  is_collection?: boolean;
  job_id?: string;
  mime?: string;
  name?: string;
  original_filename?: string;
  size?: string;
  type?: string;
  url?: string;
}

export interface JobFeedbackQuestionVM {
  question?: string;
  type?: string;
}

export interface ClientVM {
  name?: string;
}

export interface JobSummaryVM {
  title?: string;
  assignments?: {
    count?: number;
    states?: {
      open?: number;
      tendered?: number;
      booked?: number;
      preparation?: number;
      invoiced?: number;
      open_upcoming?: number;
    };
  };
  dates?: {
    count?: number;
    states?: {
      assigned?: number;
    };
  };
  offers?: {
    count?: number;
    states?: {
      valid?: number;
      expired?: number;
    };
  };
  tenders?: {
    count?: number;
    states?: {
      active?: number;
      scheduled?: number;
      expired?: number;
    };
  };
}

export interface SiteVm {
  address?: string;
  addressaddition?: string;
  category?: string;
  cities?: string[];
  city?: string;
  contact_id?: number;
  country?: string;
  data?: {
    phone_original?: string;
    country_original?: string;
    migration?: string;
  };
  country_original?: string;
  migration?: string;
  phone_original?: string;
  email?: string;
  fax?: string;
  federal_state?: string;
  group?: string;
  id?: number;
  lat?: string;
  lon?: string;
  name?: string;
  nameaddition?: string;
  number?: string;
  phone?: string;
  w3w?: string;
  zip?: string;
  zip_max?: string;
  zip_min?: string;
  gender?: string;
  radius?: string;
  contractType?: string;
  certificate?: string;
  skill?: string;
}

export interface JobVM {
  additional_costs?: AdditionalCostVM[];
  agent?: AgentVM;
  agent_id?: number;
  created_at?: string;
  assignment_budget?: number;
  briefing?: string;
  budget_id?: number;
  category?: string;
  certificate_ids?: number[];
  certificates?: CertificateVM[];
  contact_id?: number;
  contract_type?: any;
  contract_type_id?: number;
  contract_type_identifier?: string;
  data?: {
    bar_sdf?: string;
    fup?: string;
    other?: string;
  };
  client?: ClientVM;
  description?: string;
  summary?: JobSummaryVM;
  documents?: JobDocumentVM[];
  feedback?: JobFeedbackQuestionVM[];
  finish_time?: string;
  freelancer_ratings?: string[];
  id?: number;
  incentive_model_id?: number;
  information?: string;
  is_creator?: boolean;
  project?: ProjectVM;
  project_id?: number;
  saleslots?: SalesSlotVM[];
  site?: SiteVm;
  site_client_contact?: any;
  site_id?: number;
  site_ids?: number[];
  start_time?: string;
  state?: string;
  title?: string;
  wage?: string;
  revenues?: any[];
  teaminfo?: TeamInfoVM[];
  taskinfo?: TaskInfoVM[];
  staff_id?: number;
  staff?: AgentVM;
  job_name?: string;
  job_overview?: string;
  job_location?: string;
  job_location_lat?: string;
  job_location_lng?: string;
  staff_briefing?: string;
  start_date?: string;
  finish_date?: string;
  job_code?: string;
  location_type?: string;
}

export interface JobExportVM {
  id: any;
  title: string;
  clientname: string;
  assignmentsNumber: string;
  bookedAssignmentsNumber?: string;
  createdAt: string;
  unbookedAssignmentsNumber: string;
}

export interface ClientJobExportVM {
  title: string;
  projectname: string;
  sitename: string;
  siteaddress: string;
  sitezip: string;
  sitecity: string;
  clientname: string;
  siteClientContact: string;
  status: string;
  categoryName: string;
  agentName: string;
  assignmentsNumber: string;
  bookedAssignmentsNumber: string;
  openUpcomingAssignmentsNumber: string;
  finishedAssignmentsNumber: string;
  revenueTotal: string;
  revenueAvg: string;
}

export interface JobDocumentChangesVM {
  newDocuments: JobDocumentVM[];
  updatedDocuments: JobDocumentVM[];
  deletedDocuments: number[];
}

export interface FreelancerInvite {
  job_id: number;
  freelancer_ids: [];
  staff_role_id: number;
  job_advertisement_id: number;
}

export interface ShortlistVM {
  agent?: string;
  client?: string;
  project?: string;
  contractType?: string;
  skill?: string;
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
