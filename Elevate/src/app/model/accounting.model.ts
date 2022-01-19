export interface Accounting {
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
  freelancer_ratings?: string[];
  assignment_budget?: number;
  wage?: number;
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
  revenues?: any[];
  update_associated?: boolean;
  isDanger?: boolean;
}

export interface AccountingVM {
  agent_id?: number;
  assignment_budget?: number;
  briefing?: string;
  budget_id?: number;
  category?: string;
  certificate_ids?: number[];
  contact_id?: number;
  contract_type?: any;
  contract_type_id?: number;
  contract_type_identifier?: string;
  data?: {
    bar_sdf?: string;
    fup?: string;
    other?: string;
  };
  description?: string;
  finish_time?: string;
  freelancer_ratings?: string[];
  id?: number;
  incentive_model_id?: number;
  information?: string;
  is_creator?: boolean;
  project_id?: number;
  site_client_contact?: any;
  site_id?: number;
  site_ids?: number[];
  start_time?: string;
  state?: string;
  title?: string;
  wage?: string;
  revenues?: any[];
}
export interface AccountingSearchVM {
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

export interface AccountingExportVM {
  number: string;
  total: string;
  client: string;
  comment: string;
}

export interface AccountingDetailExportVM {
  jobname: string;
  appointed_at: string;
  start_time: string;
  finish_time: string;
  reported_times: string;
  expert_advisor: string;
  comment: string;
  cost_customer: string;
  correction: string;
}

export interface UpdateInvoice {
  assignment_ids: [];
  classes: string;
  client: {};
  clientName: string;
  client_id: number;
  comment: string;
  issuedAt: string;
  issued_at: string;
  number: number;
  total: number;
  totalSum: number;
}
export interface AccountingRevenuesVM {
  created_at: any;
  title: any;
  name: any;
  total: any;
}
export interface AccountingFileSearchVM {
  type?: string;
  value?: any;
  types?: any;
  total?: any;
  bills?: any;
  name?: any;
  size?: any;
  s_date?: any;
  date?: any;
  e_date?: any;
}
export interface AccountFilesDocumentList {
  data?: {
    document_ids?: string;
    id?: number;
    is_collection?: boolean;
    mime?: string;
    original_filename?: string
    size?: string;
    url?: string | undefined;
  };
}

export interface  AccountExportSearch {
  type?: string;
  s_date?: any;
  e_date?: any;
}
