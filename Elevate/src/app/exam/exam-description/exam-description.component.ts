import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ExamVM } from '../../model/exam.model';

@Component({
  selector: '[app-exam-description]',
  templateUrl: './exam-description.component.html',
  styleUrls: ['./exam-description.component.scss']
})
export class ExamDescriptionComponent implements OnInit {
  @Input()
  exam: ExamVM | undefined = {};
  @Output() startQuestionnaire = new EventEmitter();
  @Output() backToOverview = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
