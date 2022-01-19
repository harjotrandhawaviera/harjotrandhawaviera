import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from './../../services/translate.service';
import { GenericValidatorService } from '../../services/generic-validator.service';

@Component({
  selector: 'app-reason-box',
  templateUrl: './reason-box.component.html',
  styleUrls: ['./reason-box.component.scss'],
})
export class ReasonBoxComponent implements OnInit {
  title: string;
  image: string  = '';
  message: string;
  label: string;
  type: string;
  placeholder: string;
  needReason: boolean;
  reasonValue: string;
  inputFieldType: string;
  fieldValue: string | number;
  confirmText: string;
  cancelText: string;
  confirmCode: string = '';
  cancelCode: string = '';
  reasonForm?: FormGroup;
  editForm?: FormGroup;
  validationMessages: any;
  displayMessage: any = {};

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    public dialogRef: MatDialogRef<ReasonBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.image = data.image;
    this.message = data.message;
    this.label = data.label;
    this.type = data.type;
    this.placeholder = data.placeholder;
    this.needReason = data.needReason;
    this.reasonValue = data.reasonValue;
    this.inputFieldType = data.inputFieldType;
    this.fieldValue = data.fieldValue;
    this.confirmText = data.confirmText;
    this.cancelText = data.cancelText;
    this.confirmCode = data.confirmCode;
    this.cancelCode = data.cancelCode;
  }

  ngOnInit(): void {
    this.reasonForm = this.fb.group({
      reason: ['', [Validators.required]],
    });

    this.editForm = this.fb.group({
      timeRange: ['', []],
      freelancerCostsNet: ['', []],
      assignmentBudgetCorrection: ['', []]
    });

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        reason: {
          required: this.translateService.instant('form.errors.required'),
        },
        timeRange: {
          required: this.translateService.instant('form.errors.required'),
        },
        freelancerCostsNet: {
          required: this.translateService.instant('form.errors.required'),
        },
        assignmentBudgetCorrection: {
          required: this.translateService.instant('form.errors.required'),
        },
      };
      if (this.reasonForm) {
        this.reasonForm.valueChanges.subscribe(() => {
          if (this.reasonForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.reasonForm,
              this.validationMessages
            );
          }
        });
      }
      if (this.editForm) {
        this.editForm.valueChanges.subscribe(() => {
          if (this.editForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.editForm,
              this.validationMessages
            );
          }
        });
      }
    });

    this.patchFormDetail();
  }

  patchFormDetail() {
    if (this.editForm) {
      this.editForm.reset();
      if (this.inputFieldType === 'timeRange' && this.fieldValue) {
        this.editForm.get('timeRange')?.setValidators(Validators.required);
        const obj = {
          timeRange: this.fieldValue,
        };
        this.editForm.patchValue(obj);
      }
      if (this.inputFieldType === 'number' && this.fieldValue) {
        this.editForm.get('number')?.setValidators(Validators.required);
        const obj = {
          freelancerCostsNet: this.fieldValue,
        };
        this.editForm.patchValue(obj);
      }
      if (this.inputFieldType === 'assignmentBudget' && this.fieldValue) {
        this.editForm.get('assignmentBudget')?.setValidators(Validators.required);
        const obj = {
          assignmentBudgetCorrection: this.fieldValue,
        };
        this.editForm.patchValue(obj);
      }
    }
    if (this.reasonForm) {
      this.reasonForm.reset();
      if (this.reasonValue) {
        const obj = {
          reason: this.reasonValue,
        };
        this.reasonForm.patchValue(obj);
      }
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    if (this.reasonForm && this.needReason) {
      this.reasonForm.markAllAsTouched();
      this.reasonForm.markAsDirty();
      if (this.reasonForm.valid) {
        const values = this.reasonForm.getRawValue();
        const reason = values.reason;

        this.dialogRef.close({ reason: reason });
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.reasonForm,
          this.validationMessages
        );
      }
    } else if (this.editForm && this.inputFieldType === 'timeRange') {
      this.editForm.markAllAsTouched();
      this.editForm.markAsDirty();
      if (this.editForm.valid) {
        const values = this.editForm.getRawValue();
        const timeRange = values.timeRange;

        this.dialogRef.close({ timeRange: timeRange });
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.editForm,
          this.validationMessages
        );
      }
    } else if (this.editForm && this.inputFieldType === 'number') {
      this.editForm.markAllAsTouched();
      this.editForm.markAsDirty();
      if (this.editForm.valid) {
        const values = this.editForm.getRawValue();
        const freelancerCostsNet = values.freelancerCostsNet;

        this.dialogRef.close({ freelancerCostsNet: freelancerCostsNet });
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.editForm,
          this.validationMessages
        );
      }
    } else if (this.editForm && this.inputFieldType === 'assignmentBudget') {
      this.editForm.markAllAsTouched();
      this.editForm.markAsDirty();
      if (this.editForm.valid) {
        const values = this.editForm.getRawValue();
        const assignmentBudgetCorrection = values.assignmentBudgetCorrection;

        this.dialogRef.close({ assignmentBudgetCorrection: assignmentBudgetCorrection });
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.editForm,
          this.validationMessages
        );
      }
    } else {
      this.dialogRef.close(true);
    }
  }
}
