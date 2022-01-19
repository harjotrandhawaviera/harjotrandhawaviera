import * as fromClient from './../state';
import * as fromClientAction from './../state/client.actions';

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { ContactVM } from './../../model/contact.model';
import { FormConfig } from './../../constant/forms.constant';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { TranslateService } from './../../services/translate.service';
import { phoneValidator } from '../../utility/phone.validator';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss'],
})
export class ContactDetailComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input()
  clientId: string | undefined | null;
  @Input()
  contact: ContactVM | undefined | null;
  @Input()
  showAddress: boolean = false;
  @Output() contactSubmitted = new EventEmitter<ContactVM>();
  contactForm?: FormGroup;
  salutationOptions: string[];
  componentActive = true;
  parentOption$: Observable<ContactVM[] | undefined> = of([]);

  validationMessages: any;
  displayMessage: { [key: string]: string } = {};

  constructor(
    private translateService: TranslateService,
    private store: Store<fromClient.State>,
    private genericValidatorService: GenericValidatorService
  ) {
    this.salutationOptions = [...FormConfig.contact.salutation];
  }
  ngAfterViewInit(): void {
    this.scrollIntoView();
  }
  private scrollIntoView() {
    setTimeout(() => {
      const formEle = document.getElementById('contactFormAction');
      if (formEle) {
        document.getElementById('contactFormAction')?.scrollIntoView();
      }
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contact) {
      if (this.contact) {
        this.initForm();
        this.patchContact();
        this.scrollIntoView();
      }
    } else {
      this.initForm();
    }
  }
  patchContact() {
    if (this.contact && this.contactForm) {
      const obj = {
        salutation: this.contact.salutation,
        contact_id: this.contact.contact_id,
        firstname: this.contact.firstname,
        lastname: this.contact.lastname,
        position: this.contact.position,
        department: this.contact.department,
        email: this.contact.email,
        phone: this.contact.phone,
        address: this.contact.address,
        addressaddition: this.contact.addressaddition,
        zip: this.contact.zip,
        city: this.contact.city,
        country: this.contact.country,
        data: this.contact.data,
        role: this.contact.role,
      };
      const emailControl = this.contactForm.get('email');
      const roleControl = this.contactForm.get('role');
      if (this.contact.user?.id) {
        emailControl?.disable();
        roleControl?.disable();
      } else {
        emailControl?.enable();
        roleControl?.enable();
      }
      this.contactForm.patchValue(obj);
    }
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  initForm() {
    this.contactForm = new FormGroup({
      salutation: new FormControl('', []),
      contact_id: new FormControl('', []),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      department: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, phoneValidator()]),
      address: new FormControl('', []),
      addressaddition: new FormControl('', []),
      zip: new FormControl('', []),
      city: new FormControl('', []),
      country: new FormControl('', []),
      data: new FormControl('', []),
      role: new FormControl('', []),
    });
  }

  ngOnInit(): void {
   // this.initForm();
    this.parentOption$ = this.store.pipe(
      select(fromClient.getParentOption),
      takeWhile(() => this.componentActive)
    );

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        firstname: {
          required: this.translateService.instant('form.errors.required'),
        },
        lastname: {
          required: this.translateService.instant('form.errors.required'),
        },
        position: {
          required: this.translateService.instant('form.errors.required'),
        },
        email: {
          required: this.translateService.instant('form.errors.required'),
          email: this.translateService.instant('form.errors.email'),
        },
        phone: {
          required: this.translateService.instant('form.errors.required'),
          phone: this.translateService.instant(
            'form.errors.phonenumberformat'
          ),
        },
      };
      if (this.contactForm) {
        this.contactForm.valueChanges.subscribe((value) => {
          if (this.contactForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.contactForm,
              this.validationMessages
            );
          }
        });
      }
    });
  }

  get cForm() { // @ts-ignore
    return this.contactForm.controls;
  }

  submitForm() {
    if (this.contactForm) {
      if (this.contactForm.valid) {
        const obj: ContactVM = { ...this.contact };
        const formValue = this.contactForm.getRawValue();
        obj.salutation = formValue.salutation;
        obj.contact_id = formValue.contact_id;
        obj.firstname = formValue.firstname;
        obj.lastname = formValue.lastname;
        obj.position = formValue.position;
        obj.department = formValue.department;
        obj.email = formValue.email;
        obj.phone = formValue.phone;
        obj.address = formValue.address;
        obj.addressaddition = formValue.addressaddition;
        obj.zip = formValue.zip;
        obj.city = formValue.city;
        obj.country = formValue.country;
        obj.data = formValue.data;
        obj.role = formValue.role;
        if (this.clientId) {
          if (this.contact?.id) {
            this.store.dispatch(
              new fromClientAction.UpdateContact({
                clientId: this.clientId,
                id: this.contact.id,
                contact: obj,
              })
            );
          } else {
            this.store.dispatch(
              new fromClientAction.CreateContact({
                clientId: this.clientId,
                contact: obj,
              })
            );
          }
        }
      }
    }
  }
  cancelContact() {
    this.store.dispatch(new fromClientAction.ClearContactDetail());
  }
}
