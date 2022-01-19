import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '../../services/translate.service';
import { GenericValidatorService } from '../../services/generic-validator.service';

@Component({
  selector: 'app-survey-link-confirmation',
  templateUrl: './survey-link-confirmation.component.html',
  styleUrls: ['./survey-link-confirmation.component.scss']
})
export class SurveyLinkConfirmationComponent implements OnInit {
  confirmbox = new FormGroup({
    checkInSurvey: new FormControl('', Validators.required),
    checkOutSurvey: new FormControl('', Validators.required),
    check: new FormControl(),
  });
  title: string;
  checkIn: string;
  checkOut: string;
  checkInPlaceholder: string;
  checkOutPlaceholder: string;
  titleCode: string;
  message: string;
  messageCode: string;
  confirmText: string;
  cancelText: string;
  confirmCode: string;
  cancelCode: string;
  type: string;
  value: boolean;
  updateLink: boolean;
  validationMessages: any;
  displayMessage: any = {};
  constructor(
    public dialogRef: MatDialogRef<SurveyLinkConfirmationComponent>,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.checkIn = data.checkIn;
    this.checkOut = data.checkOut;
    this.checkInPlaceholder = data.checkInPlaceholder;
    this.checkOutPlaceholder = data.checkOutPlaceholder;
    this.titleCode = data.titleCode;
    this.type = data.type;
    this.message = data.message;
    this.messageCode = data.messageCode;
    this.confirmText = data.confirmText;
    this.cancelText = data.cancelText;
    this.confirmCode = data.confirmCode;
    this.cancelCode = data.cancelCode;
    this.value = data.value;
    this.updateLink = data.updateLink;
  }

  ngOnInit(): void {
    this.confirmbox.patchValue({
      checkInSurvey: this.data?.assignment?.checkin_survey,
      checkOutSurvey: this.data?.assignment?.checkout_survey
    });
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        checkInSurvey: {
          required: this.translateService.instant('form.errors.required'),
        },
        checkOutSurvey: {
          required: this.translateService.instant('form.errors.required'),
        },
      };
      this.confirmbox.valueChanges.subscribe(() => {
        if (this.confirmbox) {
          this.displayMessage = this.genericValidatorService.processMessages(
            this.confirmbox,
            this.validationMessages
          );
        }
      });
    });
    this.confirmbox.get('check')?.valueChanges.subscribe(res => {
      this.confirmbox.markAsUntouched();
    })
  }
  cancel() {
    this.dialogRef.close(false);
  }
  confirm() {
    if (this.confirmbox.value.check === 'true') {
      this.confirmbox.markAllAsTouched();
      this.confirmbox.markAsDirty();
      if (this.confirmbox.valid) {
        this.dialogRef.close(this.confirmbox.value ? this.confirmbox.value : true);
      }
      else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.confirmbox,
          this.validationMessages
        );
      }
    }
    else if (this.confirmbox.value.check === 'false') {
      this.dialogRef.close(this.confirmbox.value ? this.confirmbox.value : true);
    }
    else if (this.updateLink) {
      this.confirmbox.markAllAsTouched();
      if (this.confirmbox.valid) {
        this.dialogRef.close(this.confirmbox.value ? this.confirmbox.value : true);
      }
      else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.confirmbox,
          this.validationMessages
        );
      }
    }
    else {
      this.dialogRef.close(true);
    }
  }
}

