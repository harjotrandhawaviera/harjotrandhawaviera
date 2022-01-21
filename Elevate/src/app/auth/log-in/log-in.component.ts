import * as fromUser from './../../root-state/user-state';
import * as userActions from './../../root-state/user-state/user.actions';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth-service.service';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { StorageService } from './../../services/storage.service';
import { Store } from '@ngrx/store';
import { TranslateService } from './../../services/translate.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  validationMessages: any;
  displayMessage: { [key: string]: string } = {};
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  formValidate: any = {};
  warning: any;
  template: string;
  email: any;
  isLangSelected = false;
  selectedLanguage;

  constructor(
    private genericValidatorService: GenericValidatorService,
    private authService: AuthService,
    private userService: UserService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private userStore: Store<fromUser.State>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // this.template ='auth.' + (auth.slogan || 'default') + '.slogan';
    this.template = 'auth.login.slogan';
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      if (res) {
        if (res.special) {
          this.translateService
            .get('auth.login-after-' + res.special)
            .subscribe((translatedText) => {
              this.setInfo(translatedText);
            });
        }
        if (res.errors) {
          this.translateService
            .get('auth.errors.' + res.errors)
            .subscribe((translatedText) => {
              this.setErrors(translatedText);
            });
        }
      }
    });
    this.authService.setToken(null);
    this.userStore.dispatch(userActions.UserLogoutSuccess());
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        email: {
          required: this.translateService.instant('form.errors.required'),
          email: this.translateService.instant('form.errors.email'),
        },
        password: {
          required: this.translateService.instant('form.errors.required'),
        },
      };
      this.loginForm.valueChanges.subscribe((value) => {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.loginForm,
          this.validationMessages
        );
      });
    });
  }

  languageSelected(e) {
    console.log(e);
    this.isLangSelected = true;
    this.storageService.set('language', this.selectedLanguage);
    this.translateService.language = this.selectedLanguage;
    // location.reload();
  }


  login() {
    this.genericValidatorService.setTouchedAllFormFields(this.loginForm);
    this.clear();
    if (this.loginForm.valid) {
      const user = this.loginForm.getRawValue();
      this.email = user.email;
      this.authService.login(user).subscribe(
        (res) => {
          this.storageService.set('token', res.token);
          this.userService.getCurrentUser().subscribe((userResponse) => {
            this.userService.set(userResponse);
            this.userStore.dispatch(
              userActions.UserLoginSuccess({ user: userResponse.data })
            );
            this.storageService.set('userReturning', 'true');
            const onBoarding =
              (userResponse.data.role === 'freelancer' ||
                !userResponse.data.role) &&
                userResponse.data.status === 'onboarding';
            const afterLogin = this.storageService.get('afterLogin');
            if (afterLogin) {
              this.router.navigateByUrl(afterLogin).then(() => {
                this.storageService.clear('afterLogin');
              });
            } else {
              this.router.navigate([
                onBoarding ? 'home/profile/start' : 'home/dashboard',
              ]);
            }
          });
        },
        (error: any) => {
          this.storageService.set('email', user.email);
          this.handleError(error);
          if (error.error && !this.handleWarning(error.error.message)) {
          }
        }
      );
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
        this.loginForm,
        this.validationMessages
      );
    }
  }
  handleWarning(message: any) {
    const warnings = ['not_confirmed_registration', 'invalid_credentials'];
    if (warnings.includes(message)) {
      // set special messages as warning handled in template
      this.setWarning(message);
      return true;
    }
    return false;
  }
  handleError(response: any) {
    switch (response.status) {
      case 422:
        this.setErrors(
          response.error ? this.errors(response) : response.message
        );
        break;
      case 403:
        this.handleWarning(response.error.message);
        break;
      case 400:
      case 404:
        this.setWarning({ warning: response.message });
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
          const formControl = this.loginForm.get(key);
          if (formControl) {
            formControl.markAsDirty();
            formControl.markAsTouched();
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
    this.warning = warning;
  }

  clear() {
    this.setErrors(null);
    this.setInfo(false);
    this.setWarning(false);
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

  blur(): void {
    if (this.loginForm) {
      this.displayMessage = this.genericValidatorService.processMessages(
        this.loginForm,
        this.validationMessages
      );
    }
  }

  resendConfirmation() {
    this.authService.resendConfirmation({ email: this.email }).subscribe(
      (res) => {
        this.setInfo(
          this.translateService.instant('auth.login-after-confirmation-resent')
        );
      },
      (response) => {
        const msg =
          response.status === 404 ? 'user-not-found' : response.data.message;
        this.setErrors(this.translateService.instant('auth.errors.' + msg));
      }
    );
  }
}
