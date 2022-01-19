export interface EventLogResponse {
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

export interface CreatedAtResponse {
  date?: string;
  timezone_type?: number;
  timezone?: string;
}
