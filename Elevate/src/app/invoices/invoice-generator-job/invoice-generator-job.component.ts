import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: '[app-invoice-generator-job]',
  templateUrl: './invoice-generator-job.component.html',
  styleUrls: ['./invoice-generator-job.component.scss']
})
export class InvoiceGeneratorJobComponent implements OnInit {

  @Input()
  detailGroup: any;
  @Input()
  displayMessage: any = {};
  @Input()
  jobList: any[] = [];
  assignmentColumns = ['select', 'appointedAt', 'sitename', 'checkinStart', 'checkinEnd', 'checkinPerformer'];
  @Input()
  assignments: any[] = [];
  @Output()
  next = new EventEmitter();
  get job_id() {
    const jobData = this.detailGroup && this.detailGroup.getRawValue();
    return jobData.job_id;
  }
  selection = new SelectionModel<any>(true, []);
  constructor() {

  }

  ngOnInit(): void {
    this.selection.changed.subscribe(res => {
      if (res && res.source && res.source.selected && res.source.selected.length) {
        this.detailGroup.get('assignment_ids').patchValue(res.source.selected);
      } else {
        this.detailGroup.get('assignment_ids').patchValue(null);
      }
    });
  }
  nextClick() {
    this.next.emit();
  }
}
