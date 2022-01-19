import { Component, Input, OnInit } from '@angular/core';

import { FormConfig } from './../../constant/forms.constant';
import { OptionVM } from '../../model/option.model';

@Component({
  selector: '[app-user-personal]',
  templateUrl: './user-personal.component.html',
  styleUrls: ['./user-personal.component.scss']
})
export class UserPersonalComponent implements OnInit {
  @Input()
  personalFormGroup: any;
  @Input()
  displayMessage: any = {};
  salutationLK: OptionVM[] = [];
  constructor() { }

  ngOnInit(): void {
    this.salutationLK = FormConfig.master.salutation.map(a => {
      return {
        text: a,
        value: a
      }
    })
  }

}
