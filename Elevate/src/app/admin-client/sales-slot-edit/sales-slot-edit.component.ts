import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sales-slot-edit',
  templateUrl: './sales-slot-edit.component.html',
  styleUrls: ['./sales-slot-edit.component.scss']
})
export class SalesSlotEditComponent implements OnInit {

  @Input()
  displayMessage: any;

  @Input()
  saleGroup: FormGroup | undefined;

  @Output() salesRemoved = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  removeSlot() {
    this.salesRemoved.emit();
  }
}
