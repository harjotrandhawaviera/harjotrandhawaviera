import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { CertificateMappingService } from './../../services/mapping-services/certificate-mapping.service';
import { CertificateService } from '../../services/certificate.service';
import { CertificateVM } from '../../model/certificate.model';
import { ExamService } from './../../services/exam.service';
import { FormatConfig } from './../../constant/formats.constant';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from './../../services/training.service';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-certificate-details',
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.scss']
})
export class CertificateDetailsComponent implements OnInit {
  certificate: CertificateVM | undefined;
  intervalForm = new FormGroup({
    interval: new FormControl('', [Validators.pattern(FormatConfig.check.dateInterval)])
  })
  examForm = new FormGroup({
    minimum_percent: new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]?$|^100$/)])
  })
  intervalValidationMessages: any;
  intervalDisplayMessage: any = {};
  examValidationMessages: any;
  examDisplayMessage: any = {};
  constructor(private activatedRoute: ActivatedRoute,
    private certificateService: CertificateService,
    private examService: ExamService,
    private trainingService: TrainingService,
    private genericValidatorService: GenericValidatorService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private certificateMappingService: CertificateMappingService) { }

  ngOnInit(): void {
    this.translateService.get('form.errors').subscribe(res => {
      this.intervalValidationMessages = {
        interval: {
          pattern: this.translateService.instant('form.errors.pattern.date_interval')
        }
      }
      this.examValidationMessages = {
        minimum_percent: {
          required: this.translateService.instant('form.errors.required'),
          pattern: this.translateService.instant('form.errors.pattern.minimum_percent')
        }
      }
    })

    if (this.intervalForm) {
      this.intervalForm.valueChanges.subscribe((value) => {
        if (this.intervalForm) {
          this.intervalDisplayMessage = this.genericValidatorService.processMessages(
            this.intervalForm,
            this.intervalValidationMessages
          );
        }
      });
    }
    if (this.examForm) {
      this.examForm.valueChanges.subscribe((value) => {
        if (this.examForm) {
          this.examDisplayMessage = this.genericValidatorService.processMessages(
            this.examForm,
            this.examValidationMessages
          );
        }
      });
    }
    this.activatedRoute.params.subscribe(res => {
      if (res.id) {
        this.certificateService.getCertificateById(res.id as number).subscribe(res => {
          if (res && res.data) {
            this.certificate = this.certificateMappingService.certificateResponseToVM(res.data);
            this.intervalForm.patchValue({
              interval: this.certificate.valid_interval
            });
            this.examForm.patchValue({
              minimum_percent: this.certificate.exam?.minimum_percent
            });

          }
        });
      }
    });
  }
  // /**
  //      * handler to update is_enabled, is_recommended flag for specified type of data
  //      * @param {string} type one of certificate, exam, training
  //  // tslint:disable-next-line:jsdoc-format
  //      */
  updateFlag(type: string) {
    if (this.certificate && this.certificate.id) {
      if (this.certificate.is_legal) {
        return;
      }
      switch (type) {
        case 'recommended': {
          this.certificateService.updateCertificate(this.certificate.id, {
            id: this.certificate.id,
            is_recommended: this.certificate.is_recommended
          }).subscribe(res => {
            this.toastrService.success(this.translateService.instant('notification.post.certificates.success'));
          });
          break;
        }
        case 'certificate': {
          this.certificateService.updateCertificate(this.certificate.id, {
            id: this.certificate.id,
            is_enabled: this.certificate.is_enabled
          }).subscribe(res => {
            this.toastrService.success(this.translateService.instant('notification.post.certificates.success'));
          });
          break;
        }
        case 'training': {
          // trainingService.update(vm.data.training.id, { is_enabled: vm.data.training.is_enabled });
          if (this.certificate.training && this.certificate.training.id) {
            this.trainingService.updateTraining(this.certificate.training.id, { is_enabled: this.certificate.training.is_enabled }).subscribe(res => {
              this.toastrService.success(this.translateService.instant('notification.post.trainings.success'));
            });
          }
          break;
        }
        case 'exam': {
          if (this.certificate.exam && this.certificate.exam.id) {
            this.examService.updateExam(this.certificate.exam.id, { is_enabled: this.certificate.exam.is_enabled }).subscribe(res => {
              this.toastrService.success(this.translateService.instant('notification.post.exams.success'));
            });
          }
          break;
        }
      }
    }
  }
  intervalSubmit() {
    this.intervalForm.markAllAsTouched();
    if (!this.intervalForm.invalid && this.certificate && this.certificate.id) {
      const formValue = this.intervalForm.getRawValue();
      if (this.certificate.is_legal && this.certificate.identifier) {
        this.certificateService.updateAudit(this.certificate.identifier, { valid_interval: formValue.interval ? ('P' + formValue.interval) : '' }).subscribe(() => { })
      }
      this.certificateService.updateCertificate(this.certificate.id, {
        id: this.certificate.id,
        valid_interval: formValue.interval ? ('P' + formValue.interval) : null
      }).subscribe(res => {
        this.toastrService.success(this.translateService.instant('notification.post.certificates.success'));
      });
    }
  }
  updateExam() {
    if (!this.examForm.invalid && this.certificate && !this.certificate.is_legal && this.certificate.exam && this.certificate.exam.id) {
      const formValue = this.examForm.getRawValue();
      this.examService.updateExam(this.certificate.exam.id, { minimum_percent: formValue.minimum_percent }).subscribe(res => {
        this.toastrService.success(this.translateService.instant('notification.post.exams.success'));
      });
    }
  }
}
