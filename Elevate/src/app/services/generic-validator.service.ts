import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from './../services/translate.service';
import { ValidationModel } from '../model/validation.model';

// Generic validator for Reactive forms
// Implemented as a class, not a service, so it can retain state for multiple forms.
interface ValidationMessage {
  [key: string]: string;
}
interface ValidationMessagesVM {
  [key: string]: ValidationMessagesVM | ValidationMessagesVM[];
}

@Injectable()
export class GenericValidatorService {
  // Provide the set of valid validation messages
  // Stucture:
  // controlName1: {
  //     validationRuleName1: 'Validation Message.',
  //     validationRuleName2: 'Validation Message.'
  // },
  // controlName2: {
  //     validationRuleName1: 'Validation Message.',
  //     validationRuleName2: 'Validation Message.'
  // }
  constructor(private translateService: TranslateService) { }

  // Processes each control within a FormGroup
  // And returns a set of validation messages to display
  // Structure
  // controlName1: 'Validation Message.',
  // controlName2: 'Validation Message.'
  processMessages(
    container: FormGroup,
    validationMessages: ValidationMessagesVM
  ): { [key: string]: string } {
    const messages: any = {};
    if (!validationMessages) {
      return messages
    }
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        // If it is a FormGroup, process its child controls.
        if (c instanceof FormArray) {
          Object.assign(messages, { [controlKey]: [] });
          c.controls.forEach((arrayEle, index) => {
            if (arrayEle instanceof FormGroup) {
              Object.assign(messages, {
                [controlKey]: [...messages[controlKey], {}],
              });
              const validMessage = validationMessages[controlKey] && (validationMessages[
                controlKey
              ] as ValidationMessagesVM[])[index] as ValidationMessagesVM;
              if (validMessage) {
                const childMessages = this.processMessages(arrayEle, validMessage);
                Object.assign(messages[controlKey][index], childMessages);
              }
            } else {
              Object.assign(messages, {
                [controlKey]: [...messages[controlKey], ''],
              });
              const validMessage = validationMessages[
                controlKey
              ] as ValidationMessagesVM[];
              if (
                validMessage &&
                validMessage[index] &&
                (arrayEle.dirty || arrayEle.touched)
              ) {
                messages[controlKey][index] = '';
                if (arrayEle.errors) {
                  Object.keys(arrayEle.errors).map((messageKey) => {
                    if (validMessage[index][messageKey]) {
                      messages[controlKey][index] +=
                        validMessage[index][messageKey] + ' ';
                    }
                  });
                }
              }
            }
          });
        } else if (c instanceof FormGroup) {
          // Object.assign(messages, { [controlKey]: {} });
          const validationMessage = validationMessages[
            controlKey
          ] as ValidationMessagesVM;
          const childMessages = this.processMessages(c, validationMessage);
          if (childMessages && Object.keys(childMessages).length > 0) {
            Object.assign(messages, { [controlKey]: childMessages });
          }
          // Object.assign(messages, childMessages);
        } else {
          // Only validate if there are validation messages for the control
          const validationMessage = validationMessages[
            controlKey
          ] as ValidationMessagesVM;
          if (validationMessage && (c.dirty || c.touched)) {
            messages[controlKey] = '';
            if (c.errors) {
              Object.keys(c.errors).map((messageKey) => {
                if (validationMessage[messageKey]) {
                  messages[controlKey] += validationMessage[messageKey] + ' ';
                }
              });
            }
          }
        }
      }
    }
    return messages;
  }
  processMessagesInList(
    container: FormGroup,
    validationMessages: { [key: string]: { [key: string]: string } }
  ): string[] {
    let messages: any[] = [];
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        // If it is a FormGroup, process its child controls.
        if (c instanceof FormGroup) {
          const childMessages = this.processMessagesInList(
            c,
            validationMessages
          );
          messages = [...messages, ...childMessages];
        } else {
          // Only validate if there are validation messages for the control
          if (validationMessages[controlKey]) {
            // messages[controlKey] = '';
            if (c.errors) {
              Object.keys(c.errors).map((messageKey) => {
                if (validationMessages[controlKey][messageKey]) {
                  messages.push(validationMessages[controlKey][messageKey]);
                }
              });
            }
          }
        }
      }
    }
    return messages;
  }
  setTouchedAllFormFields(formGroup: FormGroup, escapeGroup?: string[]): void {
    escapeGroup = escapeGroup ? escapeGroup : [];
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (
        control instanceof FormGroup &&
        escapeGroup?.filter((a) => a.toUpperCase() === field.toUpperCase())
          .length === 0
      ) {
        this.setTouchedAllFormFields(control, escapeGroup);
      }
    });
  }
  setUntouchedAllFormFields(
    formGroup: FormGroup,
    escapeGroup?: string[]
  ): void {
    escapeGroup = escapeGroup ? escapeGroup : [];
    if (formGroup.controls) {
      Object.keys(formGroup.controls).forEach((field) => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsUntouched({ onlySelf: true });
          control.markAsPristine({ onlySelf: true });
        } else if (
          control instanceof FormGroup &&
          escapeGroup?.filter((a) => a.toUpperCase() === field.toUpperCase())
            .length === 0
        ) {
          this.setUntouchedAllFormFields(control, escapeGroup);
        }
      });
    }
  }
  setDirtyAllFormFields(formGroup: FormGroup, escapeGroup?: string[]): void {
    escapeGroup = escapeGroup ? escapeGroup : [];
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (
        control instanceof FormGroup &&
        escapeGroup?.filter((a) => a.toUpperCase() === field.toUpperCase())
          .length === 0
      ) {
        this.setDirtyAllFormFields(control, escapeGroup);
      }
    });
  }
  anyChanges(formGroup: FormGroup, escapeGroup?: string[]): boolean {
    let valid = false;
    escapeGroup = escapeGroup ? escapeGroup : [];
    if (formGroup.controls) {
      Object.keys(formGroup.controls).forEach((field) => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          if (control.dirty) {
            valid = true;
          }
        } else if (
          control instanceof FormGroup &&
          escapeGroup?.filter((a) => a.toUpperCase() === field.toUpperCase())
            .length === 0
        ) {
          if (
            valid === false &&
            this.anyChanges(control, escapeGroup) === true
          ) {
            valid = true;
          }
        }
      });
    }
    return valid;
  }
  validateFormField(
    control: FormControl,
    field = '',
    validationMessages: { [key: string]: { [key: string]: string } }
  ): ValidationModel {
    const validVM: ValidationModel = {
      valid: true,
      fields: [],
      errorMessage: [],
    };
    control.markAsTouched();
    if (control.valid === false && control.disabled === false) {
      let fieldTag = document.querySelector('[name="' + field + '"]');
      if (!fieldTag) {
        fieldTag = document.querySelector('[data-name="' + field + '"]');
        if (!fieldTag) {
          fieldTag = document.querySelector(
            '[ng-reflect-name="' + field + '"]'
          );
        }
      }

      let label: string = '';
      let ariaLabel = false;
      if (fieldTag) {
        if (fieldTag.hasAttribute('id')) {
          const labelField = document.querySelector(
            'label[for="' + fieldTag.getAttribute('id') + '"]'
          );
          const matLabel = labelField?.querySelector('mat-label');
          if (matLabel) {
            label = matLabel.textContent ?? '';
          } else {
            label = labelField?.textContent ?? '';
          }
        } else {
          if (fieldTag.hasAttribute('placeholder')) {
            label = fieldTag.getAttribute('placeholder') ?? '';
          }
          if (label.length === 0) {
            ariaLabel = true;
          }
          if (ariaLabel && fieldTag.hasAttribute('aria-label')) {
            label = fieldTag.getAttribute('aria-label') ?? '';
          }
          if (
            ariaLabel &&
            label.length === 0 &&
            fieldTag.hasAttribute('ng-reflect-aria-label')
          ) {
            label = fieldTag.getAttribute('ng-reflect-aria-label') ?? '';
          }
          if (
            ariaLabel &&
            label.length === 0 &&
            fieldTag.hasAttribute('label')
          ) {
            label = fieldTag.getAttribute('label') ?? '';
          }
        }
      } else {
        label = 'Field';
      }
      validVM.valid = false;
      validVM.fields?.push(field);
      Object.keys(control.errors ?? {}).map((messageKey) => {
        if (
          validationMessages[field] &&
          validationMessages[field][messageKey]
        ) {
          validVM.errorMessage?.push(validationMessages[field][messageKey]);
        } else {
          switch (messageKey) {
            case 'required':
              validVM.errorMessage?.push(this.required(label));
              break;
            case 'email':
              validVM.errorMessage?.push(this.email(label));
              break;
            case 'pattern':
              validVM.errorMessage?.push(this.pattern(label));
              break;
            case 'maxlength':
              {
                const error = control.getError('maxlength');
                validVM.errorMessage?.push(
                  this.maxLength(label, error.requiredLength)
                );
              }
              break;
            case 'matDatepickerParse':
              validVM.errorMessage?.push(this.date(label));
              break;
            case 'matDatepickerMin':
              {
                const error = control.getError('matDatepickerMin');
                if (
                  label.indexOf('date') === -1 &&
                  label.indexOf('Date') === -1
                ) {
                  label = label + ' Date';
                }
                validVM.errorMessage?.push(this.minDate(label));
              }
              break;
            case 'matDatepickerMax':
              {
                const error = control.getError('matDatepickerMax');
                if (
                  label.indexOf('date') === -1 &&
                  label.indexOf('Date') === -1
                ) {
                  label = label + ' Date';
                }
                validVM.errorMessage?.push(this.maxDate(label));
              }
              break;
            case 'min':
              {
                const error = control.getError('min');
                validVM.errorMessage?.push(this.min(label, error.min));
              }
              break;
            case 'max':
              {
                const error = control.getError('max');
                validVM.errorMessage?.push(this.max(label, error.max));
              }
              break;
            case 'minlength':
              {
                const error = control.getError('minlength');
                validVM.errorMessage?.push(
                  this.minLength(label, error.requiredLength)
                );
              }
              break;
            case 'negative':
              {
                const error = control.getError('negative');
                validVM.errorMessage?.push(this.negative(label));
              }
              break;
            case 'invalid_number':
              {
                const error = control.getError('invalid_number');
                validVM.errorMessage?.push(this.invalid_number(label));
              }
              break;
            case 'notMatch':
              {
                const error = control.getError('notMatch');
                validVM.errorMessage?.push(this.invalid_number(label));
              }
              break;
            case 'customError':
              {
                const error = control.getError('customError');
                validVM.errorMessage?.push(error.message);
              }
              break;
            case 'currency':
              {
                const error = control.getError('currency');
                validVM.errorMessage?.push(
                  this.translateService.instant(error.messageCode)
                );
              }
              break;
            case 'age':
              {
                const error = control.getError('age');
                validVM.errorMessage?.push(
                  this.translateService.instant(error.messageCode)
                );
              }
              break;

            default:
              break;
          }
        }
      });
    }
    return validVM;
  }

  validateAllFormFields(
    container: FormGroup,
    validationMessages: { [key: string]: { [key: string]: string } },
    escapeGroup?: string[]
  ): ValidationModel {
    const validVM: ValidationModel = {
      valid: true,
      fields: [],
      errorMessage: [],
    };
    escapeGroup = escapeGroup ? escapeGroup : [];
    validVM.fields = [];

    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const control = container.controls[controlKey];
        if (control instanceof FormControl) {
          const validateControlModel = this.validateFormField(
            control,
            controlKey,
            validationMessages
          );
          if (validateControlModel.valid === false) {
            validVM.valid = false;
            validVM.fields.push.apply(
              validVM.fields,
              validateControlModel.fields ?? []
            );
            validVM.fields.push.apply(
              validVM.errorMessage,
              validateControlModel.errorMessage ?? []
            );
          }
        } else if (
          control instanceof FormGroup &&
          escapeGroup.filter(
            (a) => a.toUpperCase() === controlKey.toUpperCase()
          ).length === 0
        ) {
          const groupVM: ValidationModel = this.validateAllFormFields(
            control,
            validationMessages,
            escapeGroup
          );
          if (groupVM.valid === false) {
            validVM.valid = false;
            if (groupVM.fields.length > 0) {
              validVM.fields.push.apply(validVM.fields, groupVM.fields);
            }
            if (groupVM.errorMessage.length > 0) {
              validVM.errorMessage?.push.apply(
                validVM.errorMessage,
                groupVM.errorMessage
              );
            }
          }
        }
      }
    }
    validVM.errorMessage = validVM.errorMessage.filter(function (item, pos) {
      return validVM.errorMessage.indexOf(item) === pos;
    });
    return validVM;
  }
  ready(): Observable<string> {
    return this.translateService.get('INIT');
  }
  required(fieldName: string, code?: string): string {
    if (fieldName || !code) {
      const msg = this.translateService.instant('ERROR.REQUIRED', {
        field: fieldName,
      });
      return msg;
    } else if (code) {
      const msg = this.translateService.instant('ERROR.REQUIRED', {
        field: this.translateService.instant(code),
      });
      return msg;
    }
    return '';
  }
  email(fieldName: string, code?: string): string {
    if (fieldName || !code) {
      const msg = this.translateService.instant('ERROR.EMAIL', {
        field: fieldName,
      });
      return msg;
    } else if (code) {
      const msg = this.translateService.instant('ERROR.EMAIL', {
        field: this.translateService.instant(code),
      });
      return msg;
    }
    return '';
  }
  pattern(fieldName: string, code?: string): string {
    const msg = this.translateService.instant('ERROR.PATTERN', {
      field: fieldName,
    });
    return msg;
  }
  negative(fieldName: string, code?: string): string {
    if (fieldName || !code) {
      const msg = this.translateService.instant('ERROR.NEGATIVE', {
        field: fieldName,
      });
      return msg;
    } else if (code) {
      const msg = this.translateService.instant('ERROR.NEGATIVE', {
        field: this.translateService.instant(code),
      });
      return msg;
    }
    return '';
  }
  invalid_number(fieldName: string, code?: string): string {
    if (fieldName || !code) {
      const msg = this.translateService.instant('ERROR.INVALID_NUMBER', {
        field: fieldName,
      });
      return msg;
    } else if (code) {
      const msg = this.translateService.instant('ERROR.INVALID_NUMBER', {
        field: this.translateService.instant(code),
      });
      return msg;
    }
    return '';
  }
  minLength(fieldName: string, minlength: number, code?: string): string {
    const msg = this.translateService.instant('ERROR.MIN_LENGTH', {
      field: fieldName,
      length: minlength,
    });
    return msg;
  }
  maxLength(fieldName: string, maxlength: number, code?: string): string {
    const msg = this.translateService.instant('ERROR.MAX_LENGTH', {
      field: fieldName,
      length: maxlength,
    });
    return msg;
  }
  max(fieldName: string, maxValue: number, code?: string): string {
    const msg = this.translateService.instant('ERROR.MAX', {
      field: fieldName,
      length: maxValue,
    });
    return msg;
  }
  min(fieldName: string, minValue: number, code?: string): string {
    const msg = this.translateService.instant('ERROR.MIN', {
      field: fieldName,
      length: minValue,
    });
    return msg;
  }
  maxDate(fieldName: string, code?: string): string {
    const msg = this.translateService.instant('ERROR.DATE_PICKER_MAX', {
      field: fieldName,
    });
    return msg;
  }
  minDate(fieldName: string, code?: string): string {
    const msg = this.translateService.instant('ERROR.DATE_PICKER_MIN', {
      field: fieldName,
    });
    return msg;
  }
  date(fieldName: string, code?: string): string {
    const msg = this.translateService.instant('ERROR.DATE_PICKER_PARSE', {
      field: fieldName,
    });
    return msg;
  }
}
