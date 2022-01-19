import { MultipleResponse, SingleResponse } from './response';

import { AssignmentResponse } from './assignment.response';
import { OrderResponse } from './order.response';

export interface RecordResponse {
  id?: number;
  type?: string;
  identifier?: string;
  value?: string;
  comment?: string;
  source_type?: string;
  source_id?: number;
  reference_type?: string;
  reference_id?: number;
}
export interface BudgetResponse {
  id?: number;
  planned?: number;
  consumed?: number;
  available?: number;
  records?: MultipleResponse<RecordResponse>;
  assignments?: MultipleResponse<AssignmentResponse>;
  name?: string;
  client_id?: number;
  client?: SingleResponse<any>;
  order?: SingleResponse<OrderResponse>;
  creator?: SingleResponse<any>;
  value?: number;
  count_assignments?: number;
  remarks?: string;
  data?: any[];
  contacts?: MultipleResponse<any>;
}
