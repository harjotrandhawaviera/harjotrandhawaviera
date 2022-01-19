import { SiteResponse } from './site.response';
import { MultipleResponse, SingleResponse } from "./response";
import { UserResponse } from "./user.response";
import { ClientResponse } from './client.response';

export interface ContactResponse {
  id?: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  addressaddition?: string;
  zip?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  data?: string;
  contact_id?: number;
  contact?: SingleResponse<ContactResponse>;
  user_id?: number;
  user?: SingleResponse<UserResponse>;
  site?: SingleResponse<SiteResponse>;
  clients?: MultipleResponse<ClientResponse>;
  gender?: string;
  is_client_user?: boolean;
  is_field_user?: boolean;
}
