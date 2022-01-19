import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable()
export class SurveyService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  getFreelancerSurveyInstance(freelancer_id: any, assignment_id: any, instanceId: any) {
    return this.http.get(environment.api + `/freelancers/${freelancer_id}/assignments/${assignment_id}/survey_instances/${instanceId}?include=approval.updator`);
  }
  getSurveyInstance(instanceId: any) {
    return this.http.get(environment.api + `/survey-instances/${instanceId}?include=approval.updator`);
  }
  getQuestionnaire(id: any) {
    return this.http.get(environment.api + `/questionnaires/${id}`);
  }
  getSurveyInstanceApproval(id: any) {
    return this.http.get(environment.api + `/survey-instances/${id}/approvals?include=updator`).pipe(map((resp: any) => {
      resp.data.performed_by = resp.data.updator && resp.data.updator.data.name &&
        resp.data.updator.data.name;
      return resp.data;
    }));
  }
  updateSurveyInstance(freelancer_id: any, assignment_id: any, id: any, data: any) {
    return this.http.post(environment.api + `/freelancers/${freelancer_id}/assignments/${assignment_id}/survey_instances/${id}`, data, { observe: 'response' });
  }

  createSurveyInstance(freelancer_id: any, assignment_id: any, data: any) {
    return this.http.post(environment.api + `/freelancers/${freelancer_id}/assignments/${assignment_id}/survey_instances`, data, { observe: 'response' });
  }

}
