import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ExamVM } from '../../model/exam.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: '[app-exam-summary]',
  templateUrl: './exam-summary.component.html',
  styleUrls: ['./exam-summary.component.scss']
})
export class ExamSummaryComponent implements OnInit {
  @Input()
  exam: ExamVM | undefined;
  @Input()
  selection: SelectionModel<number> | undefined;
  @Output() toggleAnswer = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

}
