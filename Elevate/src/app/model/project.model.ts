import { ClientVM, SalesSlotVM } from './client.model';

import { BudgetVM } from './budget.model';
import { CertificateVM } from './certificate.model';
import { ContactVM } from './contact.model';
import { OrderVM } from './order.model';

export interface ProjectDocumentVM {
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
export interface ProjectSummaryVM {
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
export interface ProjectFeedbackQuestionVM {
  question?: string;
  type?: string;
}

export interface AdditionalCostVM {
  name?: string;
  value?: string;
  description?: string;
}

export interface TargetBudgetVM {
  role?: string;
  role_name?: string;
  total?: string;
  per_hour?: string;
  per_shift?: string;
}

export interface ProjectVM {
  created_at?: string;
  id?: number;
  name?: string;
  state?: string;
  started_at?: string;
  finished_at?: string;
  description?: string;
  category?: string;
  information?: string;
  briefing?: string;
  data?: any;
  saleslots?: SalesSlotVM[];
  freelancer_ratings?: string[];
  assignment_budget?: number;
  wage?: number;
  additional_costs?: AdditionalCostVM[];
  feedback?: ProjectFeedbackQuestionVM[];
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
  summary?: ProjectSummaryVM;
  client?: ClientVM;
  contact?: ContactVM;
  order?: OrderVM;
  agent?: any;
  budget?: BudgetVM;
  documents?: ProjectDocumentVM[];
  certificates?: CertificateVM[];
  revenues?: any[];
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
  skills_required?: any;
  staff?: any;
  /**
   * if enabled, exclusive certificates will be updated for jobs/tenders and upcoming assignments, too
   */
  update_associated?: boolean;
  isDanger?: boolean;
}
export interface ProjectSearchVM {
  search?: string;
  client?: string;
  agent?: string;
  contractType?: string;
  state?: string;
  order?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
export interface ProjectExportVM {
  id: string;
  name: string;
  startedAt: string;
  finishedAt: string;
  agentName: string;
  categoryName: string;
  status: string;
  customer: string;
  customerContactName: string;
  clientProperties: string;
  orderName: string;
  orderedAt: string;
  budgetName: string;
  budgetValue: string;
  budgetConsumed: string;
  jobsNumber: string;
  revenueTotal: string;
  sumPlannedCosts: string;
  sumMinEstimatedCosts: string;
  sumMaxEstimatedCosts: string;
  sumFreelancerCosts: string;
}
export interface ProjectDocumentChangesVM {
  newDocuments: ProjectDocumentVM[];
  updatedDocuments: ProjectDocumentVM[];
  deletedDocuments: number[];
}

