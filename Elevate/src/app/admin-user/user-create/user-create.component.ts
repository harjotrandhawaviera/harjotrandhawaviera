import * as fromUser from './../state';
import * as fromUserAction from './../state/user.actions';
import * as moment from 'moment';

import { AdminVM, RightsVM, UserVM } from '../models/user.model';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AgentVM } from '../../model/agent.model';
import { FormConfig } from '../../constant/forms.constant';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { OptionVM } from '../../model/option.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from './../../services/translate.service';
import { UserMappingService } from '../services/user-mapping.service';
import { UsersService } from '../../services/users.service';
import { phoneValidator } from '../../utility/phone.validator';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  addUserForm?: FormGroup;
  roleLK: OptionVM[] = [];
  availableRolesLK: OptionVM[] = [];
  rights: RightsVM[] = [];
  rightsPerRole: RightsVM[] = [];
  salutationOptions: string[];
  validationMessages: any;
  displayMessage: any = {};
  isAgentData = false;
  maxDate: Date;
  minDate: Date;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private usersService: UsersService,
    private userMappingService: UserMappingService,
    private store: Store<fromUser.State>,
    private el: ElementRef
  ) {
    this.salutationOptions = [...FormConfig.users.salutation];
    this.maxDate = new Date();
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.loadLookups();
    this.getRights();
    this.initForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
  }

  loadLookups() {
    this.translateService.get('administration.users.fields.role').subscribe((a) => {
      this.roleLK = FormConfig.users.role.map((a) => {
        return {
          value: a,
          text: this.translateService.instant('administration.users.fields.role.' + a),
        };
      });
      this.availableRolesLK = this.setAvailableRoles(this.roleLK);
    });
  }

  setAvailableRoles(roleLK: OptionVM[]) {
    let roles: OptionVM[] = [];
    roleLK.forEach((option) => {
      if (
        option.value !== 'freelancer' &&
        option.value !== 'client' &&
        option.value !== 'field'
      ) {
        roles.push(option);
      }
    });
    return roles;
  }

  getRights() {
    this.usersService.getRights({}).subscribe((res) => {
      this.rights = this.userMappingService.RightsResponseToVM(res);
    });
  }

  getRightsPerRole(role: string) {
    this.usersService.getRightsPerRole({}, role).subscribe((res) => {
      this.rightsPerRole = this.userMappingService.RightsResponseToVM(res);
    });
  }

  initForm() {
    this.addUserForm = this.fb.group({
      role: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(6)],
      ],
      salutation: [
        { value: '', disabled: !this.isAgentData },
        [Validators.required],
      ],
      firstName: [
        { value: '', disabled: !this.isAgentData },
        [Validators.required],
      ],
      lastName: [
        { value: '', disabled: !this.isAgentData },
        [Validators.required],
      ],
      birthdate: [
        { value: '', disabled: !this.isAgentData },
        [Validators.required],
      ],
      phone: [
        { value: '', disabled: !this.isAgentData },
        [Validators.required, phoneValidator()],
      ],
    });

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        role: {
          required: this.translateService.instant('form.errors.required'),
        },
        email: {
          email: this.translateService.instant('form.errors.email'),
          minlength: this.translateService.instant(
            'form.errors.minLengthEmail',
            { minlength: 6 }
          ),
        },
        salutation: {
          required: this.translateService.instant('form.errors.required'),
        },
        firstName: {
          required: this.translateService.instant('form.errors.required'),
        },
        lastName: {
          required: this.translateService.instant('form.errors.required'),
        },
        birthdate: {
          required: this.translateService.instant('form.errors.required'),
        },
        phone: {
          phone: this.translateService.instant(
            'form.errors.phonenumberformat'
          ),
        },
      };
      if (this.addUserForm) {
        this.addUserForm.valueChanges.subscribe((value) => {
          if (this.addUserForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.addUserForm,
              this.validationMessages
            );
          }
        });
      }
    });
  }

  onRoleChange(role: string) {
    this.isAgentData = role === 'agent';
    this.enableDisableFields();
    this.getRightsPerRole(role);
  }

  enableDisableFields() {
    if (this.isAgentData) {
      this.addUserForm?.get('salutation')?.enable();
      this.addUserForm?.get('firstName')?.enable();
      this.addUserForm?.get('lastName')?.enable();
      this.addUserForm?.get('birthdate')?.enable();
      this.addUserForm?.get('phone')?.enable();
    } else {
      this.addUserForm?.get('salutation')?.disable();
      this.addUserForm?.get('firstName')?.disable();
      this.addUserForm?.get('lastName')?.disable();
      this.addUserForm?.get('birthdate')?.disable();
      this.addUserForm?.get('phone')?.disable();
    }
  }

  isCheckboxSelected(id: number | undefined) {
    return this.rightsPerRole.some((x) => x.id === id);
  }

  saveUser() {
    if (this.addUserForm) {
      this.addUserForm.markAllAsTouched();
      this.addUserForm.markAsDirty();
      if (this.addUserForm.valid) {
        const formValue = this.addUserForm.getRawValue();
        const agent: AgentVM = {
          birthdate: moment.utc(formValue.birthdate).format('YYYY-MM-DD'),
          firstname: formValue.firstName,
          gender: formValue.salutation,
          lastname: formValue.lastName,
          mobile: formValue.phone,
        };
        const admin: AdminVM = {
          gender: formValue.salutation,
        };
        const obj: UserVM = {
          admin: !this.isAgentData ? admin : {},
          agent: this.isAgentData ? agent : {},
          email: formValue.email,
          role: this.isAgentData ? 'agent' : 'admin',
          rights:
            this.rightsPerRole && this.rightsPerRole.length > 0
              ? this.rightsPerRole.map((x) => x.identifier)
              : [],
        };
        this.store.dispatch(new fromUserAction.CreateUser({ user: obj }));
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.addUserForm,
          this.validationMessages
        );
        for (const key of Object.keys(this.addUserForm.controls)) {
          if (this.addUserForm.controls[key].invalid) {
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
  }

  cancel() {
    this.router.navigate(['/administration/users']);
  }
}
