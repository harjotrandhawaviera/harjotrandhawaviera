import { DocDataVM, IdentitydocumentsVM } from './freelancer.model';
import { MultipleResponse, SingleResponse } from './response';

import { CertificateResponse } from './certificate.response';
import { DocumentResponse } from './document.response';
import { DocumentVM } from './document.model';
import { TrainingResponse } from './exam.response';
import { UserResponse } from './user.response';

export interface AggregateAssignmentRatingsResponse {
  all_values?: string;
  assignments_count?: number;
  average_value?: string;
  criteria?: string;
}

export interface ApprovalsResponse {
  comment?: string;
  state?: string;
  type?: string;
}

export interface SkillsResponse {
  skill_id?: string;
  document?: DocDataVM;
  document_id?: number;
  skillcategory?: string;
  skillName?: string;
}

export interface ContractTypesResponse {
  approved_by?: string;
  certificate_id?: number;
  data?: string;
  description?: string;
  id?: number;
  identifier?: string;
  is_approved?: boolean;
  is_pending?: boolean;
  name?: string;
}

export interface FreelancerDocumentResponse {
  document?: SingleResponse<DocumentResponse>;
  id?: number;
  type?: string;
  url?: string;
}
export interface GTCSDocResponse {
  freelancer_id?: number;
  gtc_document_id?: number;
  freelancer_document_id?: number;
  freelancer_documents?: MultipleResponse<FreelancerDocumentResponse>;
  is_checked?: boolean;
  invalid_at?: string;
  is_approved?: boolean;
  approved_by?: number;
  id?: number;
  gtc_id?: number;
  identifier?: string;
  published_at?: string;
  valid_at?: string;
  comment?: string;
  data?: any;
  contract_type_id?: number;
  confirmation_type?: string;
  reconfirmation_type?: string;
  reconfirmation_index?: string;
  reconfirmation_interval?: string;
  url?: string;
  contract_type_identifier?: string;
  type?: string;
  name?: string;
  document?: SingleResponse<DocumentResponse>;
}
export interface GTCSResponse {
  id?: number;
  is_current?: boolean;
  identifier?: string;
  published_at?: string;
  valid_at?: string;
  invalid_at?: string;
  comment?: string;
  data?: any[]
  contract_type_id?: number;
  freelancer_id?: number
  accepted_at?: string;
  document_id?: number;
  documents?: MultipleResponse<GTCSDocResponse>;
}

export interface PictureResponse {
  id?: number;
  mime?: string;
  original_filename?: string;
  size?: string;
  url?: string;
}

export interface QualificationsResponse {
  start_date?: string;
  end_date?: string;
  description?: string;
  grade?: string;
  document_id?: number;
  document?: DocDataVM;
  fieldofstudy?: string
  freelancer_id?: number;
  id?: number;
  degree?: string;
  school_college_university?: string;
}

export interface TrainingsResponse {
  name?: string;
  issuing_organization?: string;
  description?: string;
  issue_date?: string | null | undefined;
  id?: number;
  // document_id?: number;
  document_id?: number;
  freelancer_id?: number;
  document?: DocDataVM;
}

export interface WorkHistoryResponse {
  job_title?: string;
  company_name?: string;
  is_current_company?: boolean;
  start_from?: string | null | undefined;
  till?: string | null | undefined;
  description?: string | null | undefined;
  id?: number;
  // document_id?: number;
  document_id?: number;
  freelancer_id?: number;
  document?: DocDataVM;
}

export interface IdentitydocumentsResponse {
  id_name?: string;
  id_number?: string;
  expiry_date?: string | null | undefined;
  document_id?: number;
  freelancer_id?: number
  document: DocDataVM;
  id?: number;

}

export interface RatingsResponse {
  comment?: string;
  created_at?: string;
  creator?: SingleResponse<CreatorResponse>;
  freelancer_id?: number;
  id?: number;
  rate?: number;
  updated_at?: string;
  user_id?: number;
}

export interface CreatorResponse {
  email?: string;
  id?: number;
  name?: string;
  role?: string;
}

export interface ReferncesResponse {
  name?: string;
  relationship?: string;
  email?: string;
  contact_number?: string;
  isVerification?: boolean;
  freelancer_id?: number;
  id?: number;
  document?: DocDataVM;
  document_id?: number;
}

export interface RequestsResponse {
  action?: string;
  created_at?: string;
  data?: {
    original?: SingleResponse<OriginalReqDataResponse>;
  };
  deleted_at?: string;
  id?: number;
  params?: {
    freelancer_id?: number;
    contract_type_identifier?: string;
    picture_id?: string;
    document_id?: number;
  };
  type?: string;
  updated_at?: string;
}

export interface OriginalReqDataResponse {
  contract_type_ids?: number[];
  documents?: {
    current?: {};
    original?: {};
    pending?: [];
  };
  gtcDocs?: GTCDocsResponse[];
  id?: number;
  is_vat_tax_liable?: boolean;
  tax_number?: string;
  vat_tax_id?: string;
}

export interface GTCDocsResponse {
  confirmation_type?: string;
  contract_type_identifier?: string;
  description?: string;
  freelancer_document_id?: number;
  freelancer_documents?: DocumentDataResponse[];
  freelancer_id?: number;
  gtc_document_id?: number;
  id?: number;
  invalidDate?: string;
  is_approved?: boolean;
  is_checked?: boolean;
  name?: string;
  order_index?: number;
  original_filename?: string;
  reconfirmation_index?: string;
  reconfirmation_interval?: string;
  reconfirmation_type?: string;
  type?: string;
  url?: string;
}

export interface DocumentDataResponse {
  document_ids?: number[];
  id?: number;
  is_collection?: boolean;
  mime?: string;
  originalFilename?: string;
  original_filename?: string;
  saved?: boolean;
  size?: string;
  url?: string;
}

export interface FreelancerResponse {
  about_me?: string | null | undefined;
  address?: string | null | undefined;
  address2?: string | null | undefined;
  addressaddition?: string | null | undefined;
  addressaddition2?: string | null | undefined;
  age?: number;
  aggregated_assignment_rating?: AggregateAssignmentRatingsResponse[];
  aggregated_freelancer_rating?: number;
  alternative_phone?: string | null | undefined;
  mobile_contry_code?: string | null | undefined;
  mobile_contry_code2?: string | null | undefined;
  mobile_dial_code?: string | null | undefined;
  mobile_dial_code2?: string | null | undefined;
  approvals?: MultipleResponse<ApprovalsResponse>;
  approved_at?: string | null | undefined;
  approved_by?: string | null | undefined;
  avg_assignment_rating?: number;
  avg_rating?: string | null | undefined;
  bankaccount_holder?: string | null | undefined;
  bankname?: string | null | undefined;
  bic?: string | null | undefined;
  birthcountry?: string | null | undefined;
  birthdate?: string | null | undefined;
  birthplace?: string | null | undefined;
  body?: string | null | undefined;
  body_picture_id?: number | null | undefined;
  certificates?: MultipleResponse<CertificateResponse>;
  chest?: number | null;
  child_tax_allowance?: string | null | undefined;
  city?: string | null | undefined;
  city2?: string | null | undefined;
  contract_type_ids?: number[];
  contract_types?: MultipleResponse<ContractTypesResponse>;
  count_checkins_last_year?: number;
  count_checkins_total?: number;
  country?: string | null | undefined;
  country2?: string | null | undefined;
  created_at?: string | null | undefined;
  created_by?: string | null | undefined;
  deleted_at?: string | null | undefined;
  deleted_by?: string | null | undefined;
  denomination?: string | null | undefined;
  documents?: MultipleResponse<FreelancerDocumentResponse>;
  face_picture_id?: number | null | undefined;
  firstname?: string | null | undefined;
  fullname?: string | null | undefined;
  gender?: string | null | undefined;
  gtcs?: MultipleResponse<GTCSResponse>;
  haircolor?: string | null | undefined;
  has_current_gtc_accepted?: boolean;
  has_driverslicense?: boolean;
  health_insurance_id?: string | null | undefined;
  health_insurance_type?: string | null | undefined;
  health_insurance_number?: string | null | undefined;
  height?: number | null;
  hip?: number | null;
  iban?: string | null | undefined;
  id?: number;
  expiry_date?: string | null | undefined;
  id_number?: string | null | undefined;
  is_approved?: boolean;
  is_vat_tax_liable?: boolean;
  languages?: string | null;
  lastname?: string | null | undefined;
  legal_documents_blocking?: boolean;
  legal_documents_reminder?: boolean;
  locality?: string | null | undefined;
  locality_alternative?: string | null | undefined;
  mobile?: string | null | undefined;
  nationality?: string | null | undefined;
  nationality_name?: string | null | undefined;
  near_to_city?: string | null | undefined;
  near_to_city2?: string | null | undefined;
  pants?: string | null | undefined;
  pictures?: MultipleResponse<PictureResponse>;
  profession?: string | null | undefined;
  qualifications?: MultipleResponse<QualificationsResponse>;
  trainingAndCertificates?: MultipleResponse<TrainingsResponse>;
  ratings?: MultipleResponse<RatingsResponse>;
  references?: MultipleResponse<ReferncesResponse>;
  requests?: MultipleResponse<RequestsResponse>;
  resume?: number;
  resume_detail?: [];
  shirtsize?: string | null | undefined;
  shoesize?: number | null;
  socialsecurity_number?: string | null | undefined;
  tax_class?: string | null | undefined;
  tax_id?: string | null | undefined;
  tax_number?: string | null | undefined;
  title?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: string | null | undefined;
  updated_by?: string | null | undefined;
  user?: SingleResponse<UserResponse>;
  vat_tax_id?: string | null | undefined;
  waist?: number | null;
  zip?: string | null | undefined;
  zip2?: string | null | undefined;
  duplicates?: any;
  identityDocuments?: any;
  work_preference?: [];
  primary_role?: [];
  secondry_role?: any;
  skills?: [];
  skill_documents?: [];
  workHistories?: any;
  industry_exposure?: [];
  driver_license?: any;
  locality_lat?: string | null | undefined;
  locality_lng?: string | null | undefined;
  bankDetailsDocument?: DocDataVM;
}
