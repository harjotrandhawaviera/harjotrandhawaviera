import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.scss']
})
export class ConfirmBoxComponent implements OnInit {
  title: string;
  titleCode: string;
  message: string;
  messageCode: string;
  confirmText: string;
  cancelText: string;
  confirmCode: string;
  cancelCode: string;
  type: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.titleCode = data.titleCode;
    this.type = data.type;
    this.message = data.message;
    this.messageCode = data.messageCode;
    this.confirmText = data.confirmText;
    this.cancelText = data.cancelText;
    this.confirmCode = data.confirmCode;
    this.cancelCode = data.cancelCode;
  }

  ngOnInit(): void {
  }
  cancel() {
    this.dialogRef.close(false);
  }
  confirm() {
    this.dialogRef.close(true);
  }
}
