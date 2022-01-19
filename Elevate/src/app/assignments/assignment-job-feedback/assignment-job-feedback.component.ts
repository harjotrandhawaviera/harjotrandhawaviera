import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { JobFeedbackQuestionVM } from '../../model/job.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assignment-job-feedback',
  templateUrl: './assignment-job-feedback.component.html',
  styleUrls: ['./assignment-job-feedback.component.scss']
})
export class AssignmentJobFeedbackComponent implements AfterViewInit, OnChanges {

  @Input() feedback: JobFeedbackQuestionVM[] | undefined | null;
  displayedColumns = ['question', 'translatedType'];
  dataSource = new MatTableDataSource<JobFeedbackQuestionVM>([]);
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.feedback) {
      if (this.feedback) {
        this.dataSource = new MatTableDataSource<JobFeedbackQuestionVM>(this.feedback);
      } else {
        this.dataSource = new MatTableDataSource<JobFeedbackQuestionVM>([]);
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
