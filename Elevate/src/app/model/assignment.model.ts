import { AdditionalCostVM } from './project.model';
import { AgentVM } from './agent.model';
import { AssignmentDocumentVM } from './document.model';
import { CertificateVM } from './certificate.model';
import { IncentiveModelResponse } from './incentive_model.response';
import { IncentiveModelVM } from './incentive_model.model';
import { JobVM } from './job.model';
import { SalesSlotVM } from './client.model';

export interface AssignmentSearchVM {
  agent?: string;
  project?: string;
  site?: string;
  job?: string;
  contractType?: string;
  states?: string[];
  only_missing_docs?: string;
  freelancer?: string;
  invoiceState?: string;
  onlyBillable?: string;
  onlyBilled?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}

export interface CustomerAssignmentSearchVM {
  client?: string;
  agent?: string;
  project?: string;
  site?: string;
  contractType?: string;
  states?: string[];
  creator?: string;
  createdFrom?: string;
  createdTo?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}

export interface CheckinsSearchVM {
  project?: string;
  site?: string;
  freelancer?: string;
  search?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}

export interface AssignmentVM {
  id?: number;
  date_id?: number;
  budget_id?: number;
  incentive_model_id?: number;
  incentive_model?: IncentiveModelVM;
  certificate_ids?: number[];
  certificates?: CertificateVM[];
  contact_id?: number;
  agent_id?: number;
  agent?: AgentVM;
  assignment_budget_correction?: any;
  appointed_at?: any;
  state?: string;
  category?: string;
  description?: string;
  information?: string;
  briefing?: string;
  assignment_budget?: number;
  wage?: number;
  start_time?: string;
  finish_time?: string;
  role_name?: string;
  checkin_location?: string;
  data?: any[];
  job?: JobVM;
  feedback?: {
    question?: string;
    type?: string;
  }[];
  freelancer_assignment_questionnaire_instance_id?: number;
  freelancer_assignment_feedback_instance_id?: number;
  freelancer_costs_net?: number;
  documents?: any;
  saleslots?: SalesSlotVM[];
  freelancer_ratings?: string[];
  additional_costs?: AdditionalCostVM[];
  has_missing_docs?: boolean;
  comment?: string;
  questionnaire?: string;
  has_invoice_requirements?: boolean;
  contract_type_id?: number;
  contract_type_identifier?: string;
  date?: any;
  rate?: any;
  currency?: any;
  rate_type?: any;
  user?: any;
  planned_costs?: number;
  checkins?: any;
  freelancer_id?: number;
  freelancers?: any;
  invoices?: any;
  revenues?: any;
  is_billed?: boolean;
  is_booked?: boolean;
  is_creator?: boolean;
  is_prepareable?: boolean;
  is_done?: boolean;
  tenders?: any;
  sedcardLink?: any;
  appointedDateTime?: any;
  startDateTime?: any;
  categoryName?: string;
  client?: any;
  clientName?: string;
}

export interface AssignmentDocumentChangesVM {
  newDocuments: AssignmentDocumentVM[];
  updatedDocuments: AssignmentDocumentVM[];
  deletedDocuments: number[];
}

export interface AssignmentExportVM {}
