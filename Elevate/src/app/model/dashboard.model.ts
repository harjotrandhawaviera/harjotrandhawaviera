export interface DashboardLoad {
  attend?: string;
}

export interface DashboardResponse {
  title?: string;
  firstname?: string;
  lastname?: string;
  count?: number;
  city?: string;
  start_time?: string;
}

export interface NewsList {
  meta?: any;
  lists?: string;
  data?: any;
  aggregation?: {
    bills_total_sum: string;
    assignments_billable_not_billed_total_sum: number
  };
}