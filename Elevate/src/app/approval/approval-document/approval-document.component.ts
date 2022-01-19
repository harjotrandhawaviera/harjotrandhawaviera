import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-approval-document]',
  templateUrl: './approval-document.component.html',
  styleUrls: ['./approval-document.component.scss']
})
export class ApprovalDocumentComponent implements OnInit {
  @Input()
  data: any = {};
  get dataKeys() {
    return this.data ? Object.keys(this.data) : []
  }
  constructor() { }

  ngOnInit(): void {
  }

}
