export interface AccountingResponse {
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
}

export interface AccountingSearchVM {
  params: string;
}
