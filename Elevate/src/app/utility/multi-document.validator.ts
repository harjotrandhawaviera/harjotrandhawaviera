import { AbstractControl, ValidatorFn } from '@angular/forms';

export function multiDocumentRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      return control.value.documents && control.value.documents.length > 0 ? null : { required: { value: control.value } };
    } else {
      return { required: { value: control.value } };
    }
  };
}
