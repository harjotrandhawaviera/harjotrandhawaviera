import { FreelancerVM } from './freelancer.model';

export interface OfferVM {
  deleted_at?: string;
  expired_at?: string;
  freelancer?: FreelancerVM;
  freelancer_id?: number;
  id?: number;
  tender_id?: number;
}

export interface OfferSearchVM {
  job?: string;
  agent?: string;
  contractType?: string;
  search?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
  client?: any;
  project?: any;
  site?: any;
  freelancer?: any;
  start?: any;
  end?: any;
  status?: any;
}

export interface ShortlistVM {
  freelancer?: FreelancerVM;
  freelancer_id?: number;
  offer_id?: number;
  tender_id?: number;
}
