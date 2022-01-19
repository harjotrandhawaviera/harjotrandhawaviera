import * as moment from 'moment';

import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ageValidator(validateAge: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      const diff = moment().diff(control.value, 'years') >= validateAge;
      return diff ? null : { ageValidate: { messageCode: 'form.errors.validateage' } };
    } else {
      return null;
    }
  };
}
