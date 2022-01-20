import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth-service.service';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)])
  });
  formValidate: any = {};
  validationMessages: any;
  displayMessage: { [key: string]: string } = {};
  constructor(
    private genericValidatorService: GenericValidatorService,
    private authService: AuthService,
    private translateService: TranslateService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        email: {
          required: this.translateService.instant('form.errors.required'),
          email: this.translateService.instant('form.errors.email'),
          // minlength: this.translateService.instant('form.errors.minLengthEmail', { minlength: 6 }),
        }
      };
      this.forgotPasswordForm.valueChanges.subscribe((value) => {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.forgotPasswordForm,
          this.validationMessages
        );
      });
    });
  }
  forgotPassword() {
    this.genericValidatorService.setTouchedAllFormFields(this.forgotPasswordForm);

    if (this.forgotPasswordForm.valid) {

      const userEmail = this.forgotPasswordForm.getRawValue().email;
      this.authService.resetPassword({ email: userEmail }).subscribe(res => {
        this.router.navigate(['/login', { special: 'reset-sent', email: userEmail }]);
      }, errors => {
        this.handleError(errors);
      });

    } else {
      if (this.displayMessage) {
        for (const key in this.displayMessage) {
          if (Object.prototype.hasOwnProperty.call(this.displayMessage, key)) {
            if (this.displayMessage[key]) {
              return;
            }
          }
        }
      }
      this.displayMessage = this.genericValidatorService.processMessages(
        this.forgotPasswordForm,
        this.validationMessages
      );
    }
    // TODO
    // function () {
    //   $state.go('auth.login', { special: 'reset-sent', email: vm.data.email });
    // },
    // function (response) {
    //   vm.form.handleError(response.data, 'auth');
    // });
  }

  handleError(response: any) {
    switch (response.status) {
      case 422:
        this.setErrors(
          response.error ? this.errors(response) : response.message
        );
        break;
      case 400:
      case 404:
        this.setWarning({ warning: response.data.message });
        break;
      case 409:
        break;
      default:
        this.setErrors(this.translateService.instant('auth.errors.general'));
        break;
    }
  }

  /**
   *
   *
   * Processes errors returned by backend
   *
   *
   *
   * @param resp Response with data.errors
   * @returns key-value object of returned errors
   */
  errors(resp: any): any {
    const errs: string[] = [];
    if (resp.error && resp.error.errors) {
      for (const key in resp.error.errors) {
        if (Object.prototype.hasOwnProperty.call(resp.error.errors, key)) {
          // using key to determine which type of error for better messaging
          const formControl = this.forgotPasswordForm.get(key);
          if (formControl) {
            formControl.markAsTouched();
            formControl.markAsDirty();
            formControl.setErrors({
              error: this.getItems(resp.error.errors[key]).join(' '),
            });
            this.displayMessage[key] = this.getItems(
              resp.error.errors[key]
            ).join('\n');
          } else {
            errs.push(this.getItems(resp.error.errors[key]).join('\n'));
          }
        }
      }
    }
    return errs.join('<br>');
  }
  setErrors(errors: any) {
    this.formValidate.errors = errors;
  }

  setInfo(info: any) {
    this.formValidate.info = info;
  }

  setWarning(warning: any) {
    this.formValidate.warning = warning;
  }
  /**
   *
   *
   * get rid of indexed keys of an array
   *
   *
   *
   * @param indexedItems object with an indexed array of items
   * @returns Array of messages without indexes
   */
  getItems(indexedItems: any): any[] {
    const items: any[] = [];
    indexedItems.forEach((item: any) => {
      items.push(item);
    });
    return items;
  }
}
