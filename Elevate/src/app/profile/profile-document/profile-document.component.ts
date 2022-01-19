import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DocumentVM } from '../../model/document.model';
import { FileExportService } from '../../services/file-export.service';
import {MatDialog} from '@angular/material/dialog';
import {PreviewDownloadPopupComponent} from '../../admin-freelancer/preview-download-popup/preview-download-popup.component';

@Component({
  selector: 'app-profile-document, div[app-profile-document]',
  templateUrl: './profile-document.component.html',
  styleUrls: ['./profile-document.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ProfileDocumentComponent,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProfileDocumentComponent,
      multi: true
    }
  ],
})
export class ProfileDocumentComponent implements ControlValueAccessor, Validator {


  constructor(private fileExportService: FileExportService, private dialog: MatDialog, ) { }
  @Input()
  multiple = false;
  @Input()
  readonly = false;
  @Input()
  pending = false;
  @Input()
  isRequired = false;
  @Input()
  onDocumentClick = false;
  @Output() documentUpdated = new EventEmitter<any>();
  @Input()
  buttonText = '';
  @Input()
  documents: DocumentVM[] = [];
  @Input()
  collectionId: any;
  touched = false;
  onTouched = () => { };
  onChange = (document: any) => { };

  writeValue(obj: any): void {
    if (obj) {
      if (this.multiple) {
        this.collectionId = obj.id;
        this.documents = obj.documents ? [...obj.documents.map((a: any) => {
          return { ...a };
        })] : [];
      } else {
        this.documents = [{ ...obj }];
      }
    }
  }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  documentUploadedCallback(document: DocumentVM) {
    this.markAsTouched();
    if (document) {
      this.documents = this.multiple
        ? [...this.documents, document]
        : [document];
      if (this.multiple) {
        this.collectionId = undefined;
      }
      this.propagateChange();
    }
  }

  propagateChange() {
    if (this.multiple) {
      this.documentUpdated.emit({
        id: this.collectionId,
        documents: this.documents
      });
      this.onChange({
        id: this.collectionId,
        documents: this.documents
      });
    } else {
      this.documentUpdated.emit(this.documents.length
        ? this.documents[0]
        : null);
      this.onChange(this.documents.length
        ? this.documents[0]
        : null);

    }

  }
  removeDocument(doc: any) {
    if (this.multiple) {
      const i = this.documents.findIndex(a => a === doc);
      this.documents.splice(i, 1);
      this.collectionId = undefined;
      this.propagateChange();
    }
  }
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
  validate(control: AbstractControl): ValidationErrors | null {
    if (control && control.value) {
      if (this.isRequired && !(control.value && control.value.documents && control.value.documents.length > 0)) {
        return { required: true };
      }
    }
    return null;
  }
}
