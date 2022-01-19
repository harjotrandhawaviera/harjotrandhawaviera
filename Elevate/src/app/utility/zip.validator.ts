import { AbstractControl, ValidatorFn } from '@angular/forms';

export function zipValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      const regexp = /^[a-zA-Z0-9][a-zA-Z0-9\- ]{0,10}[a-zA-Z0-9]$/i;
      return regexp.test(control.value) ? null : { zip: { value: control.value } };
    } else {
      return null;
    }
  };
}
