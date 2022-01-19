import { SingleResponse } from './response';

export interface OrderResponse {
  id?: number;
  name?: string;
  state?: string;
  ordered_at?: string | null;
  required_assignments?: number;
  remarks?: string;
  data?: any[];
  assignment_budget?: any;
  client_id?: number;
  budget_id?: number;
  incentive_model_id?: number;
  number?: any;
  client?: SingleResponse<any>
  budget?: SingleResponse<any>
}
