import { ClientResponse } from './client.response';
import { ContactResponse } from './contact.response';
import { SingleResponse } from './response';

export interface SiteResponse {
  id?: number
  name?: string;
  nameaddition?: string;
  group?: string;
  category?: string;
  number?: string;
  address?: string;
  addressaddition?: string;
  zip?: string;
  zip_min?: string;
  zip_max?: string;
  city?: string;
  country?: string;
  lat?: string;
  lon?: string;
  phone?: string;
  fax?: string;
  email?: string;
  contact_id?: number;
  data?: { [key: string]: any };
  contact?: SingleResponse<ContactResponse>;
  client?: SingleResponse<ClientResponse>;
}
