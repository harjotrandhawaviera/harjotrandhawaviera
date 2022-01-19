import { PaginationResponse } from './pagination.response';

export class MultipleResponse<T> {
  data?: T[];
  meta?: {
    count?: number;
    email?: string;
    date?: string;
    locale?: string;
    pagination?: PaginationResponse;
    time?: string;
    summary?: any;
    timezone?: string;
    invoiced_sum?: string;
    planned_sum?: string;
  }
}

export class SingleResponse<T> {
  data?: T;
}
