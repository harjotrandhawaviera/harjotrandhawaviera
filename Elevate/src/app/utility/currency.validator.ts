import { AbstractControl, ValidatorFn } from '@angular/forms';

import { FormatConfig } from '../constant/formats.constant';

export function currencyValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      const regexp = FormatConfig.check.numberPattern;
      return control.value && regexp.test(control.value) ? null : { currency: { value: control.value, messageCode: 'form.errors.currencyformat' } };
    } else {
      return null;
    }
  };
}
