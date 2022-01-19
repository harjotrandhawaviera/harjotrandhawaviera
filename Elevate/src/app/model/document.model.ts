export interface DocumentVM {
  data?: {
    id?: number;
  mime?: string;
  original_filename?: string;
  size?: string;
  url?: string;
  is_collection?: boolean;
  document_ids?: number[];
  name?: string;
  description?: string;
  type?: string;
  }
  id?: number;
  mime?: string;
  original_filename?: string;
  size?: string;
  url?: string;
  is_collection?: boolean;
  document_ids?: number[];
  name?: string;
  description?: string;
  type?: string;
}

export interface AssignmentDocumentVM {
  id?: number;
  assignment_id?: number;
  description?: string;
  document_ids?: number[];
  is_collection?: boolean;
  mime?: string;
  name?: string;
  original_filename?: string;
  pending_invoices?: any[];
  size?: string;
  type?: string;
  url?: string;
  job_id?: number;
}
