import { MultipleResponse } from './response';

export interface DocumentResponse {
  id?: number;
  original_filename?: string;
  url?: string;
  mime?: string;
  size?: number;
  is_collection?: boolean;
  document_ids?: number[];
  documents?: MultipleResponse<DocumentResponse>;
}

export interface AssignmentDocumentResponse {
  id?: number;
  document_id?: number;
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
}
