export interface EventLogVM {
  id?: number;
  reference_id?: number;
  reference_model?: string;
  performer_id?: number;
  performer_model?: string;
  performer_name?: string;
  eventname?: string;
  message?: string;
  created_at?: string;
}

export interface CreatedAtVM {
  date?: string;
  timezone_type?: number;
  timezone?: string;
}

export interface EventLogSearchVM {
  pageSize?: number;
  pageIndex?: number;
}
export interface EventLogExportVM {
  createdAt: string;
  performer_name: string;
  message: string;
}
