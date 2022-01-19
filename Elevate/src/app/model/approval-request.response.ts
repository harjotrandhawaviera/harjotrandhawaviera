import { SingleResponse } from './response';
import { UserResponse } from './user.response';

export interface ApprovalRequestResponse {
  action?: string;
  created_at?: string;
  deleted_at?: string;
  id?: number;
  data: any;
  params?: {
    freelancer_id?: number;
    contract_type_identifier?: string;
    current_document_id?: number;
    picture_id?: number;
    document_id?: number;
    gtc_document_id?: number;
    gtc_id?: number;
  };
  type?: string;
  updated_at?: string;
  user?: SingleResponse<UserResponse>;
  profile?: SingleResponse<any>;
}
