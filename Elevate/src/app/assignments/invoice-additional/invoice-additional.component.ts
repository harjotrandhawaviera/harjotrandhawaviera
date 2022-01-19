import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-invoice-additional',
  templateUrl: './invoice-additional.component.html',
  styleUrls: ['./invoice-additional.component.scss']
})
export class InvoiceAdditionalComponent implements OnInit {

  @Input() documents: any;
  @Input() additionalCTI: string | undefined;
  @Input() enabledDocTypes: any[] | undefined;
  @Input() reportStatuses: any[] | undefined;
  reportStates: any[] | undefined;
  @Output() downloadClick = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.reportStatuses) {
      this.reportStates = this.reportStatuses;
    }
  }

  ngOnInit(): void {
  }

  onDownloadClick(doc: any) {
    this.downloadClick.emit(doc);
  }

  isRadioSelected(state: string) {
    return this.reportStates?.some((x) => x === state);
  }
}
