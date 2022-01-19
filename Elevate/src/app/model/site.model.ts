import { ClientVM } from './client.model';
import { ContactVM } from './contact.model';

export interface SiteVM {
  id?: number;
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
  contact?: ContactVM;
  client?: ClientVM;
  cities?: string[];
  contractType? : string;
  certificate?: string;
  skill?: string;
}
