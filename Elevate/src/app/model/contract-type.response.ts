import { CertificateResponse } from "./certificate.response";
import { SingleResponse } from './response';

export interface ContractTypeResponse {
  id?: number;
  name?: string;
  identifier?: string;
  description?: string;
  certificate_id?: number;
  certificate?: SingleResponse<CertificateResponse>;
  data?: { [key: string]: any };
}
