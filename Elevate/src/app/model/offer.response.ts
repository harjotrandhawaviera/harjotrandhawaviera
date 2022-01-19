import { FreelancerResponse } from "./freelancer.response";
import { SingleResponse } from "./response";

export interface OfferResponse {
  deleted_at?: string;
  expired_at?: string;
  freelancer?: SingleResponse<FreelancerResponse>;
  freelancer_id?: number;
  id?: number;
  tender_id?: number;
}
