import { MultipleResponse, SingleResponse } from "./response";

import { AgentVM } from "./agent.model";
import { CertificateResponse } from "./certificate.response";
import { ContractTypeResponse } from "./contract-type.response";
import { ProjectResponse } from "./project.response";
import {SalesSlotResponse} from "./client.response";
import { TaskInfoVM, TeamInfoVM } from "./client.model";

export interface AdditionalCostResponse {
  name?: string;
  value?: string;
  description?: string;
}
export interface ClientResponse {
  name?: string;
}
export interface JobDocumentResponse {
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

export interface JobFeedbackQuestionResponse {
  question?: string;
  type?: string;
}

export interface JobSummaryResponse {
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

export interface SiteResponse {
  address?: string;
  addressaddition?: string;
  category?: string;
  cities?: string;
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
  id?: number
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
}

export interface JobResponse {
  additional_costs?: AdditionalCostResponse[];
  agent?: SingleResponse<AgentVM>;
  created_at?: string;
  agent_id?: number;
  assignment_budget?: number;
  briefing?: string;
  budget_id?: number;
  category?: string;
  certificate_ids?: number[];
  certificates?: MultipleResponse<CertificateResponse>;
  contact_id?: number;
  contract_type?: SingleResponse<ContractTypeResponse>;
  contract_type_id?: number;
  contract_type_identifier?: string;
  data?: {
    bar_sdf?: string;
    fup?: string;
    other?: string;
  };
  client?: ClientResponse;
  description?: string;
  summary?: JobSummaryResponse;
  documents?: MultipleResponse<JobDocumentResponse>;
  feedback?: JobFeedbackQuestionResponse[];
  finish_time?: string;
  freelancer_ratings?: string[];
  id?: number;
  incentive_model_id?: number;
  information?: string;
  is_creator?: boolean;
  project?: SingleResponse<ProjectResponse>;
  project_id?: number;
  saleslots?: SalesSlotResponse[];
  site?: SingleResponse<SiteResponse>;
  site_client_contact?: any;
  site_id?: number;
  site_ids?: number[];
  start_time?: string;
  state?: string;
  title?: string;
  wage?: string;
  revenues?: MultipleResponse<any[]>;
  teaminfo?: TeamInfoVM[];
  taskinfo?: TaskInfoVM[];
  staff_id?: number;
  staff?: SingleResponse<AgentVM>;
  job_name?: string;
  job_overview?: string;
  job_location?: string;
  staff_briefing?: string;
  start_date?: string;
  finish_date?: string;
  job_location_lat?: string;
  job_location_lng?: string;
  job_code?: string;
  location_type?: string;
}
