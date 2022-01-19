import { AgentVM } from "../../model/agent.model";

export interface UserSearchVM {
  search?: string;
  role?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}

export interface AdminVM {
  gender?: "M" | "F";
}

export interface UserVM {
  id?: number;
  active_at?: string;
  confirmed_at?: string;
  contract_type_pending?: boolean;
  created_at?: string;
  created_by?: string;
  deactivated_at?: string;
  deactivated_by?: string;
  deactivated_reason?: string;
  disabled_at?: string;
  disabled_by?: string;
  disabled_reason?: string;
  email?: string;
  fullname?: string;
  gtc_blocked?: boolean;
  has_requested_password_reset?: boolean;
  is_confirmed?: boolean;
  is_deactivated?: boolean;
  is_disabled?: boolean;
  legal_blocked?: boolean;
  legal_reminder?: boolean;
  role?: string;
  status?: string;
  updated_at?: string;
  username?: string;
  freelancer?: any;
  agent?: AgentVM;
  admin?: AdminVM;
  rights?: (string | undefined)[];
  name?: string;
  firstname?: string;
  role_id?: number;
  preamble?: boolean;
  online?: any;
}

export interface RightsVM {
  id?: number;
  identifier?: string;
}
