import { ExamResponse, TrainingResponse } from './exam.response';

import { SingleResponse } from './response';
import { UserShortResponse } from './user.response';

export interface CertificateResponse {
  id?: number;
  identifier?: string;
  name?: string;
  teaser?: string;
  exam_result?: any;
  invalid_at?: string;
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
  exam?: SingleResponse<ExamResponse>;
  training?: SingleResponse<TrainingResponse>;
  creator?: SingleResponse<UserShortResponse>;
}
