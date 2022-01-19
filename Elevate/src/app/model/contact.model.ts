import { ClientVM } from './client.model';
import { SiteVM } from './site.model';
import { UserResponse } from './user.response';

export interface ContactVM {
  id?: string;
  salutation?: string;
  displayName?: string;
  isParent?: boolean;
  fullname?: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  addressaddition?: string;
  zip?: string;
  city?: string;
  country?: string;
  data?: string;
  email?: string;
  phone?: string;
  fax?: string;
  position?: string;
  department?: string;
  contact_id?: number;
  contact?: ContactVM;
  user?: UserResponse;
  role?: string;
  parent?: string;
  client?: ClientVM;
  site?: SiteVM;
}
export interface ContactSearchVM {
  search?: string;
  clientId?: string;
  siteId?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
