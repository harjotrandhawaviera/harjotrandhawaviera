import { ClientResponse, SalesSlotResponse } from './client.response';
import { MultipleResponse, SingleResponse } from './response';

import { BudgetResponse } from './budget.response';
import { CertificateResponse } from './certificate.response';
import { ContactResponse } from './contact.response';
import { OrderResponse } from './order.response';
import { TargetBudgetVM } from './project.model';

export interface ProjectDocumentResponse {
  id?: number;
  document_id?: number;
  mime?: string;
  original_filename?: string;
  size?: string;
  url?: string;
  is_collection?: boolean;
  document_ids?: number[];
  project_id?: number;
  name?: string;
  description?: string;
  type?: string;
}
export interface ProjectSummaryResponse {
  jobs?: {
    count?: number;
  };
  dates?: {
    count?: number;
    states?: {
      assigned?: number;
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
  offers?: {
    count?: number;
    states?: {
      valid?: number;
      expired?: number;
    };
  };
}
export interface AdditionalCostResponse {
  name?: string;
  value?: string;
  description?: string;
}
export interface ProjectResponse {
  id?: number;
  name?: string;
  state?: string;
  created_at?: string;
  started_at?: string;
  finished_at?: string;
  description?: string;
  category?: string;
  information?: string;
  briefing?: string;
  data?: any;
  saleslots?: SalesSlotResponse[];
  freelancer_ratings?: string[];
  assignment_budget?: number;
  wage?: number;
  additional_costs?: AdditionalCostResponse[];
  feedback?: {
    question?: string;
    type?: string;
  }[];
  client_id?: number;
  budget_id?: number;
  incentive_model_id?: number;
  contact_id?: number;
  order_id?: number;
  agent_id?: number;
  number_of_jobs?: number;
  certificate_ids?: number[];
  sum_planned_costs?: number;
  sum_min_estimated_costs?: number;
  sum_max_estimated_costs?: number;
  sum_freelancer_costs?: number;
  contract_type_id?: number;
  contract_type_identifier?: string;
  summary?: ProjectSummaryResponse;
  client?: SingleResponse<ClientResponse>;
  contact?: SingleResponse<ContactResponse>;
  order?: SingleResponse<OrderResponse>;
  agent?: SingleResponse<any>;
  budget?: SingleResponse<BudgetResponse>;
  documents?: MultipleResponse<ProjectDocumentResponse>;
  certificates?: MultipleResponse<CertificateResponse>;
  target_budget?: TargetBudgetVM[];
  staff_id?: number;
  po_no?: number;
  po_amount?: string;
  po_date?: string;
  po_comment?: string;
  primary_address_full?: string;
  primary_address?: string;
  primary_country?: string;
  primary_state?: string;
  primary_city?: string;
  primary_zip?: string;
  site_address_full?: string;
  site_address?: string;
  site_country?: string;
  site_state?: string;
  site_city?: string;
  site_zip?: string;
  global_brand_id?: string[];
  currency?: string;
  po_currency?: string;
  skills_required?: string[];
  staff?: SingleResponse<any>;
  /**
   * if enabled, exclusive certificates will be updated for jobs/tenders and upcoming assignments, too
   */
  update_associated?: boolean;
}

