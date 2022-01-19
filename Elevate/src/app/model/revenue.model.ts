export interface SalesVolumeVM {
  saleslot?: string;
  value?: number;
}

export interface RevenueVM {
  id?: number;
  total?: number;
  job_id?: number;
  freelancer_id?: number;
  comment?: string;
  sales_volume?: SalesVolumeVM;
  assignment_ids?: number[];
  average?: number;
  warning_threshold?: number;
  created_at?: string;
  creator?: { data: any };
}

