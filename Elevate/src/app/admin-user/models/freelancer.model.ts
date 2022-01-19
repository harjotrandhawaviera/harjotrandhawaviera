import { MultipleResponse, SingleResponse } from "../../model/response";

import { CertificateVM } from "../../model/certificate.model";
import { UserResponse } from "../../model/user.response";
import { UserVM } from "./user.model";

export interface AggregateAssignmentRatingsVM {
  all_values?: string;
  assignments_count?: number;
  average_value?: string;
  criteria?: string;
}

export interface ApprovalsVM {
  comment?: string;
  state?: string;
  type?: string;
}

export interface ContractTypesVM {
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

export interface DocumentsVM {
  document?: SingleResponse<DocDataVM>;
  id?: number;
  type?: string;
  url?: string;
}

export interface DocDataVM {
  document_ids?: number[];
  documents?: MultipleResponse<DocDataVM>;
  id?: number;
  is_collection?: boolean;
  mime?: string;
  original_filename?: string;
  size?: string;
  url?: string;
}

export interface GtcsVM {
  accepted_at?: string;
  comment?: string;
  contract_type_id?: 1
  data?: { migration?: string; }
  document_id?: number;
  documents?: MultipleResponse<DocDataVM>;
  freelancer_id?: number;
  id?: number;
  identifier?: string;
  invalid_at?: string;
  is_current?: boolean;
  published_at?: string;
  valid_at?: string;
}

export interface PictureVM {
  id?: number;
  mime?: string;
  original_filename?: string;
  size?: string;
  url?: string;
}

export interface QualificationsVM {
  achieved_at?: string;
  description?: string;
  document?: SingleResponse<DocDataVM>;
  document_id?: number
  freelancer_id?: number
  id?: number;
  name?: string;
}

export interface RatingsVM {
  comment?: string;
  created_at?: string;
  creator?: SingleResponse<CreatorVM>;
  freelancer_id?: number;
  id?: number;
  rate?: number;
  updated_at?: string;
  user_id?: number;
}

export interface CreatorVM {
  email?: string;
  id?: number;
  name?: string;
  role?: string;
}

export interface ReferncesVM {
  company?: string;
  description?: string;
  document?: SingleResponse<DocDataVM>;
  document_id?: number;
  finished_at?: string;
  freelancer_id?: number;
  id?: number;
  is_current?: boolean;
  started_at?: string;
  title?: string;
}

export interface RequestsVM {
  action?: string;
  created_at?: string;
  data?: {
    original?: SingleResponse<OriginalReqDataVM>;
  };
  deleted_at?: string;
  id?: number;
  params?: {
    freelancer_id?: number,
    contract_type_identifier?: string;
  };
  type?: string;
  updated_at?: string;
}

export interface OriginalReqDataVM {
  contract_type_ids?: number[];
  documents?: {
    current?: {};
    original?: {};
    pending?: [];
  };
  gtcDocs?: GTCDocsVM[];
  id?: number;
  is_vat_tax_liable?: boolean;
  tax_number?: string;
  vat_tax_id?: string;
}

export interface GTCDocsVM {
  confirmation_type?: string;
  contract_type_identifier?: string;
  description?: string;
  freelancer_document_id?: number;
  freelancer_documents?: DocumentDataVM[];
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

export interface DocumentDataVM {
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

export interface FreelancerVM {
  address?: string;
  address2?: string;
  addressaddition?: string;
  addressaddition2?: string;
  age?: number;
  aggregated_assignment_rating?: AggregateAssignmentRatingsVM[];
  aggregated_freelancer_rating?: number;
  alternative_phone?: string;
  mobile_contry_code?: string;
  mobile_contry_code2?: string;
  mobile_dial_code?: string;
  mobile_dial_code2?: string;
  approvals?: MultipleResponse<ApprovalsVM>;
  approved_at?: string;
  approved_by?: string;
  avg_assignment_rating?: string;
  avg_rating?: string;
  bankaccount_holder?: string;
  bankname?: string;
  bic?: string;
  birthcountry?: string;
  birthdate?: string;
  birthplace?: string;
  body?: string;
  body_picture_id?: number;
  certificates?: MultipleResponse<CertificateVM>;
  chest?: number;
  child_tax_allowance?: string;
  city?: string;
  city2?: string;
  contract_type_ids?: number[];
  contract_types?: MultipleResponse<ContractTypesVM>;
  count_checkins_last_year?: number;
  count_checkins_total?: number;
  country?: string;
  country2?: string;
  created_at?: string;
  created_by?: string;
  deleted_at?: string;
  deleted_by?: string;
  denomination?: string;
  documents?: MultipleResponse<DocumentsVM>;
  face_picture_id?: number;
  firstname?: string;
  fullname?: string;
  gender?: string;
  gtcs?: MultipleResponse<GtcsVM>;
  haircolor?: string;
  pants?: string;
  shoesize?: number;
  has_current_gtc_accepted?: boolean;
  has_driverslicense?: boolean;
  health_insurance_id?: string;
  health_insurance_number?: string;
  height?: number;
  hip?: number;
  iban?: string;
  id?: number;
  expiry_date?: string;
  id_number?: string;
  is_approved?: boolean;
  is_vat_tax_liable?: boolean;
  languages?: string[];
  lastname?: string;
  legal_documents_blocking?: boolean;
  legal_documents_reminder?: boolean;
  mobile?: string;
  nationality?: string;
  nationality_name?: string;
  near_to_city?: string;
  near_to_city2?: string;
  pictures?: MultipleResponse<PictureVM>;
  profession?: string;
  qualifications?: MultipleResponse<QualificationsVM>;
  ratings?: MultipleResponse<RatingsVM>;
  references?: MultipleResponse<ReferncesVM>;
  requests?: MultipleResponse<RequestsVM>;
  shirtsize?: string;
  socialsecurity_number?: string;
  tax_class?: string;
  tax_id?: string;
  tax_number?: string;
  title?: string;
  type?: string;
  updated_at?: string;
  updated_by?: string;
  user?: SingleResponse<UserVM>;
  vat_tax_id?: string;
  waist?: number;
  zip?: string;
  zip2?: string;
}
