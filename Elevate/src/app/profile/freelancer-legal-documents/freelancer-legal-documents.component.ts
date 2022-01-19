import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-freelancer-legal-documents]',
  templateUrl: './freelancer-legal-documents.component.html',
  styleUrls: ['./freelancer-legal-documents.component.scss']
})
export class FreelancerLegalDocumentsComponent implements OnInit {
  @Input()
  inFormGroup: any;
  @Input()
  readonly = false;
  @Input()
  displayMessage: any = {};
  constructor() { }

  ngOnInit(): void {
   
  }
  
  
}
