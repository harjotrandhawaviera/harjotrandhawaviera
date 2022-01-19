import { ExamVM, TrainingVM } from './exam.model';

import { UserShortVM } from './user.model';

export interface CertificateVM {
  id?: number;
  identifier?: string;
  name?: string;
  teaser?: string;
  state?: string;

  passed?: boolean;
  descriptionShort?: string;
  category?: string;
  picture_id?: number;
  training_id?: number;
  exam_id?: number;
  description?: string;
  is_recommended?: boolean;
  is_exclusive?: boolean;
  job_count?: number;
  tenders_count?: number;
  tenders_count_all?: number;
  created_at?: string;
  data?: {
    migration?: string;
  };
  job_count_by_tenders?: number;
  is_enabled?: boolean;
  valid_interval?: string | null;
  is_legal?: boolean;
  passed_at?: string;
  invalid_at?: string;
  exam?: ExamVM;
  training?: TrainingVM;
  creator?: UserShortVM;
  classes?: string;
}

export interface CertificateSearchVM {
  search?: string;
  attributes?: string[];
  recommendation?: string[];
  category?: string;
  type?: string;
  legal?: boolean;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
