import { BudgetVM } from './budget.model';

export interface OrderVM {
  id?: number;
  name?: string;
  state?: string;
  ordered_at?: string | null;
  required_assignments?: number;
  remarks?: string;
  data?: any;
  assignment_budget?: any;
  client_id?: number;
  budget_id?: number;
  incentive_model_id?: number;
  number?: any;
  clientName?: string;
  budgetSummary?: string;
  orderedAt?: string;
  assignments?: string;
  stateName?: string;
  client?: any;
  budget?: BudgetVM;
  budgets?: BudgetVM[];
}
export interface OrderSearchVM {
  search?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
