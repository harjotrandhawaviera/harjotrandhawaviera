import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

import { FormConfig } from './../../constant/forms.constant';
import { FormatConfig } from '../../constant/formats.constant';
import { FormatService } from './../../services/format.service';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { OptionVM, TimeZoneOptionVM } from '../../model/option.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserRequestService } from '../../services/user-request.service';
import { UserService } from './../../services/user.service';
import { UsersService } from './../../services/users.service';
import { ageValidator } from '../../utility/age.validator';
import { phoneValidator } from '../../utility/phone.validator';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  changePassword = false;
  roleId = '';
  userId = '';
  role = '';
  data: any;
  profileForm: FormGroup | undefined;
  displayMessage: any = {};
  validationMessages: any;
  languageLK: OptionVM[] = [];
  timezoneLK: TimeZoneOptionVM[] = [];
  pendingEmail: any;
  get passwordForm(): FormGroup | undefined {
    return this.profileForm ? this.profileForm.get('password') as FormGroup : undefined;
  }
  get agentForm(): FormGroup | undefined {
    return this.profileForm ? this.profileForm.get('agent') as FormGroup : undefined;
  }
  get passwordDisplayMessage(): any {
    return this.displayMessage && this.displayMessage.password ? this.displayMessage.password : {};
  }
  get agentDisplayMessage(): any {
    return this.displayMessage && this.displayMessage.agent ? this.displayMessage.agent : {};
  }
  constructor(
    private userService: UserService,
    private usersService: UsersService,
    private translateService: TranslateService,
    private formatService: FormatService,
    private userRequestService: UserRequestService,
    private toastrService: ToastrService,
    private genericValidatorService: GenericValidatorService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.roleId = this.userService.user().roleId();
    this.userId = this.userService.user().id();
    this.role = this.userService.user().role();
    this.languageLK = FormConfig.master.languages.map(a => {
      return {
        text: a,
        value: a
      };
    });
    this.timezoneLK = FormConfig.preferences.timezones.map(a => {
      return a
    });

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
        password: {
          current: {
            required: this.translateService.instant('form.errors.required'),
          },
          new: {
            required: this.translateService.instant('form.errors.required'),
            pattern: this.translateService.instant(
              'form.errors.pattern.password',
              { minlength: "8" }
            ),
            minlength: this.translateService.instant(
              'form.errors.minLengthPassword',
              { minlength: "8" }
            ),
          },
          confirmed: {
            required: this.translateService.instant('form.errors.required'),
            notMatch: this.translateService.instant('form.errors.matchPassword'),
          }
        },
        agent: {
          gender: {
            required: this.translateService.instant('form.errors.required')
          },
          firstname: {
            required: this.translateService.instant('form.errors.required')
          },
          lastname: {
            required: this.translateService.instant('form.errors.required')
          },
          birthdate: {
            required: this.translateService.instant('form.errors.required'),
            ageValidate: this.translateService.instant(
              'form.errors.validateage', { min: 18 }
            )
          },
          mobile: {
            required: this.translateService.instant('form.errors.required'),
            phone: this.translateService.instant('form.errors.phonenumberformat')
          }
        }
      };
    });
    this.loadUserData();
  }
  private loadUserData() {
    this.usersService.getUserById({ id: this.userId, include: ['requests'] }).subscribe(res => {
      if (res && res.data) {
        const pending = (res.data.requests || []).data.find((a: any) => a.action === 'replace-user-primaryemail');
        this.pendingEmail = pending && pending.params.email
        const email = (res.data.contact && res.data.contact.data && res.data.contact.data.email) || res.data.email;
        this.data = {
          ...res.data,
          agent: res.data.agent && res.data.agent.data,
          freelancer: res.data.freelancer && res.data.freelancer.data,
          client: res.data.role === 'client' && res.data.contact && res.data.contact.data,
          field: res.data.role === 'field' && res.data.contact && res.data.contact.data,
          email: email,
          originalEmail: email,
          pendingEmail: pending && pending.params.email
        };
        // for client users email available only from contacts

        this.profileForm = new FormGroup({
          email: new FormControl(this.data.email, [Validators.required, Validators.email, Validators.minLength(6)]),
          language: new FormControl({value: 'german', disabled: true}, [Validators.required]),
          timezone: new FormControl({value: 'W. Europe Standard Time', disabled: true}, [Validators.required]),
        });
        if (this.data.agent) {
          this.profileForm.addControl('agent', new FormGroup({
            gender: new FormControl(this.data.agent.gender, []),
            firstname: new FormControl(this.data.agent.firstname, [Validators.required]),
            lastname: new FormControl(this.data.agent.lastname, [Validators.required]),
            birthdate: new FormControl(this.data.agent.birthdate, [Validators.required, ageValidator(18)]),
            mobile: new FormControl(this.data.agent.mobile, [phoneValidator()]),
          }));
        }
        if (this.profileForm) {
          this.profileForm.valueChanges.subscribe((value) => {
            if (this.profileForm) {
              this.displayMessage = this.genericValidatorService.processMessages(
                this.profileForm,
                this.validationMessages
              );
            }
          });
        }
      }
    });
  }
  prepareData(formValue: any) {
    const preparedData: any = (({ id, username, agent, originalEmail, freelancer }) => ({ id, username, agent, originalEmail, freelancer }))(this.data)
    preparedData.email = formValue.email;
    preparedData.password = formValue.password;
    preparedData.agent = preparedData.agent ? { ...preparedData.agent, ...formValue.agent } : formValue.agent;
    if (preparedData.agent) {
      preparedData.agent.birthdate = preparedData.agent.birthdate ? this.formatService.date(preparedData.agent.birthdate, true, 'YYYY-MM-DD') : null;
    }
    if (preparedData.email !== preparedData.originalEmail) {
      preparedData.request = {
        type: 'user-confirmedchange',
        action: 'replace-user-primaryemail',
        email: preparedData.email
      };
    }
    if (preparedData.password && preparedData.password.current && preparedData.password.new && preparedData.password.confirmed && preparedData.password.current !== preparedData.password.new) {
      preparedData.password_confirmation = preparedData.password.confirmed;
      preparedData.password_current = preparedData.password.current;
      preparedData.password = preparedData.password.new;
    }
    Object.keys(preparedData).forEach((key) => {
      if (preparedData[key] === null) {
        delete preparedData[key];
      }
    });
    return preparedData;
  }
  profileSubmit() {
    this.profileForm?.markAllAsTouched();
    if (this.profileForm && this.profileForm.valid) {
      const formValue = this.profileForm.getRawValue();
      const prepareData = this.prepareData(formValue);
      const req: Observable<any>[] = [];
      if (prepareData.agent && prepareData.agent.id) {
        req.push(this.usersService.updateAgent({ id: prepareData.agent.id, agent: prepareData.agent }));
      }
      req.push(this.usersService.updateUser({ user: prepareData }));
      if (prepareData.request) {
        req.push(this.userRequestService.submitRequest(prepareData.request));
      }
      forkJoin(req).subscribe(res => {
        this.toastrService.success(this.translateService.instant('notification.post.users.success'));
        this.changePassword = false;
        this.loadUserData();
      });
    } else if (this.profileForm) {
      this.displayMessage = this.genericValidatorService.processMessages(
        this.profileForm,
        this.validationMessages
      );
      for (const key of Object.keys(this.profileForm.controls)) {
        if (this.profileForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]'
          );
          if (invalidControl) {
            invalidControl.focus();
          }
          break;
        }
      }
    }
  }
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
  toggleChangePassword() {
    if (this.passwordForm) {
      this.passwordForm.reset();
    }
    this.changePassword = !this.changePassword;
    if (this.changePassword) {
      if (this.passwordForm) {
        this.profileForm?.removeControl('password');
      }
      this.profileForm?.addControl('password', new FormGroup({
        current: new FormControl('', [Validators.required]),
        new: new FormControl('', [
          Validators.required,
          Validators.pattern(FormatConfig.check.passwordPattern),
          Validators.minLength(8)]),
        confirmed: new FormControl('', [Validators.required,
        this.confirmingValidator('new')])
      }));
      this.displayMessage.password = {};
    } else {
      this.profileForm?.removeControl('password');
      this.displayMessage.password = {};
    }
  }
}
