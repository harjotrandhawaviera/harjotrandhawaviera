import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth-service.service';
import { FormatConfig } from '../../constant/formats.constant';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registrationForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(6),
    ]),
    email_confirmation: new FormControl('', [
      Validators.required,
      Validators.email,
      this.confirmingValidator('email'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(FormatConfig.check.passwordPattern),
      Validators.minLength(8),
    ]),
    password_confirmation: new FormControl('', [
      Validators.required,
      this.confirmingValidator('password'),
    ]),
  });
  formValidate: any = {};
  validationMessages: any;
  displayMessage: { [key: string]: string } = {};
  showPreamble: boolean = false;

  constructor(
    private genericValidatorService: GenericValidatorService,
    private authService: AuthService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private storageService: StorageService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  confirmingValidator(matchTo: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (
        control.parent?.get(matchTo)?.value &&
        control.value &&
        control.parent?.get(matchTo)?.value !== control.value
      ) {
        return { notMatch: true };
      } else {
        return null;
      }
    };
  }
  ngOnInit(): void {
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        email: {
          required: this.translateService.instant('form.errors.required'),
          email: this.translateService.instant('form.errors.email'),
          minlength: this.translateService.instant(
            'form.errors.minLengthEmail',
            { minlength: 6 }
          ),
        },
        email_confirmation: {
          required: this.translateService.instant('form.errors.required'),
          notMatch: this.translateService.instant('form.errors.matchEmail'),
          email: this.translateService.instant('form.errors.email'),
        },
        password: {
          required: this.translateService.instant('form.errors.required'),
          pattern: this.translateService.instant(
            'form.errors.pattern.password',
            { minlength: "8" }
          ),
          minlength: this.translateService.instant(
            'form.errors.minLengthPassword',
            { minlength: 8 }
          ),
        },
        password_confirmation: {
          required: this.translateService.instant('form.errors.required'),
          notMatch: this.translateService.instant('form.errors.matchPassword'),
        },
      };
      this.registrationForm.get('email')?.valueChanges.subscribe((res) => {
        const formControl = this.registrationForm.get('email_confirmation');
        if (formControl) {
          formControl.patchValue(null);
        }
      });
      this.registrationForm.get('password')?.valueChanges.subscribe((res) => {
        const formControl = this.registrationForm.get('password_confirmation');
        if (formControl) {
          formControl.patchValue(null);
        }
      });
      this.registrationForm.valueChanges.subscribe((value) => {
        if (!this.showPreamble) {
          this.displayMessage = this.genericValidatorService.processMessages(
            this.registrationForm,
            this.validationMessages
          );
        }
      });
    });
  }
  confirmPreamble() {
    this.genericValidatorService.setTouchedAllFormFields(this.registrationForm);
    if (this.registrationForm.valid) {
      this.showPreamble = true;
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
        this.registrationForm,
        this.validationMessages
      );
    }
  }
  signUp() {
    const user = this.registrationForm.getRawValue();
    // var user = {
    //   email: userData.email,
    //   email_confirmation: userData.emailConfirmation,
    //   password: userData.password,
    //   password_confirmation: userData.passwordConfirmation
    // };

    // check if data set (coming from prev state)
    if (user.email && user.password) {
      this.registrationForm.disable();
      this.showPreamble = false;
      this.authService.signUp(user).subscribe(
        (res) => {
          this.storageService.set('userReturning', 'true');
          // succeeded response, go to login view
          this.router.navigate(['/login', { special: 'registration' }]);
        },
        (error: any) => {
          this.registrationForm.enable();
          this.handleError(error);
        }
      );
    } else {
      // accept preamble
      this.acceptPreamble();
    }
  }
  /*
   *  accept preamble for current user
   */
  // TODO
  acceptPreamble() {
    // check if it is an already logged in user who just needs to accept a new preamble again
    // var user = userService.current();
    // if (user && user.role() === 'freelancer') {
    //   return userService.acceptPreamble().then(function (user) {
    //     if ($sessionStorage.afterLogin) {
    //       // uses location set in unauthorizedInterceptor if feature flag set
    //       $location.url($sessionStorage.afterLogin);
    //     } else {
    //       // redirect to user homescreen otherwise
    //       $state.go(user.homescreen());
    //     }
    //   });
    // } else {
    //   $state.go('auth.register');
    // }
  }
  handleError(response: any) {
    switch (response.status) {
      case 422:
        if (response.error) {
          this.setErrors(this.errors(response));
        } else {
          this.setErrors(response.message);
        }
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
   * Processes errors returned by backend
   *
   * @param {object} resp Response with data.errors
   * @returns {object} key-value object of returned errors
   */
  errors(resp: any): any {
    var errs: string[] = [];
    var errObj: any = {};
    if (resp.error && resp.error.errors) {
      for (const key in resp.error.errors) {
        if (Object.prototype.hasOwnProperty.call(resp.error.errors, key)) {
          // using key to determine which type of error for better messaging
          const formControl = this.registrationForm.get(key);
          if (formControl) {
            formControl.markAsDirty();
            formControl.markAsTouched();
            formControl.setErrors({
              error: this.getItems(resp.error.errors[key]).join(' '),
            });
            errObj[key] = this.getItems(resp.error.errors[key]).join('\n');
          } else {
            errs.push(this.getItems(resp.error.errors[key]).join('\n'));
          }
        }
      }
      //
      // console.log(this.displayMessage, 'this.displayMessage');
      // this.cdr.detectChanges();
    }
    this.displayMessage = errObj;
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
   * get rid of indexed keys of an array
   *
   * @param {object} indexedItems object with an indexed array of items
   * @returns {Array} Array of messages without indexes
   */
  getItems(indexedItems: any): any[] {
    const items: any[] = [];
    indexedItems.forEach((item: any) => {
      items.push(item);
    });
    return items;
  }

  /**
   * decline the preamble
   */
  declinePreamble() {
    // check if data set (coming from registration state otherwise from login state)
    const user = this.registrationForm.getRawValue();
    if (user.email) {
      // registration
      this.toastrService.success(
        this.translateService.instant('auth.preamble-declined')
      );
      this.showPreamble = false;
    } else {
      // login
      this.toastrService.success(
        this.translateService.instant('auth.update-preamble-declined')
      );
      // TODO
      // $auth.logout();
      // $state.go('auth.login');
    }
  }
}
