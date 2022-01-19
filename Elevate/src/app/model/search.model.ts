export interface SearchRequestVM {
  sort_by_column?: string;
  limit?: number | undefined;
  page?: number | undefined;
  include?: string[] | undefined;
  order_by?: string | undefined;
  order_dir?: string | undefined;
  contractType?: number | undefined;
  filters?: { key: string; value: string | number | boolean }[] | undefined;
  only_fields?: string[] | undefined;
}
export interface IdRequestVM {
  id?: number | string | undefined;
  limit?: number | undefined;
  page?: number | undefined;
  include?: string[] | undefined;
  order_by?: string | undefined;
  order_dir?: string | undefined;
  filters?: { key: string; value: string | number | boolean }[] | undefined;
  only_fields?: string[] | undefined;
}
export interface ProjectSearchRequest {
  // fields
  limit: number | undefined;
  page: number | undefined;
  include: string[] | undefined;
  order_by: string | undefined;
  order_dir: string | undefined;
  filters: any | undefined;
  only_fields: string[] | undefined;

  order: string | undefined;
  client_id: string | undefined;
  agent_id: string | undefined;
  state: string | undefined;
  contract_type_id: string | undefined;
}
export interface ProjectSearchRequestVM {
  // fields
  order: string | undefined;
  client: string | undefined;
  agent: string | undefined;
  state: string | undefined;
  contractType: string | undefined;
  pageIndex: number | undefined;
  pageSize: number | undefined;
  orderBy: string | undefined;
  orderDir: string | undefined;
}
