import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: '[app-freelancer-user-rate]',
  templateUrl: './freelancer-user-rate.component.html',
  styleUrls: ['./freelancer-user-rate.component.scss']
})
export class FreelancerUserRateComponent implements OnChanges {
  @Input()
  data: any;
  @Input()
  editable = false;
  @Output()
  onUpdate = new EventEmitter<any>();
  editing = false;
  set: any = {};
  empty: any = false;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.onDataChange(this.data);
    }
  }

  ngOnInit(): void {
  }
  /**
          * Edit action
          */
  edit() {
    this.editing = true;
  }
  onDataChange(curr: any) {
    this.set = curr ? { ...curr } : {};
    this.empty = !curr;
  }
  /**
   * Cancel edit action
   */
  cancel() {
    this.editing = false;
    this.onDataChange(this.data);
  }

  /**
   * Save handler
   */
  save() {
    this.empty = false;
    this.editing = false;
    this.onUpdate.emit({ ...this.set });
  }
  performAction(action: string) {
    if (action === 'add') {
      this.edit();
    }
    if (action === 'edit') {
      this.edit();
    }
    if (action === 'cancel') {
      this.cancel();
    }
    if (action === 'update') {
      this.save();
    }
    if (action === 'save') {
      this.save();
    }
  }
}
