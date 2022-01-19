import { SingleResponse } from './response';
import { UserResponse } from './user.response';
export interface AgentResponse {
  id?: number;
  fullname?: string;
  gender?: "M" | "F";
  email?: string;
  title?: string;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  mobile?: string;
  user?: SingleResponse<UserResponse>
}
