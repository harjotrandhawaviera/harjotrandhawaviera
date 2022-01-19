import { ExamInstanceResponse, ExamResponse } from '../model/exam.response';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleResponse } from './../model/response';
import { environment } from '../../environments/environment';

@Injectable()
export class ExamService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  startExam(id: number): Observable<SingleResponse<ExamInstanceResponse>> {
    return this.http.post<any>(environment.api + `/exams/${id}/instances?include=exam,exam.questions,exam.questions.answers,exam.certificate.training`, {});
  }
  submitAnswers(req: { exam_instance_id: number, answers: number[] }): Observable<HttpResponse<SingleResponse<ExamInstanceResponse>>> {
    return this.http.post(environment.api + '/exams/result', req, { observe: 'response' });
  }
  updateExam(id: number, exam: ExamResponse): Observable<HttpResponse<SingleResponse<ExamResponse>>> {
    return this.http.post(environment.api + `/exams/${id}`, exam, {
      observe: 'response'
    });
  }
}
