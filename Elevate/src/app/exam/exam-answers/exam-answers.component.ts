import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AnswerVM } from './../../model/exam.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: '[app-exam-answers]',
  templateUrl: './exam-answers.component.html',
  styleUrls: ['./exam-answers.component.scss']
})
export class ExamAnswersComponent implements OnInit {

  @Input()
  answers: AnswerVM[] = [];
  @Input()
  selection: SelectionModel<number> | undefined;
  @Output() toggleAnswer = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
}
