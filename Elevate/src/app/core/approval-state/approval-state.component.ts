import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-approval-state, [app-approval-state]',
  templateUrl: './approval-state.component.html',
  styleUrls: ['./approval-state.component.scss']
})
export class ApprovalStateComponent implements OnChanges {
  set = '';
  @Output() updated = new EventEmitter();
  @Input()
  view = '';
  @Input()
  data: any;
  @Input()
  surveyInstanceApproval: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {

    this.set = this.data && this.data.state;
    this.data.change = true;
    this.updated.emit(this.data);
  }

  ngOnInit(): void {
  }
  updateData() {
    this.data.changed = true;
    this.updated.emit(this.data);
  }
}
