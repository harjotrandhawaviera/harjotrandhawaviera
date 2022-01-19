import { RoleVM, SkillDocumentsVM, TrainingDetailsVM, workHistoriesVM } from './exam.model';

import { CertificateVM } from './certificate.model';
import { DocumentVM } from './document.model';
import { UserVM } from './user.model';

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

export interface FreelancerContractType {
  id?: number | null;
  identifier?: string | null | undefined;
  name?: string | null | undefined;
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

export interface FreelancerDocumentsVM {
  document?: DocumentVM;
  id?: number;
  type?: string;
  url?: string;
}

export interface GTCSDocVM {
  freelancer_id?: number;
  gtc_document_id?: number;
  freelancer_document_id?: number;
  freelancer_documents?: FreelancerDocumentsVM[];
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
  type?: string;
  name?: string;
  contract_type_identifier?: string;
  document?: DocDataVM;
}
export interface GTCSVM {
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
  documents?: GTCSDocVM[];
}

export interface PictureVM {
  id?: number;
  mime?: string;
  original_filename?: string;
  size?: string;
  url?: string;
}

export interface QualificationsVM {
  start_date?: string;
  end_date?: string;
  description?: string;
  grade?: string;
  document?: DocDataVM;
  document_id?: number;
  fieldofstudy?: string
  freelancer_id?: number;
  id?: number;
  degree?: string;
  school_college_university?: string;
}

export interface RatingsVM {
  comment?: string;
  created_at?: string;
  creator?: CreatorVM;
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
export interface DocDataVM {
     data?: {
    document_ids?: number[];
    documents?: DocDataVM[];
    id?: number;
    is_collection?: boolean;
    mime?: string;
    original_filename?: string;
    size?: number;
    url?: string;
  }
  document_ids?: number[];
  documents?: DocDataVM[];
  id?: number;
  is_collection?: boolean;
  mime?: string;
  original_filename?: string;
  size?: number;
  url?: string;
}
export interface ReferncesVM {
  name?: string;
  relationship?: string;
  document?: DocDataVM;
  document_id?: number;
  email?: string;
  contact_number?: string;
  freelancer_id?: number;
  id?: number;
  isVerification?: boolean;
}


export interface WorkHistoryVM {
  job_title?: string;
  company_name?: string;
  document?: DocDataVM;
  document_id?: number;
  is_current_company?: string;
  start_from?: string;
  freelancer_id?: number;
  id?: number;
  description?: string;
  till?: string;
}
export interface SkillsVM {
  skill_id?: number;
  document?: DocDataVM;
  document_id?: number;
  skillcategory?: string;
  skillName?: string;
  skill_category_id?: number;
  id?: number;
  required_proof?: number;
  title?: string;
}


export interface RolesVM {
  role_id?: number;
  role_description?: string;
  role_label?: string;
}


export interface legalDocumentsVM {
  document_name?: string;
  document_number?: string;
  document?: DocDataVM;
}

export interface IdentitydocumentsVM {
  id_name?: string;
  id_number?: string;
  expiry_date?: string;
  document_id?: number;
  document: DocDataVM;
  freelancer_id?: number;
  id?: number;
}

export interface RequestsVM {
  action?: string;
  created_at?: string;
  data?: {
    original?: OriginalReqDataVM;
  };
  deleted_at?: string;
  id?: number;
  params?: {
    freelancer_id?: number;
    contract_type_identifier?: string;
    picture_id?: string;
    document_id?: number;
    gtc_id?: number;
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
  account_number?: string | null | undefined;
  address?: string | null | undefined;
  address2?: string | null | undefined;
  addressaddition?: string | null | undefined;
  addressaddition2?: string | null | undefined;
  age?: number;
  aggregated_assignment_rating?: AggregateAssignmentRatingsVM[];
  aggregated_freelancer_rating?: number;
  alternative_phone?: string | null | undefined;
  mobile_contry_code?: string | null | undefined;
  mobile_contry_code2?: string | null | undefined;
  mobile_dial_code?: string | null | undefined;
  mobile_dial_code2?: string | null | undefined;
  approvals?: ApprovalsVM[];
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
  addresses?: any[];
  certificates?: CertificateVM[];
  chest?: number | null;
  child_tax_allowance?: string | null | undefined;
  city?: string | null | undefined;
  city2?: string | null | undefined;
  contract_type_ids?: number[];
  contract_types?: ContractTypesVM[];
  count_checkins_last_year?: number;
  count_checkins_total?: number;
  country?: string | null | undefined;
  country2?: string | null | undefined;
  created_at?: string | null | undefined;
  created_by?: string | null | undefined;
  deleted_at?: string | null | undefined;
  deleted_by?: string | null | undefined;
  deleteIdentityCard?: any;
  denomination?: string | null | undefined;
  documents?: any;
  face_picture_id?: number | null | undefined;
  firstname?: string | null | undefined;
  fullname?: string | null | undefined;
  gender?: string | null | undefined;
  online?: boolean;
  gtcs?: GTCSVM[];
  gtcsDoc?: GTCSDocVM[];
  gtcsDoc1?: { [key: number]: GTCSDocVM };
  haircolor?: string | null | undefined;
  pants?: string | null | undefined;
  shoesize?: number | null;
  has_current_gtc_accepted?: boolean;
  has_driverslicense?: boolean;
  health_insurance_id?: string | null | undefined;
  health_insurance_number?: string | null | undefined;
  height?: number | null;
  hip?: number | null;
  iban?: string | null | undefined;
  id?: number;
  expiry_date?: string | null | undefined;
  id_number?: string | null | undefined;
  id_name?: string | null | undefined;
  is_approved?: boolean;
  is_vat_tax_liable?: boolean;
  languages?: string | null;
  lastname?: string | null | undefined;
  license?: any;
  locality?: string | null | undefined;
  locality_alternative?: string | null | undefined;
  legal_documents_blocking?: boolean;
  legal_documents_reminder?: boolean;
  mobile?: string | null | undefined;
  nationality?: string | null | undefined;
  nationality_name?: string | null | undefined;
  near_to_city?: string | null | undefined;
  near_to_city2?: string | null | undefined;
  pictures?: PictureVM[];
  orgPictures?: any;
  orgDocuments?: any;
  profession?: string | null | undefined;
  qualifications?: QualificationsVM[];
  ratings?: RatingsVM[];
  references?: ReferncesVM[];
  resume?: any;
  resume_detail?: any;
  legalDocuments?: legalDocumentsVM[];
  requests?: RequestsVM[];
  shirtsize?: string | null | undefined;
  socialsecurity_number?: string | null | undefined;
  health_insurance_type?: string | null | undefined;
  tax_class?: string | null | undefined;
  tax_id?: string | null | undefined;
  tax_number?: string | null | undefined;
  title?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: string | null | undefined;
  updated_by?: string | null | undefined;
  user?: UserVM;
  vat_tax_id?: string | null | undefined;
  waist?: number | null;
  zip?: string | null | undefined;
  zip2?: string | null | undefined;
  duplicates?: any;
  about_me?: string | null | undefined;
  identityDocuments?: IdentitydocumentsVM[];
  trainingAndCertificates?: TrainingDetailsVM[];
  work_preference?: [];
  primary_role?: RoleVM[];
  secondry_role?: RoleVM[];
  skills?: SkillsVM[];
  skill_documents?: SkillDocumentsVM[];
  workHistories?: workHistoriesVM[];
  industry_exposure?: string[];
  driver_license?: any;
  locality_lat?: string | null | undefined;
  locality_lng?: string | null | undefined;
  bankDetailsDocument?: DocDataVM;
}
export interface FreelancerAssignmentVM {
  additional_costs?: [];
  agent?: [];
  briefing?: string | null | undefined;
  category?: string | null | undefined;
  checkins?: [];
  contract_type?: FreelancerContractType[];
  date?: [];
  description?: string | null | undefined;
  documents?: [];
  feedback?: [];
  finish_time?: string | null | undefined;
  freelancer?: [];
  freelancer_assignment_feedback_instance_id?: number | null;
  freelancer_assignment_questionnaire_instance_id?: number | null;
  has_invoice_requirements?: boolean;
  id?: number | null;
  incentive_model?: [];
  invoices?: [];
  is_prepareable?: boolean;
  offer?: [];
  questionnaire_id?: number | null;
  revenues?: [];
  start_time?: string | null | undefined;
  state?: string | null | undefined;
  wage?: number | null;
  data?: [];
}
export interface FreelancerSearchVM {
  search?: string;
  contractType?: string;
  postcodesMin?: string;
  postcodesMax?: string;
  status?: string[];
  certificates?: string[];
  assignment_rating?: string;
  freelancer_rating?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
export interface FreelancerExportVM {
  id: string | null | undefined;
  firstname: string | null | undefined;
  lastname: string | null | undefined;
  fullname: string | null | undefined;
  gender: string | null | undefined;
  birthdate: string | null | undefined;
  email: string | null | undefined;
  mobile: string | null | undefined;
  alternative_phone: string | null | undefined;
  city: string | null | undefined;
  zip: string | null | undefined;
  address: string | null | undefined;
  profession: string | null | undefined;
  haircolor: string | null | undefined;
  chest: string | null | undefined;
  height: string | null | undefined;
  hip: string | null | undefined;
  pants: string | null | undefined;
  shoesize: string | null | undefined;
  waist: string | null | undefined;
  shirtsize: string | null | undefined;
  stateName: string | null | undefined;
}
