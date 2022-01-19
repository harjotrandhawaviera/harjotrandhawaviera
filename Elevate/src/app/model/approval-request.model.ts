import { UserVM } from './user.model';

export interface ApprovalRequestVM {
  action?: string;
  created_at?: string;
  deleted_at?: string;
  id?: number;
  freelancer_id?: number;
  params?: {
    freelancer_id?: number;
    contract_type_identifier?: string;
    current_document_id?: number;
    picture_id?: number;
    document_id?: number;
    gtc_document_id?: number;
    gtc_id?: number;
  };
  data?: any;
  type?: string;
  updated_at?: string;
  user?: any;
  profile?: any;
  fullname?: string;
  mobile?: string;
  zip?: string;
  avatarId?: string;
}
export interface ApprovalRequestSearchVM {
  type?: string;
  contractType?: number;
  postcodesMin?: string;
  postcodesMax?: string;
  search?: string;
  action?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
export interface ApprovalRequestExportVM {
  fullname: string;
  email: string;
  mobile: string;
  city: string;
  status: string;
  postcode?: string;
  actionType?: string;
  submissionDate: string;
}

export interface ApproveFreelancerEmail {
  email: string;
  email_confirmation?: string;
  password?: string;
  password_confirmation: string;
}
export interface ApprovalUserListVM {
    id?: number;
}
