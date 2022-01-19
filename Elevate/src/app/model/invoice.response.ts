import { MultipleResponse, SingleResponse } from './response';

import { DocumentResponse } from './document.response';

export interface InvoiceResponse {
  id?: number;
  number?: string;
  state?: string;
  comment?: string;
  total?: number;
  issued_at?: Date;
  document_id?: number;
  includes_taxes?: boolean;
  payment_total?: number;
  payment_comment?: string;
  payment_target?: Date;
  assignment_ids?: number[];
  summary?: any;
  with_discount?: boolean;
  freelancer_name?: string;
  approval?: any;
  freelancer_id?: number;
  creator?: any;
  freelancer?: SingleResponse<any>;
  snapshots?: any;
  assignments?: MultipleResponse<any>;
  document?: SingleResponse<DocumentResponse>
}
