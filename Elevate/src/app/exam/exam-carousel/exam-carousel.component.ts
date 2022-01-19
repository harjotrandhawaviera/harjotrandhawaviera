import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';

import { ExamSlideComponent } from '../exam-slide/exam-slide.component';

@Component({
  selector: '[app-exam-carousel]',
  templateUrl: './exam-carousel.component.html',
  styleUrls: ['./exam-carousel.component.scss']
})
export class ExamCarouselComponent implements OnInit {
  @ContentChildren(ExamSlideComponent) slides: QueryList<ExamSlideComponent> | undefined
  @Input()
  isPrevDisabled = false;
  @Input()
  isActiveSummaryBtn = false;

  @Output() prev = new EventEmitter();

  @Output() next = new EventEmitter();

  @Output() showSummary = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
