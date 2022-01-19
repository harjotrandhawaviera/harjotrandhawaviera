export interface TodosList {
  lists?: string;
  params?: string;
  data?: any[];
}

export interface TodoResponse {
  id?: number;
  name?: string;
  state?: string;
  ordered_at?: string;
  required_assignments?: number;
  remarks?: string;
  data?: any[];
  assignment_budget?: any;
  client_id?: number;
  budget_id?: number;
  incentive_model_id?: number;
  number?: any;
  lists?: string;
  params?: string;
}

export interface TodosDetailExportVM {
  jobname: string;
  appointed_at: string;
  start_time: string;
  finish_time: string;
  reported_times: string;
  expert_advisor: string;
  comment: string;
  cost_customer: string;
  correction: string;
}

export interface TodosSearchVM {
  search?: string;
  client_id?: string;
  agent?: string;
  pageSize?: number;
  pageIndex?: number;
  status?: string;
  created_by?: string;
}

export interface TodoUpdateModel {
  createdAt: string;
  created_at: string;
  creatorName: string;
  important: boolean;
  isDone: boolean;
  creator: string;
  owner: {};
  isOverdued: boolean;
  ownerFullname: string;
  owner_id: number;
  state: string;
  subject: string;
  targetAt: string;
  target_at: string;
  updated_at: string;
  todosId: number;
}

export interface TodoAddModel {
  owner_id: number;
  important: boolean;
  subject: string;
  target_at: string;
}

export interface TodoUpdateModelResponse {
  created_at: string;
  id: number;
  important: boolean;
  owner_id: number;
  state: string;
  subject: string;
  target_at: string;
  updated_at: string;
  name?: string;
  ordered_at?: string;
  required_assignments?: number;
  remarks?: string;
  data?: any;
  assignment_budget?: any;
  client_id?: number;
  budget_id?: number;
  incentive_model_id?: number;
  number?: any;
  lists?: string;
  params?: string;
}
