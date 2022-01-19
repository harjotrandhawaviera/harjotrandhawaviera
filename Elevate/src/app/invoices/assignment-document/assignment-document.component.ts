import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { ConfirmBoxComponent } from './../../core/confirm-box/confirm-box.component';
import { InvoiceService } from './../../services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-assignment-document, [app-assignment-document]',
  templateUrl: './assignment-document.component.html',
  styleUrls: ['./assignment-document.component.scss']
})
export class AssignmentDocumentComponent implements OnInit, OnChanges {
  @Input()
  data: any;
  @Input()
  assignment: any;
  @Input()
  type: any;
  @Input()
  onBehalf: any;
  @Input()
  view: any;
  @Output()
  changed = new EventEmitter();

  actionOpened = false;
  editing: any;
  previous: any;
  constructor(
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private translateService: TranslateService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.onDocumentChange(changes.data.currentValue, changes.data.previousValue);
    }
  }

  ngOnInit(): void {
  }
  onDocumentChange(curr: any, prev: any) {
    if (curr) {
      if (curr.id) {
        if (prev && prev.id !== curr.id) {
          // open confirmation for saving
          // alertService.create('invoices.preparation.save-document', {}, 'success').then(submit, toggleOpen);
        }
        // initActions();
        this.actionOpened = false;
      } else {
        // no document available open in edit mode
        this.editing = this.data.trackingId;
        // store original settings
        // for save or restore on cancel
        this.previous = { ...this.data };
      }
    }
  }
  resetOriginalData() {
    this.previous = undefined;
  }
  toggleOpen() {
    if (this.editing === this.data.trackingId) {
      // reset changes
      this.data = this.previous;
      if (this.data && this.data.id) {
        this.resetOriginalData();
        this.editing = false;
      }
    } else {
      this.editing = this.data.trackingId; // enable editing for current document
      // store original settings
      // for save or restore on cancel
      this.previous = { ...this.data };
      // close dropdown menu
      this.actionOpened = false;
    }
  }
  remove() {
    this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'invoices.documents.remove.title'
        ),
        message: this.translateService.instant(
          'invoices.documents.remove.message'
        ),
        cancelCode: 'common.buttons.cancel',
        confirmCode: 'common.buttons.yes-remove',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        this.invoiceService.removeAssignmentDocument(this.assignment.id, this.data.id).subscribe(() => {
          // this.toastrService.success(this.translateService.instant('notification.post.assignments-documents.success'));
          this.changed.emit();
        })
      }
    })

  }

  documentUpdated(data: any) {
    this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'success',
        title: this.translateService.instant(
          'invoices.preparation.save-document.title'
        ),
        message: this.translateService.instant(
          'invoices.preparation.save-document.message'
        ),
        cancelCode: 'invoices.preparation.save-document.buttons.cancel',
        confirmCode: 'invoices.preparation.save-document.buttons.confirm',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        this.invoiceService.createAssignmentDocument(this.assignment.id, data.id, this.type).subscribe(() => {
          this.toastrService.success(this.translateService.instant('notification.post.assignments-documents.success'));
          this.changed.emit();
        })
      } else {
        this.toggleOpen();
      }
    });

  }
}
