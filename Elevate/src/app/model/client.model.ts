import { ContactVM } from './contact.model';
export interface ClientSearchVM {
  search?: string;
  parent?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}

export interface SalesSlotVM {
  name?: string;
  price?: number;
  description?: string
}

export interface TeamInfoVM {
  name?: string;
  checkin_location?: string;
  role?: string;
  role_name?: string;
  staff_count?: string;
  rate?: string;
  rate_type?: string;
  shift_name?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  break_durtion?: string;
}

export interface TaskInfoVM {
  task_name?: string;
  role?: string;
  role_name?: string;
  shift?: string;
  type?: string;
  remarks?: string;
  files?: string;
}

export interface ClientVM {
  data?: any;
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
  parent_id?: number;
  saleslots?: SalesSlotVM[];
  freelancer_ratings?: string[];
  children_ids?: number[];
  children?: ClientVM[];
  contacts?: ContactVM[];
  parent?: ClientVM;
  isParent?: boolean;
}
