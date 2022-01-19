import { BudgetVM } from './budget.model';
import { JobVM } from './job.model';

export interface DatesSearchVM {
  agent?: string;
  project?: string;
  job?: string;
  dateFrom?: string;
  dateTo?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}

export interface DatesVM {
  id?: number;
  agent_id?: number;
  appointed_at?: string;
  assignment_budget?: number;
  briefing?: string;
  budget?: BudgetVM;
  budget_id?: number;
  category?: string;
  certificate_ids?: number[];
  contact_id?: number;
  description?: string;
  start_time?: string;
  finish_time?: string;
  state?: string;
  wage?: string;
  job_id?: number;
  job?: JobVM;
  data?: any[];
  incentive_model_id?: number;
  information?: string;
  role_name?: string;
  shift_name?: string;
  assignment_id?: string;
}

export interface DatesExportVM {
  id: string;
  jobtitle: string;
  appointedAt: string;
  start_time: string;
  finish_time: string;
}
