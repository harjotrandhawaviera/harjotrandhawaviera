import { ClientResponse } from './client.response';
import { ContactResponse } from './contact.response';
import { SingleResponse } from './response';

export interface UserResponse {
  id?: number;
  active_at?: string;
  confirmed_at?: string;
  contract_type_pending?: boolean;
  created_at?: string;
  freelancer?: any;
  agent?: any;
  admin?: any;
  contact?: SingleResponse<ContactResponse>;
  creator?: SingleResponse<UserResponse>;
  client?: ClientResponse;
  username?: string;
  email?: string;
  is_disabled?: boolean;
  is_deactivated?: boolean;
  role?: string;
  rights?: (string | undefined)[];
  disabled_by?: string;
  disabled_at?: string;
  disabled_reason?: string;
  deactivated_by?: string;
  deactivated_at?: string;
  deactivated_reason?: string;
  fullname?: string;
  gtc_blocked?: boolean;
  has_requested_password_reset?: boolean;
  is_confirmed?: boolean;
  legal_blocked?: boolean;
  legal_reminder?: boolean;
  status?: string;
  updated_at?: string;
  name?: string;
  firstname?: string;
  role_id?: number;
  preamble?: boolean;
  requests?: any;
}
export interface UserShortResponse {
  id?: number;
  name?: string;
  role?: string;
}
export interface RightsResponse {
  id?: number;
  identifier?: string;
}
