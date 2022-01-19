import { MultipleResponse, SingleResponse } from './response';

import { CertificateResponse } from './certificate.response';
import { DateTimeResponse } from "./datetime.response";

export interface AnswerResponse {
  id?: number;
  answer?: string;
}
export interface QuestionResponse {
  id?: number;
  question?: string;
  answers?: MultipleResponse<AnswerResponse>;
}
export interface ExamResponse {
  id?: number;
  name?: string;
  description?: string;
  is_enabled?: boolean;
  minimum_percent?: number;
  questions?: MultipleResponse<QuestionResponse>;
  certificate?: SingleResponse<CertificateResponse>;
}
export interface ExamInstanceResponse {
  id?: number;
  exam_id?: number;
  created_at?: DateTimeResponse;
  updated_at?: DateTimeResponse;
  finished_at?: string;
  passed?: boolean;
  questions?: number;
  questions_ok?: number;
  questions_nok?: number;
  question_nok_questions?: string[];
  exam?: SingleResponse<ExamResponse>;
}
export interface TrainingResponse {
  id?: number;
  name?: string;
  description?: string;
  content?: string;
  is_enabled?: boolean;
  exam_id?: number;
  exam?: ExamResponse;
}
