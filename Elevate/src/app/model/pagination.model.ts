export interface PaginationVM {
  count?: number;
  current_page?: number;
  links?: any[];
  per_page?: number;
  total?: number;
  total_pages?: number;
}
export interface PagedResult<T> {
  pageInfo: PaginationVM;
  list: T[];
  data?: any;
  meta?: any;
}
