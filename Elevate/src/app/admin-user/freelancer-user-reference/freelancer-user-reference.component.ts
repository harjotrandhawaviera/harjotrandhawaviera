import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FormConfig } from '../../constant/forms.constant';
import { FreelancerService } from './../../services/freelancer.service';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { ReferenceService } from '../../services/reference.service';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: '[app-freelancer-user-reference]',
  templateUrl: './freelancer-user-reference.component.html',
  styleUrls: ['./freelancer-user-reference.component.scss']
})
export class FreelancerUserReferenceComponent implements OnInit {
  @Input()
  referenceData: any;
  @Input()
  isEditAllowed = false;
  withDates = FormConfig.qualifications.reference.dates;
  updateSet: any = null;
  referenceForm?: FormGroup;
  displayMessage: any = {};
  validationMessages: any;
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private referenceService: ReferenceService,
    private genericValidatorService: GenericValidatorService) { }

  ngOnInit(): void {
  }
  onEdit() {
    this.updateSet = { ...this.referenceData };
    this.validationMessages = {
      title: {
        required: this.translateService.instant('form.errors.required'),
      },
      description: {
        required: this.translateService.instant('form.errors.required'),
      }
    };
    this.referenceForm = this.fb.group({
      id: this.fb.control(this.updateSet.id, []),
      title: this.fb.control(this.updateSet.title, [Validators.required]),
      company: this.fb.control(this.updateSet.company, []),
      description: this.fb.control(this.updateSet.description, [Validators.required]),
      document: this.fb.control(this.updateSet.document, []),
    })
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        languages: [
          {
            required: this.translateService.instant('form.errors.required'),
          },
        ],
        references: [],
        qualifications: [],
      };
      if (this.referenceForm) {
        this.referenceForm.valueChanges.subscribe((value) => {
          if (this.referenceForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.referenceForm,
              this.validationMessages
            );
          }
        });
      }
    });
  }

  onCancel() {
    this.updateSet = null;
    this.referenceForm = undefined;
  }

  onSave() {
    if (this.referenceForm) {
      this.referenceForm.markAllAsTouched();
      this.referenceForm.markAsDirty();
      if (this.referenceForm.valid) {
        const formValues = this.referenceForm.getRawValue();
        const obj = {
          id: formValues.id,
          title: formValues.title,
          company: formValues.company,
          description: formValues.description
        };
        this.referenceService.update({ id: this.updateSet.id, reference: obj }).subscribe((resp) => {
          this.referenceData = resp.body && resp.body.data ? {...this.referenceData, ...resp.body.data} : this.referenceData;
          this.updateSet = null;
          this.referenceForm = undefined;
        });
      }
    }
    // if (this.updateSet && this.updateSet.id && vm.form && vm.form.$valid) {
    //   return profileService.updateReference(collection.only(angular.copy(this.updateSet), ['id', 'title', 'company', 'description', 'started_at', 'finished_at'])).then(function (resp) {
    //     vm.data = resp;
    //   }).finally(function () {
    //     this.updateSet = null;
    //   });
    // }
  }
}
