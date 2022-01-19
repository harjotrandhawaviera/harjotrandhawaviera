import { ContactResponse } from "./contact.response";
import { MultipleResponse, SingleResponse } from "./response";


export interface SalesSlotResponse {
  name?: string;
  price?: number;
  description?: string;
}

export interface ClientResponse {
  id?: string;
  name?: string;
  debitorid?: string;
  address?: string;
  addressaddition?: string;
  phone?: string;
  zip?: string;
  city?: string;
  country?: string;
  email?: string;
  custom_properties?: string[];
  data?: string;
  parent_id?: number;
  parent?: SingleResponse<ClientResponse>;
  saleslots?: SalesSlotResponse[];
  freelancer_ratings?: string[];
  children_ids?: number[];
  children?: MultipleResponse<ClientResponse>
  contacts?: MultipleResponse<ContactResponse>;
}
export interface ClientSearchRequest {
  parent?: string;
  pageSize?: number;
  pageIndex?: number;
  orderBy?: string;
  orderDir?: string;
}
