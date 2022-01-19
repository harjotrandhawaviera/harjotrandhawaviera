import { CertificateVM } from './certificate.model';
import { DocDataVM } from './freelancer.model';
import { DocumentVM } from './document.model';

export interface AnswerVM {
  id?: number;
  answer?: string;
}
export interface QuestionVM {
  id?: number;
  question?: string;
  answers?: AnswerVM[];
}
export interface ExamVM {
  id?: number;
  name?: string;
  description?: string;
  certificate?: CertificateVM;
  is_enabled?: boolean;
  minimum_percent?: number;
  is_legal?: boolean;
  jobCount?: number | undefined;
  questions?: QuestionVM[];
}
export interface ExamInstanceVM {
  id?: number;
  exam_id?: number;
  created_at?: any;
  updated_at?: any;
  finished_at?: string;
  passed?: boolean;
  questions?: number;
  questions_ok?: number;
  questions_nok?: number;
  question_nok_questions?: string[]
  exam?: ExamVM;
}
export interface TrainingVM {
  id?: number;
  name?: string;
  description?: string;
  content?: string;
  is_enabled?: boolean;
  exam_id?: number;
  exam?: ExamVM;
}


export interface referenceDetailsVM {
  name?: string;
  relationship?: string;
  email?: string;
  contact_number?: string;
  freelancer_id?: number;
  isVerification?: boolean;
  document_id?: number;
  document?: DocumentVM;
}


export interface TrainingDetailsVM {
  name?: string;
  description?: string;
  issuing_organization?: string;
  issue_date?: string | undefined | null;
  freelancer_id?: number;
  document_id?: number;
  id?: number;
  document?: DocDataVM;
}
export interface RoleVM {
  role_id?: number;
  role_label?: string;
  role_description?: string;
}

export interface SkillDocumentsVM {
  document?: DocDataVM;
  skill_id?: number;
  freelancer_id?: number;
}
export interface workHistoriesVM {
  job_title?: string;
  description?: string;
  company_name?: string;
  is_current_company?: string;
  freelancer_id?: number;
  document_id?: number;
  id?: number;
  document?: DocDataVM;
  start_from?: string;
  till?: string;
}