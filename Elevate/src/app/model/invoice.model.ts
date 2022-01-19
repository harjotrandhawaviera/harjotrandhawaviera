/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable id-blacklist */

import { DocumentVM } from './document.model';

export interface InvoiceVM {
  id?: number;
  number?: string;
  state?: string;
  comment?: string;
  total?: number;
  issued_at?: Date;
  document_id?: number;
  jobId?: number;
  includes_taxes?: boolean;
  payment_total?: number;
  payment_comment?: string;
  payment_target?: Date;
  assignment_ids?: number[];
  with_discount?: boolean;
  freelancer_name?: string;
  additional?: any;
  freelancer_id?: number;
  creatorName?: string;
  freelancer?: any;
  summary?: any;
  jobTitle?: string;
  assignmentIds?: string[];
  freelancerRatings?: any;
  jobTitleShort?: string;
  paymentTotalNet?: number;
  paymentTotalNetHint?: boolean;
  assignments?: any[];
  document?: DocumentVM;
  revenues?: any[];
  approval?: any;
}
export interface InvoiceSearchVM {
  search?: string;
  freelancerId?: string;
  jobId?: string;
  state?: string;
  dateFrom?: string;
  dateTo?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}

export interface InvoicePreparationSearchVM {
  freelancerId?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
