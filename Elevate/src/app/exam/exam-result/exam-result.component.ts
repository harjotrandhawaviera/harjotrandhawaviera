import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ExamInstanceVM } from './../../model/exam.model';
import { ExamVM } from '../../model/exam.model';

@Component({
  selector: '[app-exam-result]',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.scss']
})
export class ExamResultComponent implements OnInit {
  @Input()
  result: ExamInstanceVM | undefined;
  @Input()
  jobsCount: number | undefined;
  @Input()
  isLegal: any;
  @Input()
  error: any = undefined;
  @Output() restartExam = new EventEmitter();
  @Output() backToTraining = new EventEmitter();
  @Output() nextStep = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
