import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-approval-photo]',
  templateUrl: './approval-photo.component.html',
  styleUrls: ['./approval-photo.component.scss']
})
export class ApprovalPhotoComponent implements OnInit {
  @Input()
  data: any = {};
  get dataKeys() {
    return this.data ? Object.keys(this.data) : []
  }


  constructor() { }

  ngOnInit(): void {
  }

}
