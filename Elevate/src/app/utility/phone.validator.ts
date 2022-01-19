import { AbstractControl, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      const regexp = /^\d{6,15}$/;
      return control.value && regexp.test(control.value.replace(/[\s+\-(/)]/g, '')) ? null : { phone: { value: control.value } };
    } else {
      return null;
    }
  };
}

export function phoneValidatorForNgxintltelInput(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      const regexp = /^\d{6,15}$/;
      return control.value && regexp.test(control.value.number?.replace(/[\s+\-(/)]/g, '')) ? null : { phone: { value: control.value.number } };
    } else {
      return null;
    }
  };
}
