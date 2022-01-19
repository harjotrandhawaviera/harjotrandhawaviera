import { Component, Input, OnInit } from '@angular/core';

import { FormConfig } from '../../constant/forms.constant';

@Component({
  selector: '[app-freelancer-work-history]',
  templateUrl: './freelancer-work-history.component.html',
  styleUrls: ['./freelancer-work-history.component.scss']
})
export class FreelancerWorkHistoryComponent implements OnInit {
  @Input()
  inFormGroup: any;
  @Input()
  readonly = false;
  public isCurrentCompany: any = null;
  public currentYear: any | undefined;
  started_year: any
  started_month: any
  ended_at_year: any;
  ended_at_month: any;
  public years: any[] = [];
  selectedStatus:any;
   public months: any[] = [];
   maxDate = new Date();
   minDate:any;
   maxMonth: any;
   maxYear: any;
   minMonth: any;
   minYear: any;
  get document() {
    return this.inFormGroup.get('document').value;
  }
  constructor() { }

  ngOnInit(): void {
    this.inFormGroup.controls.document.setValue(this.inFormGroup.value?.document?.data)
    this.months = FormConfig.months;
    this.currentYear = new Date().getFullYear();
    for (let i = this.currentYear; i >= this.currentYear-50; i--) {
      this.years.push(i)
    }
    this.selectedStatus = this.inFormGroup.value.is_current_company;
    this.selectedStatus == 1 ?  this.isCurrentCompany = true : this.isCurrentCompany = false;
    let date = new Date(this.inFormGroup.value.start_from);
    this.started_year = date.getFullYear();
    this.months.forEach((res) =>{
      if(res.id ==date.getMonth()){
        this.started_month = res;
      }
})
    if(this.inFormGroup.value.till != "Present" && this.inFormGroup.value.till != null)
    {
    let date = new Date(this.inFormGroup.value.till);

      this.ended_at_year = date.getFullYear();
      this.months.forEach((res) =>{
            if(res.id ==date.getMonth()){
              this.ended_at_month =res;
            }
      })
    }
    if(this.inFormGroup.value.is_current_company == 1){
      this.inFormGroup.controls.till.setValue('Present');
    }

  }
  optionSelected($event: any) {
    if ($event.value == "yes") {
      this.isCurrentCompany = true;
      this.inFormGroup.controls.till.setValue('Present');
    } else {
      this.isCurrentCompany = false;
      // this.inFormGroup.controls.ended_at_year.clear();
    }
  }
  onDateSelect(val: any, isCurrentCompany: boolean, type: any){
    // if(!isCurrentCompany){
      if(type == 'started_month'){
        let date = this.inFormGroup.value.start_from != '' ? this.inFormGroup.value.start_from : new Date()
        date.setMonth(val.id)
        this.minDate = date;
        this.minYear = this.minDate.getFullYear();
        this.minMonth = this.minDate.getMonth() + 1;
        this.inFormGroup.controls.start_from.setValue(date)
      }
      if(type == 'started_year'){
        let date;
          this.started_year = val;
        // let date = this.inFormGroup.value.start_from != '' ? this.inFormGroup.value.start_from : new Date(val.toString())
        if(this.inFormGroup.value.start_from != '' && this.inFormGroup.value.start_from != null){
          date = new Date(this.inFormGroup.value.start_from);
          date.setFullYear(val)
        }
        else{
          date = new Date(val.toString())
        }
        this.minDate = date;
        this.minYear = this.minDate.getFullYear();
        this.minMonth = this.minDate.getMonth() + 1;
        this.inFormGroup.controls.start_from.setValue(date)
      }
      if(type == 'ended_at_year'){
        this.ended_at_year = val;
        let date;
        if(this.inFormGroup.value.till != '' && this.inFormGroup.value.till != null && this.inFormGroup.value.till != 'Present'){
          date = new Date(this.inFormGroup.value.till);
          date.setFullYear(val)
        }
        else{
          date = new Date(val.toString())
        }
        // let date = this.inFormGroup.value.till != '' ? this.inFormGroup.value.till : new Date(val.toString())
      //  date = new Date(date)
        this.maxDate = date;
        this.maxYear = this.maxDate.getFullYear();
        this.maxMonth = this.maxDate.getMonth();
        this.inFormGroup.controls.till.setValue(date)
      }
      if(type=='ended_at_month'){
        let date = this.inFormGroup.value.till != '' ? this.inFormGroup.value.till : new Date()
        date.setMonth(val.id)
        this.maxDate = date;
        this.maxYear = this.maxDate.getFullYear();
        this.maxMonth = this.maxDate.getMonth();
        this.inFormGroup.controls.till.setValue(date)
      }
    // }
  }
  onDocumentUpload(evt: any){
    this.inFormGroup.controls.document_id.setValue(evt.id);
  }
}
