import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';

import { ExamSlideComponent } from '../exam-slide/exam-slide.component';
import { ExamVM } from '../../model/exam.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: '[app-exam-questionnaire]',
  templateUrl: './exam-questionnaire.component.html',
  styleUrls: ['./exam-questionnaire.component.scss']
})
export class ExamQuestionnaireComponent implements OnInit {


  @Input()
  exam: ExamVM | undefined;
  @Input()
  activeQuestion: number = 0;
  get isPrevDisabled() {
    return this.activeQuestion === 0;
  }
  @Input()
  isActiveSummaryBtn = false;
  @Input()
  selection: SelectionModel<number> | undefined;

  @Output() prev = new EventEmitter();

  @Output() next = new EventEmitter();

  @Output() showSummary = new EventEmitter();
  @Output() toggleAnswer = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

}
