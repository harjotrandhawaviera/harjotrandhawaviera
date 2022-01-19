import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GenericValidatorService } from '../../services/generic-validator.service';
import { QualificationService } from './../../services/qualification.service';
import { ReferenceService } from '../../services/reference.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: '[app-freelancer-user-qualification]',
  templateUrl: './freelancer-user-qualification.component.html',
  styleUrls: ['./freelancer-user-qualification.component.scss']
})
export class FreelancerUserQualificationComponent implements OnInit {
  @Input()
  qualification: any;
  @Input()
  isEditAllowed = false;

  updateSet: any = null;
  detailForm?: FormGroup;
  displayMessage: any = {};
  validationMessages: any;
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    @Inject(LOCALE_ID) protected localeId: string,
    private qualificationService: QualificationService,
    private genericValidatorService: GenericValidatorService
  ) { }

  ngOnInit(): void {
  }
  onEdit() {
    this.updateSet = { ...this.qualification };
    this.validationMessages = {
      title: {
        required: this.translateService.instant('form.errors.required'),
      },
      description: {
        required: this.translateService.instant('form.errors.required'),
      }
    };
    this.detailForm = this.fb.group({
      id: this.fb.control(this.updateSet.id, []),
      name: this.fb.control(this.updateSet.name, [Validators.required]),
      achieved_at: this.fb.control(this.updateSet.achieved_at, []),
      description: this.fb.control(this.updateSet.description, []),
      document: this.fb.control(this.updateSet.document, []),
    });
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        name: {
          required: this.translateService.instant('form.errors.required'),
        },
        achieved_at: {
          matDatepickerParse: this.translateService.instant('form.errors.dateformat', { format: moment.localeData(this.localeId).longDateFormat('L') }),
        },
      };
      if (this.detailForm) {
        this.detailForm.valueChanges.subscribe((value) => {
          if (this.detailForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.detailForm,
              this.validationMessages
            );
          }
        });
      }
    });
  }
  onCancel() {
    this.updateSet = null;
    this.detailForm = undefined;
  }

  onSave() {
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      if (this.detailForm.valid) {
        const formValues = this.detailForm.getRawValue();
        const obj = {
          id: formValues.id,
          name: formValues.name,
          description: formValues.description,
          achieved_at: formValues.achieved_at
        };
        this.qualificationService.update({ id: this.updateSet.id, qualification: obj }).subscribe((resp) => {
          this.qualification = resp.body && resp.body.data ? {...this.qualification, ...resp.body.data} : this.qualification;
          this.updateSet = null;
          this.detailForm = undefined;
        });
      }
    }
  }
}
