import * as moment from 'moment';

import { AbstractControl, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      return moment().diff(control.value, 'days') <= 0 ? null : { validatefuture: false };
    } else {
      return null;
    }
  };
}
