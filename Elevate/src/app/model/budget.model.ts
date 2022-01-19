import { AssignmentVM } from './assignment.model';
import { OrderVM } from './order.model';

export interface RecordVM {
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
export interface BudgetVM {
  id?: number;
  planned?: number;
  consumed?: number;
  available?: number;
  records?: RecordVM[];
  assignments?: AssignmentVM[];
  name?: string;
  client_id?: number;
  budget_id?: number;
  value?: number;
  count_assignments?: number;
  remarks?: string;
  contactNames?: string;
  status?: string;
  clientName?: string;
  creatorName?: string;
  client?: any;
  creator?: any;
  data?: any[];
  order?: OrderVM;
  contacts?: any[];
  label?: string;
  formattedValue?: string;
}
export interface BudgetSearchVM {
  search?: string;
  clientId?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
