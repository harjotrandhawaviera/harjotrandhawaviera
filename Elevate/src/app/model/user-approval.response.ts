export interface ApprovalResponse {
  type?: string;
  state?: string;
  comment?: null;
  id?: number;
  document_id?: number;
  created_at?: string;
  updated_at?: string;
}
export interface UserApprovalResponse {
  master?: ApprovalResponse;
  appearance?: ApprovalResponse;
  qualifications?: ApprovalResponse;
  legal?: ApprovalResponse;
  employment?: ApprovalResponse;
  contract_freelancer?: ApprovalResponse;
  contract_tax_card?: ApprovalResponse;
}
