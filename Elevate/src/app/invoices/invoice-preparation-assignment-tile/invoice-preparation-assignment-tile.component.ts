import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormatConfig } from './../../constant/formats.constant';
import { FormatService } from './../../services/format.service';

@Component({
  selector: 'app-invoice-preparation-assignment-tile, [app-invoice-preparation-assignment-tile]',
  templateUrl: './invoice-preparation-assignment-tile.component.html',
  styleUrls: ['./invoice-preparation-assignment-tile.component.scss']
})
export class InvoicePreparationAssignmentTileComponent implements OnInit, OnChanges {
  @Input()
  item: any;
  @Input()
  types: any;
  @Output()
  goToDetail = new EventEmitter();
  constructor(private format: FormatService, private el: ElementRef) { }
  onmouseout() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {

    }
  }

  ngOnInit(): void {
  }
  mouseenter() {
    (this.el.nativeElement as HTMLElement).querySelector('.flipper-container')?.classList.add('hover');
  }
  mouseleave() {
    (this.el.nativeElement as HTMLElement).querySelector('.flipper-container')?.classList.remove('hover');
  }
  goToDetailClick() {
    this.goToDetail.emit();
  }
}
