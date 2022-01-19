import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { InvoiceVM } from './../../model/invoice.model';

@Component({
  selector: '[app-invoice-tile], app-invoice-tile',
  templateUrl: './invoice-tile.component.html',
  styleUrls: ['./invoice-tile.component.scss']
})
export class InvoiceTileComponent implements OnInit {
  @Input()
  item: InvoiceVM | undefined;
  @Input()
  isFreelancer = false;
  @Output()
  check = new EventEmitter();
  @Output()
  detail = new EventEmitter();
  @Output()
  cardClicked = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  checkClick() {
    this.check.emit();
  }
  cardClick() {
    this.cardClicked.emit();
  }
  detailClick() {
    this.detail.emit();
  }
}
