import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectFeedbackQuestionVM } from '../../model/project.model';

@Component({
  selector: 'app-feedback-questions',
  templateUrl: './feedback-questions.component.html',
  styleUrls: ['./feedback-questions.component.scss']
})
export class FeedbackQuestionsComponent implements OnChanges {
  @Input()
  feedbackQuestions: ProjectFeedbackQuestionVM[] | null = [];
  displayedColumns = ['question', 'type'];
  dataSource = new MatTableDataSource<ProjectFeedbackQuestionVM>([]);
  @ViewChild(MatPaginator)
  paginator?: MatPaginator;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.feedbackQuestions) {
      if (this.feedbackQuestions) {
        this.dataSource = new MatTableDataSource<ProjectFeedbackQuestionVM>(this.feedbackQuestions);
      } else {
        this.dataSource = new MatTableDataSource<ProjectFeedbackQuestionVM>([]);
      }
      this.assignPaginator();
    }
  }

  ngAfterViewInit() {
    this.assignPaginator();
  }

  private assignPaginator() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}
