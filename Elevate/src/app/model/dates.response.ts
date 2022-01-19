import { BudgetResponse } from "./budget.response";
import { JobResponse } from "./job.response";
import { SingleResponse } from "./response";

export interface DatesResponse {
  id?: number;
  agent_id?: number;
  appointed_at?: string;
  assignment_budget?: number;
  briefing?: string;
  budget?: SingleResponse<BudgetResponse>;
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
  job?: SingleResponse<JobResponse>;
  data?: any[];
  incentive_model_id?: number;
  information?: string;
  role_name?: string;
  shift_name?: string;
  assignment_id?: string;
}
