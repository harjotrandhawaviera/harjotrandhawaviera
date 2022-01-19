import { ProjectFeedbackQuestionVM } from './../../model/project.model';
import { Component, Input, OnInit } from '@angular/core';
import { SalesSlotVM } from '../../model/client.model';

@Component({
  selector: 'app-project-detail-report',
  templateUrl: './project-detail-report.component.html',
  styleUrls: ['./project-detail-report.component.scss']
})
export class ProjectDetailReportComponent implements OnInit {
  @Input()
  mode = 'view';
  @Input()
  salesSlots: SalesSlotVM[] | null = [];
  @Input()
  feedbackQuestions: ProjectFeedbackQuestionVM[] | null = [];
  @Input()
  freelancerRatings: string[] | null = [];
  constructor() { }

  ngOnInit(): void {
  }

}
