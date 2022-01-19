import { ExamInstanceResponse, ExamResponse } from '../model/exam.response';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleResponse } from './../model/response';
import { TrainingResponse } from './../model/exam.response';
import { TrainingsResponse } from '../model/freelancer.response';
import { environment } from '../../environments/environment';

@Injectable()
export class TrainingService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  updateTraining(id: number, training: TrainingResponse): Observable<HttpResponse<SingleResponse<TrainingResponse>>> {
    return this.http.post(environment.api + `/training-and-certificates/${id}`, training, {
      observe: 'response'
    });
  }
  upsert(
    training: TrainingsResponse
  ): Observable<HttpResponse<SingleResponse<TrainingsResponse>>> {
    if (training.id) {
      return this.update({ id: training.id, training: training });
    } else {
      return this.create(training);
    }
  }
  create(
    training: TrainingsResponse
  ): Observable<HttpResponse<SingleResponse<TrainingsResponse>>> {
    return this.http.post(environment.api + `/training-and-certificates`, training, {
      observe: 'response',
    });
  }
  update(req: {
    id: number;
    training: TrainingsResponse;
  }): Observable<HttpResponse<SingleResponse<TrainingsResponse>>> {
    return this.http.post(
      environment.api + `/training-and-certificates/${req.id}`,
      req.training,
      {
        observe: 'response',
      }
    );
  }

  delete(
    id: number
  ): Observable<HttpResponse<SingleResponse<TrainingsResponse>>> {
    return this.http.delete(environment.api + `/training-and-certificates/${id}`, {
      observe: 'response',
    });
  }
}
