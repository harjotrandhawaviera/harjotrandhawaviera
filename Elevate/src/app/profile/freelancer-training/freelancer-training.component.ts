import * as moment from 'moment';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { I } from '@angular/cdk/keycodes';
import { MY_FORMATS } from '../freelancer-qualification/freelancer-qualification.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

@Component({
  selector: '[app-freelancer-training]',
  templateUrl: './freelancer-training.component.html',
  styleUrls: ['./freelancer-training.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class FreelancerTrainingComponent implements OnInit {
  @Input()
  inFormGroup: any;
  @Input()
  readonly = false;
  @Input()
  displayMessage: any = {};
  date = new FormControl(moment());
  maxDate=new Date();
  formvalue: any;
  @Output() onChange = new EventEmitter();

  // @ViewChild('DatePickerStart') DatePickerStart : any;

  constructor() { }

  ngOnInit(): void {
    this.inFormGroup?.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((value: any) => {
          console.log(value)
            if(value.issuing_organization != '' && value.name != '' && (this.formvalue?.issuing_organization != value.issuing_organization || this.formvalue?.name != value.name )){
             this.formvalue = value;
              this.inFormGroup.controls.issue_date.setValidators([Validators.required])
              this.inFormGroup.controls.issue_date.updateValueAndValidity()

            }
            if((value.issuing_organization == '' || value.name == '') && this.inFormGroup.controls.issue_date.errors != null){
              this.inFormGroup.controls.issue_date.clearValidators()
              this.inFormGroup.controls.issue_date.updateValueAndValidity()
            }
           })
  }

  chosenYearHandler(normalizedYear: any) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
  }

  onIssueFieldChange(){
    this.onChange.emit();
  }

  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.inFormGroup.controls.issue_date.setValue(ctrlValue);
    datepicker.close();
  }

  onTrainingFieldChange(){
    this.onChange.emit();
  }
}
