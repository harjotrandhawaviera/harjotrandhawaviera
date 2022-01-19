import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth-service.service';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  type?: string;
  confirmToken?: string;
  allowed: string[] = ['registration', 'passwordreset', 'emailchange', 'account-deletion'];
  errors: any;
  resendForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]),
  });
  validationMessages: any;
  displayMessage: { [key: string]: string } = {};
  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
    private genericValidatorService: GenericValidatorService,
    private translateService: TranslateService, private router: Router) { }

  ngOnInit(): void {
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        email: {
          required: this.translateService.instant('form.errors.required'),
          email: this.translateService.instant('form.errors.email'),
          minlength: this.translateService.instant('form.errors.minLengthEmail', { minlength: 6 }),
        }
      }
      this.resendForm.valueChanges.subscribe((value) => {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.resendForm,
          this.validationMessages
        );
      });
    });
    this.activatedRoute.params.subscribe(res => {
      if (res) {
        this.type = res.type;
        this.confirmToken = res.confirmToken;
        if (this.type) {
          if (!this.allowed.includes(this.type)) {
            this.router.navigate(['/login', { errors: 'action-not-allowed' }]);
          } else {
            if (this.confirmToken) {
              this.authService.confirm({ type: this.type, token: this.confirmToken }).subscribe(res => {
                this.router.navigate(['/login', { special: this.type + '-confirmed' }]);
              }, errors => {
                var msg = errors.status === 404 ? this.translateService.instant('auth.errors.token-not-found') : errors.error.message;
                this.setErrors(msg);
              });
            } else {
              this.router.navigate(['/login', { errors: 'action-not-allowed' }]);
            }
          }
        }

      }
    })
  }
  setErrors(msg: any) {
    this.errors = msg;
  }
  resendConfirmation() {
    this.genericValidatorService.setTouchedAllFormFields(this.resendForm);
    if (this.resendForm.valid) {
      const formValue = this.resendForm.getRawValue();
      this.authService.resendConfirmation({ email: formValue.email }).subscribe(
        (res) => {
          this.router.navigate(['/login', { special: 'confirmation-resent' }]);
        },
        (response) => {
          if (response.error.status_code === 404 || response.status === 404) {
            this.setErrors(this.translateService.instant('auth.errors.user-not-found'));
          } else {
            this.setErrors(this.translateService.instant('auth.errors.' + response.error.message));
          }
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
        this.resendForm,
        this.validationMessages
      );
    }
  }
}
