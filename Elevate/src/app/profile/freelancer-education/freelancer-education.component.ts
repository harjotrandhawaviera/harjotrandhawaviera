import * as moment from 'moment';

import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { FormControl } from '@angular/forms';
import { MY_FORMATS } from '../freelancer-qualification/freelancer-qualification.component';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-freelancer-education',
  templateUrl: './freelancer-education.component.html',
  styleUrls: ['./freelancer-education.component.scss'],
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
export class FreelancerEducationComponent implements OnInit {
  @Input()
  inFormGroup: any;
  @Input()
  readonly = false;
  @Input()
  displayMessage: any = {};
  educationStartYear: any[] = [];
  educationEndYear: any[] = [];
  year: any;
  // months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  date = new FormControl(moment());

  constructor() { }

  ngOnInit(): void {
    // this.year = new Date().getFullYear();
    // for (let i = (this.year - 25); i <= this.year; i++) {
    //   this.educationStartYear.push(i);
    // }
    // for (let i = (this.year - 25); i < (this.year + 15); i++) {
    //   this.educationEndYear.push(i);
    // }
  }

  chosenYearHandler(normalizedYear: any) {
    // const ctrlValue = this.date.value;
    // ctrlValue.year(normalizedYear.year());
    // this.date.setValue(ctrlValue);
  }
  onClick(evt: any){
    console.log(evt);
  }
  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    // const ctrlValue = this.date.value;
    // ctrlValue.month(normalizedMonth.month());
    // this.date.setValue(ctrlValue);
    console.log(datepicker);
    datepicker.close();
  }

}
