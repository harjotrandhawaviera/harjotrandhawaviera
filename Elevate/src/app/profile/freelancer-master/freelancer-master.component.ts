import * as fromProfile from './../state/index';
import * as fromProfileAction from './../state/profile.actions';
import * as fromUser from './../../root-state/user-state';

import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { FormConfig } from './../../constant/forms.constant';
import {FreelancerAssignmentVM, FreelancerVM} from '../../model/freelancer.model';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { OptionVM } from './../../model/option.model';
import { TranslateService } from './../../services/translate.service';
import { UserService } from '../../services/user.service';
import { ageValidator } from '../../utility/age.validator';
import { phoneValidatorForNgxintltelInput } from '../../utility/phone.validator';
import { zipValidator } from '../../utility/zip.validator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {Router} from "@angular/router";

@Component({
  selector: '[app-freelancer-master]',
  templateUrl: './freelancer-master.component.html',
  styleUrls: ['./freelancer-master.component.scss'],
})
export class FreelancerMasterComponent implements OnInit, OnChanges {
  @Input()
  profile: FreelancerVM | undefined;
  @Input()
  freelancerAssignment: FreelancerAssignmentVM | undefined;
  @Input()
  readonly: boolean = false;
  detailForm: FormGroup | undefined;
  validationMessages: any;
  displayMessage: any = {};
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [ CountryISO.Austria, CountryISO.France, CountryISO.Germany, CountryISO.UnitedKingdom , CountryISO.UnitedStates];

  secondAddressInUse = false;
  selectDate = new Date();
  role: string | undefined;
  countryLK: OptionVM[] = [];
  mobileCode: any;
  mobileCode2: any;
  // roleId: number | undefined;
  isAdmin = false;

  get addressGroup(): FormGroup | undefined {
    return this.detailForm
      ? (this.detailForm.get('address') as FormGroup)
      : undefined;
  }

  get alternateAddressGroup(): FormGroup | undefined {
    return this.detailForm
      ? (this.detailForm.get('alternateAddress') as FormGroup)
      : undefined;
  }

  get mobilePlaceholder(): any {
    return this.translateService.instant(
      'profile.fields.mobile.placeholder'
    )
  }

  get alternativeMobilePlaceholder(): any {
    return this.translateService.instant(
     'profile.fields.alternativePhone.placeholder'
    )
  }
  // isOnboarding$: Observable<boolean | undefined> = of(undefined);
  isOnboarding = false;
  genderLK: OptionVM[] = [];
  driverLicenceLK: OptionVM[] = [];
  driverLicenceTypeLK: any[] = [];
  selectedLicenses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private store: Store<fromProfile.State>,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private el: ElementRef
  ) {
    this.selectDate.setDate(this.selectDate.getDate());
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.profile) {
      if (this.profile) {
        this.initForm();
      }
    }
  }



  ngOnInit(): void {
    var mainContent = document.getElementById("main-content");
    mainContent?.scrollIntoView()
    this.loadLookups();
    this.isOnboarding = this.userService.user().onboarding();
    this.role = this.userService.user().role();
    this.isAdmin = this.userService.user().role() === 'admin';
    this.initForm()
    // this.isOnboarding$.subscribe(res => {
    //   this.isOnboarding = !!res;
    // });
    // this.userStore.pipe(select(fromUser.getUserRole)).subscribe((role) => {
    //   this.role = role;
    // });
    // this.userStore.pipe(select(fromUser.getUserRoleId)).subscribe((roleId) => {
    //   this.roleId = roleId;
    //   if (roleId) {
    //     this.store.dispatch(
    //       new fromProfileAction.LoadProfileDetail({ id: roleId, mode: '' })
    //     );
    //   }
    // });
    // this.store
    //   .pipe(select(fromProfile.getProfileDetail))
    //   .subscribe((profile) => {
    //     this.profile = profile;
    //     this.initForm();
    //   });
  }

  private initForm() {
    this.detailForm = this.fb.group({
      title: ['', []],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthdate: ['', [Validators.required, ageValidator(18)]],
      gender: ['', [Validators.required]],
      birthplace: ['',[]],
      birthcountry: ['', [Validators.required]],
      has_driverslicense: ['', []],
      driver_license: [[]],
      mobile: ['', [Validators.required]],
      mobile1: ['', [Validators.required]],
      alternative_phone: ['', []],
      alternative_phone1: ['', []],
      mobile_contry_code: ['', [Validators.required]],
      mobile_contry_code2: ['', []],
      mobile_dial_code: ['', [Validators.required]],
      mobile_dial_code2: ['', []],
      email: ['', [Validators.required]],
      address: this.fb.group({
        address: ['', [Validators.required]],
        addressaddition: ['', []],
        zip: ['', [Validators.required, zipValidator()]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
        near_to_city: ['', []],
        locality: ['', [Validators.required]],
        locality_lat: ['', [Validators.required]],
        locality_lng: ['', [Validators.required]],
      })
    });
    // this.detailForm.get('title')?.disable();
    if (this.readonly) {
      this.detailForm.disable();
    }
    this.patchValue();
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        firstname: {
          required: this.translateService.instant('form.errors.required'),
        },
        lastname: {
          required: this.translateService.instant('form.errors.required'),
        },
        birthdate: {
          required: this.translateService.instant('form.errors.required'),
          ageValidate: this.translateService.instant(
            'form.errors.validateage', { min: 18 }
          ),
        },
        gender: {
          required: this.translateService.instant('form.errors.required'),
        },
        // birthplace: {
        //   required: this.translateService.instant('form.errors.required'),
        // },
        birthcountry: {
          required: this.translateService.instant('form.errors.required'),
        },
        mobile: {
          required: this.translateService.instant('form.errors.required'),
        },
        email: {
          required: this.translateService.instant('form.errors.required'),
        },
        address: {
          address: {
            required: this.translateService.instant('form.errors.required'),
          },
           locality: {
            required: this.translateService.instant('form.errors.required'),
          },
          zip: {
            required: this.translateService.instant('form.errors.required'),
            zip: this.translateService.instant('form.errors.zipcodeformat')
          },
          city: {
            required: this.translateService.instant('form.errors.required'),
          },
          country: {
            required: this.translateService.instant('form.errors.required'),
          },
        },
        alternateAddress: {
          address: {
            required: this.translateService.instant('form.errors.required'),
          },
          locality: {
            required: this.translateService.instant('form.errors.required'),
          },
          // addressaddition: {
          //   required: this.translateService.instant('form.errors.required'),
          // },
          zip: {
            required: this.translateService.instant('form.errors.required'),
            zip: this.translateService.instant('form.errors.zipcodeformat')
          },
          city: {
            required: this.translateService.instant('form.errors.required'),
          },
          country: {
            required: this.translateService.instant('form.errors.required'),
          },
        },
      };
      if (this.detailForm) {
        this.detailForm.valueChanges.subscribe((value) => {
          if (this.detailForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.detailForm,
              this.validationMessages
            );
          }
        });
      }
    });
  }
  patchValue() {
    if (this.profile && this.detailForm) {
      this.detailForm.get('email')?.disable();
      // if (this.userService.user().role() !== 'freelancer') {
      //   this.detailForm.get('mobile')?.enable();
      //   this.detailForm.get('alternative_phone')?.enable();
      // } else {
      //   this.detailForm.get('mobile')?.enable();
      //   this.detailForm.get('alternative_phone')?.enable();
      // }
      const obj: any = {};
      obj.title = this.profile.title;
      obj.firstname = this.profile.firstname;
      obj.lastname = this.profile.lastname;
      obj.birthdate = this.profile.birthdate;
      obj.gender = this.profile.gender;
      obj.birthplace = this.profile.birthplace;
      obj.birthcountry = this.profile.birthcountry;
      obj.has_driverslicense = this.profile.has_driverslicense
        ? this.profile.has_driverslicense.toString()
        : 'false';

      obj.driver_license = this.profile.driver_license;
      this.selectedLicenses = [...this.profile.driver_license];
      obj.mobile = this.profile.mobile;
      obj.mobile1 = this.profile.mobile;
      obj.alternative_phone = this.profile.alternative_phone;
      obj.alternative_phone1 = this.profile.alternative_phone;
      obj.mobile_contry_code = this.profile.mobile_contry_code;
      obj.mobile_contry_code2 = this.profile.mobile_contry_code2;
      obj.mobile_dial_code = this.profile.mobile_dial_code;
      obj.mobile_dial_code2 = this.profile.mobile_dial_code2;
      obj.email = this.profile.user?.email;
      obj.address = {};
      obj.address.address = this.profile.address;
      obj.address.addressaddition = this.profile.addressaddition;
      obj.address.zip = this.profile.zip;
      obj.address.city = this.profile.city;
      obj.address.country = this.profile.country;
      obj.address.near_to_city = this.profile.near_to_city;
      obj.address.locality = this.profile.locality;
      obj.address.locality_lat = this.profile.locality_lat;
      obj.address.locality_lng = this.profile.locality_lng;
      this.mobileCode =  this.profile?.mobile_contry_code;
      this.mobileCode2 =  this.profile?.mobile_contry_code2
      obj.alternateAddress = {};
      obj.alternateAddress.address = this.profile.address2;
      obj.alternateAddress.addressaddition = this.profile.addressaddition2;
      obj.alternateAddress.zip = this.profile.zip2;
      obj.alternateAddress.city = this.profile.city2;
      obj.alternateAddress.country = this.profile.country2;
      obj.alternateAddress.near_to_city = this.profile.near_to_city2;
      obj.alternateAddress.locality = this.profile.locality_alternative;
      for (const key in obj.alternateAddress) {
        if (Object.prototype.hasOwnProperty.call(obj.alternateAddress, key)) {
          const element = obj.alternateAddress[key];
          if (element) {
            this.secondAddressInUse = true;
            break;
          }
        }
      }
      this.useSecondAddress(this.secondAddressInUse);
      this.detailForm.patchValue(obj);
    }
  }

  private loadLookups() {
    this.genderLK = FormConfig.master.gender.map((a) => {
      return {
        value: a,
        text: undefined,
      };
    });
    this.driverLicenceLK = FormConfig.master.hasDriversLicense.map((a) => {
      return {
        value: a,
        text: undefined,
      };
    });
    this.translateService.get('country').subscribe(res => {
      this.countryLK = FormConfig.master.countries.map(a => {
        return {
          value: res[a],
          text: res[a]
        }
      });
    });
    this.driverLicenceTypeLK = FormConfig.master.licenseTypes.map((a) => {
      return {
        value: a,
        text: undefined,
      };
    });
  }
  cancel() {
    this.router.navigate(['approval/freelancer-approved']);
  }
  saveDetail() {
    console.log(this.detailForm)
    this.detailForm?.controls.mobile_contry_code.setValue(this.detailForm?.controls.mobile1?.value?.countryCode)
    this.detailForm?.controls.mobile_contry_code2.setValue(this.detailForm?.controls.alternative_phone1?.value?.countryCode)
    this.detailForm?.controls.mobile_dial_code.setValue(this.detailForm?.controls.mobile1?.value?.dialCode)
    this.detailForm?.controls.mobile_dial_code2.setValue(this.detailForm?.controls.alternative_phone1?.value?.dialCode)
    this.detailForm?.controls.mobile.setValue(this.detailForm?.controls.mobile1.value?.number)
    this.detailForm?.controls.alternative_phone.setValue(this.detailForm?.controls.alternative_phone1.value?.number)
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      const onlyValidForm = this.isOnboarding || (this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') !== -1);
      if ((onlyValidForm && this.detailForm.valid) || (!onlyValidForm) || this.isAdmin) {
        console.log(this.profile)
        const formValue = this.detailForm.getRawValue();
        const obj: FreelancerVM = {};
        obj.title = formValue.title || null;
        obj.firstname = formValue.firstname || null;
        obj.lastname = formValue.lastname || null;
        obj.birthdate = formValue.birthdate || null;
        obj.gender = formValue.gender || null;
        obj.birthplace = formValue.birthplace || null;
        obj.birthcountry = formValue.birthcountry || null;
        obj.has_driverslicense = formValue.has_driverslicense == "false" ? false : true|| null;
        obj.driver_license = this.selectedLicenses.join() || null;
        obj.mobile = formValue.mobile || null;
        obj.mobile_contry_code = formValue.mobile_contry_code || null;
        obj.mobile_contry_code2 = formValue.mobile_contry_code2 || null;
        obj.mobile_dial_code = formValue.mobile_dial_code || null;
        obj.mobile_dial_code2 = formValue.mobile_dial_code2 || null;
        obj.alternative_phone = formValue.alternative_phone || null;
        const address = formValue.address;
        if (address) {
          obj.address = address.address || null;
          obj.addressaddition = address.addressaddition || null;
          obj.zip = address.zip || null;
          obj.city = address.city || null;
          obj.country = address.country || null;
          obj.near_to_city = address.near_to_city || null;
          obj.locality = address.locality || null;
          obj.locality_lat = address.locality_lat || null;
          obj.locality_lng = address.locality_lng || null;
        } else {
          obj.address = null;
          obj.addressaddition = null;
          obj.zip = null;
          obj.city = null;
          obj.country = null;
          obj.locality = null;
          obj.locality_lat = null;
          obj.locality_lng = null;
          obj.near_to_city = null;
        }
        const alternateAddress = formValue.alternateAddress;
        if (alternateAddress) {
          obj.address2 = alternateAddress.address || null;
          obj.addressaddition2 = alternateAddress.addressaddition || null;
          obj.zip2 = alternateAddress.zip || null;
          obj.city2 = alternateAddress.city || null;
          obj.country2 = alternateAddress.country || null;
          obj.near_to_city2 = alternateAddress.near_to_city || null;
          obj.locality_alternative = alternateAddress.locality || null;
        } else {
          obj.address2 = null;
          obj.addressaddition2 = null;
          obj.zip2 = null;
          obj.city2 = null;
          obj.country2 = null;
          obj.locality_alternative = null;
        }
        let state = 'open';
        if (this.detailForm.valid) {
          if ((this.isOnboarding && !(
            this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') !== -1
          ))) {
            state = 'saved';
          } else {
            state = 'submitted';
          }
        }

        let documentIds = [];
        let collectionId = undefined;

        if (formValue.documents &&
          formValue.documents.documents &&
          formValue.documents.documents.length) {
          documentIds = formValue.documents.documents.map((a: any) => a.id);
          collectionId = formValue.documents.id;
        }
        console.log(this.profile)
        if (this.profile && this.profile.id) {
          this.store.dispatch(
            new fromProfileAction.UpdateMasterData({
              profile: obj,
              id: this.profile.id,
              documentIds: documentIds,
              collectionId: collectionId,
              onboarding: this.isOnboarding,
              isValid: this.detailForm.valid,
              state: state,
              isAdmin: this.isAdmin
            })
          );
        }
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.detailForm,
          this.validationMessages
        );
        for (const key of Object.keys(this.detailForm.controls)) {
          if (this.detailForm.controls[key].invalid) {
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
  useSecondAddress(secondAddressInUse: boolean) {
    this.secondAddressInUse = secondAddressInUse;
    if (this.secondAddressInUse) {
      this.detailForm?.addControl('alternateAddress', this.fb.group({
        address: ['', [Validators.required]],
        locality: ['', [Validators.required]],
        addressaddition: ['', []],
        zip: ['', [Validators.required, zipValidator()]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
        near_to_city: ['', []],
      }));
    } else {
      this.detailForm?.removeControl('alternateAddress');
    }
  }
  next() {
    if (this.profile && this.profile.id) {
      this.store.dispatch(new fromProfileAction.GoToNext({
        id: this.profile.id,
        part: 'master',
        isOnboarding: !!this.isOnboarding,
        valid: true,
        contractTypeEnabled: false
      }));
    }
  }

  onChange(event: MatCheckboxChange) {
    const val = event.source.name;
    if(event.checked) {
      this.selectedLicenses.push(val);
    } else {
      let index = this.selectedLicenses.indexOf(val);
      this.selectedLicenses.splice(index,1);
    }
  }
}
