/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */

import * as moment from 'moment';

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { DocumentVM } from '../../model/document.model';
import { FormControl } from '@angular/forms';
import { I } from '@angular/cdk/keycodes';
import { MY_FORMATS } from '../freelancer-qualification/freelancer-qualification.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';

@Component({
  selector: 'app-freelancer-qualification-item',
  templateUrl: './freelancer-qualification-item.component.html',
  styleUrls: ['./freelancer-qualification-item.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FreelancerQualificationItemComponent implements OnInit, OnChanges {
  @Input()
  inFormGroup: any;
  @Input()
  readonly = false;
  @Input()
  displayMessage: any = {};
  Degree: any[] = [
    'Secondary / School',
    'Higher Secondary / Associate',
    'Bachelors / Gradution',
    'Master/Post graduation',
    'Doctorate',
    'Professional (technical)',
    'Professional (non-technical)',
    'Any other',
  ];
  date = new FormControl(moment());
  maxDate = new Date();
  minDate: any;
  @Output() onChange = new EventEmitter();

  get document() {
    return this.inFormGroup.get('document').value;
  }

  constructor() {}

  onEducationFieldChange() {
    this.onChange.emit();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log('this is on init changes', this.inFormGroup.controls['start_date'].value);
    if (this.inFormGroup.controls.start_date.value) {
      this.minDate = this.inFormGroup.controls.start_date.value;
    }
  }

  documentUploadedCallback(document: DocumentVM) {
    this.inFormGroup.get('document').patchValue(document);
  }

  chosenYearHandler(normalizedYear: Moment, isStartDate: any) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    if (isStartDate) {
      this.minDate = ctrlValue;
    } else {
      this.maxDate = ctrlValue;
    }
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>,
    isStartDate: any
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    if (isStartDate) {
      this.inFormGroup.controls.start_date.setValue(ctrlValue);
      this.minDate = moment(ctrlValue);
    } else {
      this.inFormGroup.controls.end_date.setValue(ctrlValue);
      this.maxDate = ctrlValue;
    }
    datepicker.close();
  }

  chosenMonthHandler1(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>,
    isStartDate: any
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    if (isStartDate) {
      this.inFormGroup.controls.start_date.setValue(ctrlValue);
      this.minDate = moment(ctrlValue);
    } else {
      this.inFormGroup.controls.end_date.setValue(ctrlValue);
      this.maxDate = ctrlValue;
    }
    datepicker.close();
  }

  onDocumentUpload(evt: any) {
    this.inFormGroup.controls.document_id.setValue(evt.id);
    this.inFormGroup.controls.document.setValue(evt);
  }
}
