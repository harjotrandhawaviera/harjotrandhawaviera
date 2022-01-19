import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import {FileExportService} from '../../services/file-export.service';
import {FormControl} from '@angular/forms';
import {PreviewDownloadPopupComponent} from "../../admin-freelancer/preview-download-popup/preview-download-popup.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: '[app-freelancer-legal-identity-card]',
  templateUrl: './freelancer-legal-identity-card.component.html',
  styleUrls: ['./freelancer-legal-identity-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FreelancerLegalIdentityCardComponent implements OnInit {
  @Input()
  inFormGroup: any;
  @Input()
  readonly = false;
  @Input()
  displayMessage: any = {};
  constructor(private fileExportService: FileExportService,
              private dialog: MatDialog) { }
  onDocumentClick: boolean = false
  @Output() identityAdded = new EventEmitter();
  @Output() identityRemoved = new EventEmitter();
  @Output() onChange = new EventEmitter();

  get document(): FormControl | undefined {
    return this.inFormGroup
      ? (this.inFormGroup.get('document') as FormControl)
      : undefined;
  }
  ngOnInit(): void {
   console.log(this.inFormGroup)
  }

  addNewIdentity(){
    this.identityAdded.emit(true)
  }

  onDocumentUpload(evt: any){
    this.inFormGroup.controls.document_id.setValue(evt.id);
  }

  // tslint:disable-next-line:typedef
  downloadDocument(doc: any) {
    if (doc?.mime.includes('pdf')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }
    else if (doc?.mime.includes('image')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          image: doc
        },
        disableClose: true
      });
    }
    else {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }

  }

  onIdentityCardFieldChange(){
    this.onChange.emit();
  }
  removeIdentity($event:any){
    this.identityRemoved.emit(true)
  }
}
