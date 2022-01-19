import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: '[app-invoice-generator-assignment-detail]',
  templateUrl: './invoice-generator-assignment-detail.component.html',
  styleUrls: ['./invoice-generator-assignment-detail.component.scss']
})
export class InvoiceGeneratorAssignmentDetailComponent implements OnInit {
  @Input()
  displayMessage: any = {}
  @Input()
  detailGroup: any;
  @Input()
  assignment_details: any;
  @Input()
  total = 0;
  @Output()
  next = new EventEmitter()
  // get assignment_details(): FormArray | undefined {
  //   return this.detailGroup ? this.detailGroup.get('assignment_details') as FormArray : undefined
  // }
  get assignment_detailsValues() {
    return (this.assignment_details && this.assignment_details.getRawValue() || [])
  }
  constructor() { }

  ngOnInit(): void {
  }
  getFormArray(cntr: FormGroup, name: string): FormArray {
    return cntr.get(name) as FormArray;
  }
  nextClick() {
    this.next.emit();
  }
}
