import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DocumentVM } from '../../model/document.model';
import { FormConfig } from '../../constant/forms.constant';
import { FormGroup } from '@angular/forms';
import { OptionVM } from '../../model/option.model';

@Component({
  selector: '[app-freelancer-reference]',
  templateUrl: './freelancer-reference.component.html',
  styleUrls: ['./freelancer-reference.component.scss'],

})
export class FreelancerReferenceComponent implements OnInit {
  @Input()
  inFormGroup: any;
  @Input()
  readonly = false;
  @Input()
  displayMessage: any = {}
  isVerification: boolean = false;
  relationshipLK: OptionVM[] = [];
  @Output() onChange = new EventEmitter();

  get document() {
    return this.inFormGroup.get('document').value;
  }
  constructor() { }

  ngOnInit(): void {
    this.loadLookups();
    this.inFormGroup.value.isVerification == 0 ? this.isVerification = false :  this.isVerification = true;
  }

  onReferenceFieldChange(){
    this.onChange.emit();
  }
  documentUploadedCallback(document: DocumentVM) {
    this.inFormGroup.get('document').patchValue(document);
  }

  onClickVerification(event:any){
    if(event.checked){
      this.inFormGroup.controls.isVerification.setValue(1) 
    }
    else{
      this.inFormGroup.controls.isVerification.setValue(0) 
    }
    // this.isVerification ?  this.inFormGroup.controls.isVerification.setValue(1) : this.inFormGroup.controls.isVerification.setValue(0);
  }
  onDocumentUpload(evt: any){
    this.inFormGroup.controls.document_id.setValue(evt.id);
  }
  private loadLookups() {
    this.relationshipLK = FormConfig.relationship.map((a) => {
      return {
        value: a,
        text: undefined,
      };
    });
  }
}
