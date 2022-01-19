export interface RoleSearchVM {
  label?: number;
  identifier?: string;
  search?: string;
  page?: number;
  createdBy?: number;
  dateFrom?: string;
  dateTo?: string;
  region?: any[];
  createdDate?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
  sort_by_column?: string;
  order_by?: string;
  filters?: any[];
}

export interface RoleVM {
  id?: number;
  label?: any;
  name?: string;
  region?: any[];
  createdBy?: any;
  createdDate?: string;
  identifier?: string;
  users_count?: number;
  description?: string;
  regions?: any[];
  skills?: any[];
}
