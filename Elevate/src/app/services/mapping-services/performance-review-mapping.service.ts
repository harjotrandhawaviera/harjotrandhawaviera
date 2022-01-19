import { Injectable } from '@angular/core';
import { performanceReviewVM } from '../../model/performanceReview.model';

@Injectable({
  providedIn: 'root'
})
export class PerformanceReviewMappingService {

  constructor() { }

  performanceReviewVMToResponse(model: performanceReviewVM): performanceReviewVM {
    const response: performanceReviewVM = {};
    response.job_id = model.job_id;
    response.freelancer_id = model.freelancer_id;
    response.status = model.status;
    response.rating = model.rating;
    response.comment = model.comment;
    return response;
  }
}
