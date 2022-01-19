import { ContactVM } from "./contact.model";

export interface UserVM {
  id?: number;
  username?: string;
  fullname?: string;
  email?: string;
  is_disabled?: boolean;
  is_deactivated?: boolean;
  contact?: ContactVM;
  role?:  string;
  rights?: string[];
  is_confirmed?: boolean;
  status?: string;
  freelancer?: any;
  active_at?: string;
  created_at?: string;
  updated_at?: string;
  confirmed_at?: string;
  has_requested_password_reset?: boolean;
  deactivated_at?: string;
  deactivated_by?: string;
  deactivated_reason?: string;
  disabled_at?: string;
  disabled_by?: string;
  disabled_reason?: string;
  legal_blocked?: boolean;
  legal_reminder?: boolean;
  gtc_blocked?: boolean;
  contract_type_pending?: boolean;
  name?: string;
  firstname?: string;
  role_id?: number;
  preamble?: boolean;
  agent_id?: number;
}
export interface UserShortVM {
  id?: number;
  name?: string;
  role?: string;
}
