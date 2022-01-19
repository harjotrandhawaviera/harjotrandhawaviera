import * as fromProfile from './../state/index';
import * as fromProfileAction from './../state/profile.actions';
import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FreelancerAssignmentVM, FreelancerVM, RequestsVM} from '../../model/freelancer.model';
import {DatePipe} from '@angular/common';
import {DocumentVM} from '../../model/document.model';
import {FormConfig} from '../../constant/forms.constant';
import {FreelancerMappingService} from '../../services/mapping-services';
import {FreelancerService} from '../../services/freelancer.service';
import {GenericValidatorService} from '../../services/generic-validator.service';
import {OptionVM} from './../../model/option.model';
import {Router} from "@angular/router";
import {Store} from '@ngrx/store';
import {TranslateService} from '../../services/translate.service';
import {UserService} from '../../services/user.service';
import {iBanValidator} from '../../utility/iban.validator';

@Component({
  selector: '[app-freelancer-legal]',
  templateUrl: './freelancer-legal.component.html',
  styleUrls: ['./freelancer-legal.component.scss'],
})
export class FreelancerLegalComponent implements OnInit, OnChanges {
  detailForm: FormGroup | undefined;
  validationMessages: any;
  displayMessage: any = {};
  @Input()
  profile: FreelancerVM | undefined;
  @Input()
  freelancerAssignment: FreelancerAssignmentVM | undefined
  @Input()
  readonly = false;
  isOnboarding: boolean | undefined;
  nationalityLK: OptionVM[] = [];
  workPermitOriginalDoc: DocumentVM | undefined;
  workPermitCurrentDoc: DocumentVM | undefined;
  workPermitPendingDoc: DocumentVM | undefined;
  currentRequest: RequestsVM | undefined;
  bankDetailOriginalDocument: DocumentVM | undefined;
  bankDetailCurrentDocument: DocumentVM | undefined;
  bankDetailPendingDocument: DocumentVM | undefined;
  bicRequired: boolean = false;
  workPermitRequired: boolean = false;
  isBicValid: boolean = false;
  deletedLegalDocuments: number[] = [];
  deletedLegalIdentityCards: number[] = [];
  freelanceData: any = [];
  freelancerTaxCardData: any = [];
  isAdmin = false;
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,
    private freelancerService: FreelancerService,
    private userService: UserService,
    private store: Store<fromProfile.State>,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private el: ElementRef,
    private freelancerMappingService: FreelancerMappingService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.profile) {
      if (this.profile) {
        this.initForm();
      }
    }
  }
  get legalDocuments(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('legalDocuments') as FormArray)
      : undefined;
  }

  get identityDocumentsDisplayMessage() {
    return this.displayMessage && this.displayMessage.identityDocuments
      ? this.displayMessage.identityDocuments
      : [];
  }
  get identityDocuments(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('identityDocuments') as FormArray)
      : undefined;
  }
  ngOnInit(): void {
    var mainContent = document.getElementById("main-content");
    mainContent?.scrollIntoView()
    this.loadLookup();
    this.initForm();
    this.isOnboarding = this.userService.user().onboarding();
    this.isAdmin = this.userService.user().role() === 'admin';
  }
  initForm() {
    this.detailForm = this.fb.group({
      bankaccount_holder: this.fb.control('', [Validators.required]),
      iban: this.fb.control('', [Validators.required, iBanValidator()]),
      bic: this.fb.control('', []),
      tax_number: this.fb.control('', []),
      vat_tax_id: this.fb.control('', []),
      socialsecurity_number: this.fb.control('', []),
      health_insurance_type: this.fb.control('', []),
      health_insurance_id: this.fb.control('', []),
      child_tax_allowance: this.fb.control('', []),
      tax_class: this.fb.control('', []),
      tax_id: this.fb.control('', []),
      profession: this.fb.control('', []),
      bankname: this.fb.control('', [Validators.required]),
      nationality: this.fb.control('', [Validators.required]),
      documents: this.fb.control([], []),
      bankDetailsDocument: this.fb.control([], []),
      identityDocument: this.fb.control([], []),
      legalDocuments: this.fb.array([]),
      identityDocuments: this.fb.array([]),
    });
    this.detailForm.get('iban')?.valueChanges.subscribe(iban => {
      this.bicRequired = iban && iban.substring(0, 2).toLowerCase() !== FormConfig.bicNotRequired.toLowerCase();
      if (this.detailForm) {
        if (this.bicRequired) {
          this.detailForm.get('bic')?.clearValidators();
          this.detailForm.get('bic')?.setErrors(null);
          // this.detailForm.get('bic')?.setValidators([Validators.required]);
          this.detailForm.get('bic')?.markAsTouched();
        } else {
          this.detailForm.get('bic')?.clearValidators();
          this.detailForm.get('bic')?.setErrors(null);
          this.detailForm.get('bic')?.markAsTouched();
        }
      }

    });
    this.detailForm.get('nationality')?.valueChanges.subscribe(nationality => {
      this.onNationalityChange(nationality);
    });
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        bankaccount_holder: {
          required: this.translateService.instant('form.errors.required'),
        },
        iban: {
          required: this.translateService.instant('form.errors.required'),
          ibanValid: this.translateService.instant('form.errors.iban'),
        },
        bic: {
          required: this.translateService.instant('form.errors.required'),
        },
        bankname: {
          required: this.translateService.instant('form.errors.required'),
        },
        idcard_number: {
          required: this.translateService.instant('form.errors.required'),
        },
        id_number: {
          required: this.translateService.instant('form.errors.required'),
        },
          idcard_invalid_at: {
          required: this.translateService.instant('form.errors.required'),
          validatefuture: this.translateService.instant('form.errors.validatefuture'),
        },
        nationality: {
          required: this.translateService.instant('form.errors.required'),
        },
      };
      this.patchData();
      if (this.detailForm) {
        this.deletedLegalDocuments = [];
        this.legalDocuments?.clear();
        this.detailForm.valueChanges.subscribe((data) => {
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

  onInputClick(){
    if (this.detailForm) {
    this.displayMessage = this.genericValidatorService.processMessages(
      this.detailForm,
      this.validationMessages
    );
    }
  }

  private onNationalityChange(nationality: any) {
    const selectedNationality = this.nationalityLK?.find(a => a.value === nationality);
    if (this.detailForm) {
      if (selectedNationality && selectedNationality.data && selectedNationality.data.requiresWorkPermit) {
        this.workPermitRequired = true;
        this.detailForm.get('documents')?.clearValidators();
        this.detailForm.get('documents')?.setErrors(null);
        this.detailForm.get('documents')?.setValidators([Validators.required]);
        this.detailForm.get('documents')?.markAsTouched();
      } else {
        this.workPermitRequired = false;
        this.detailForm.get('documents')?.clearValidators();
        this.detailForm.get('documents')?.setErrors(null);
        this.detailForm.get('documents')?.markAsTouched();
      }
    }
  }

  onIbanChange(evt: any) {
    let bic = this.detailForm?.value.iban.substr(4, 4)
    if (bic != '' && bic.length == 4) {
      let iban = this.detailForm?.value.iban.substr(0, 2);
      let country = this.translateService.instant('profile.country.' + this.profile?.country)
      console.log(country);
      if (iban === country) {
        this.isBicValid = true;
      } else {
        this.isBicValid = false;
      }
    } else {
      this.isBicValid = false;
      this.detailForm?.controls.bic.reset();
    }
  }

  patchData() {
    if (this.detailForm && this.profile) {
      const obj = {
        bankaccount_holder: this.profile.bankaccount_holder || this.profile.fullname,
        iban: this.profile.iban,
        bic: this.profile.bic,
        bankname: this.profile.bankname,
        tax_number: this.profile.tax_number,
        vat_tax_id: this.profile.vat_tax_id,
        socialsecurity_number: this.profile.socialsecurity_number,
        health_insurance_number: this.profile.health_insurance_type,
        health_insurance_id: this.profile.health_insurance_id,
        child_tax_allowance: this.profile.child_tax_allowance,
        tax_class: this.profile.tax_class,
        tax_id: this.profile.tax_id,
        profession: this.profile.profession,
        nationality: this.profile.nationality,
        documents: [],
        licence: this.profile?.documents,
        bankDetailsDocuments: this.profile?.documents,
        legalDocuments: this.profile.legalDocuments,
        identityDocuments: this.profile.identityDocuments,
      };
      this.detailForm.patchValue(obj);
      this.identityDocuments && this.identityDocuments?.clear();
      (this.profile.identityDocuments
        ? this.profile.identityDocuments.map((a) => {
          return {
            id_name: a.id_name,
            id_number: a.id_number,
            expiry_date: a.expiry_date,
            document_id: a.document_id,
            document: a.document?.data,
            id: a.id
          };
        })
        : []
      ).forEach((identity) => {
        this.addLegalIdentityCard(identity);
      });
      if (this.profile.documents && this.profile.documents) {
        this.workPermitOriginalDoc = this.profile.documents.current['work-permit'];
        this.workPermitCurrentDoc = this.profile.documents.current['work-permit'];
      }
      if (this.profile.documents && this.profile.documents) {
        this.bankDetailOriginalDocument = this.profile.documents.current['upload-bank-photo'];
        this.bankDetailCurrentDocument = this.profile.documents.current['upload-bank-photo'];
      }
      if (this.profile.requests) {
        this.currentRequest = this.profile.requests.find(a => a.type === 'freelancer-changerequest' && a.action === 'replace-freelancer-workpermit');
        if (this.currentRequest?.params?.document_id) {
          this.freelancerService.getDocument(this.currentRequest.params.document_id).subscribe(res => {
            if (res && res.data) {
              this.workPermitPendingDoc = this.freelancerMappingService.transformDocument(res.data, true);
              this.bankDetailPendingDocument = this.freelancerMappingService.transformDocument(res.data, true);
            } else {
              this.workPermitPendingDoc = undefined;
              this.bankDetailPendingDocument = undefined;
            }
            if (this.detailForm) {
              this.detailForm.get('documents')?.patchValue({ ...this.workPermitPendingDoc });
              this.detailForm.get('bankDetailsDocument')?.patchValue({ ...this.bankDetailPendingDocument });
            }
          })
        } else {
          this.detailForm.get('documents')?.patchValue({ ...this.workPermitCurrentDoc });
          this.detailForm.get('bankDetailsDocument')?.patchValue({ ...this.bankDetailCurrentDocument });
        }
      } else {
        this.detailForm.get('documents')?.patchValue({ ...this.workPermitCurrentDoc });
        this.detailForm.get('bankDetailsDocument')?.patchValue({ ...this.bankDetailCurrentDocument });
      }
      if (this.readonly) {
        this.detailForm.disable();
      }
    }
  }
  loadLookup() {
    this.freelancerService.getCountries().subscribe((res) => {
      this.nationalityLK = res.data
        ? res.data.map((item) => {
          var idx = item.cca2
            ? FormConfig.master.nationalityOrder.indexOf(item.cca2)
            : -1;
          return {
            value: item.cca2,
            text: item.nationality || item.name,
            data: {
              requiresWorkPermit: !item.is_eu_member,
              order: (idx > -1 ? idx : 9) + (item.name || ''),
            },
          };
        })
        : [];
        this.nationalityLK.sort((a: any,b:any) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0))

      const obj = this.detailForm?.getRawValue();
      if (this.detailForm && obj.nationality) {
        this.onNationalityChange(obj.nationality);
      }
    });
  }

  addLegalDocuments(value?: any){
    if (this.legalDocuments) {
      this.legalDocuments.push(this.getNewLegendDocument(value));
    }
  }

  addLegalIdentityCard(value?: any){
    if (this.identityDocuments) {
      this.identityDocuments.push(this.getNewLegendIdentityCard(value));
      if(this.validationMessages.identityDocuments == undefined)
          this.validationMessages.identityDocuments = [];
      this.validationMessages.identityDocuments.push({
        id_name: {
          required: this.translateService.instant('form.errors.required'),
        },
        id_number: {
          required: this.translateService.instant('form.errors.required'),
        }
      });
    }
  }

  removeLegalDocument(i: number) {
    if (this.legalDocuments) {
      const id = this.legalDocuments.at(i).get('id')?.value;
      if (id) {
        this.deletedLegalDocuments.push(Number(id));
      }
      this.legalDocuments.removeAt(i);
    }
  }
  removeLegalIdentityCard(i: number) {
    if (this.identityDocuments) {
      const id = this.identityDocuments.at(i).get('id')?.value;
      if (id) {
        this.deletedLegalIdentityCards.push(Number(id));
      }
      this.identityDocuments.removeAt(i);
    }
  }
  getNewLegendDocument(value?: any) {
    if (value) {
      return this.fb.group({
        document_name: this.fb.control(value.document_name, []),
        document_number: this.fb.control(value.document_number),
        document: this.fb.control(value.document, []),
      });
    } else {
      return this.fb.group({
        document_name: this.fb.control('', []),
        document_number: this.fb.control(''),
        document: this.fb.control('', []),
      });
    }
    }

  getNewLegendIdentityCard(value?: any) {
      if (value) {
        return this.fb.group({
          id_name: this.fb.control(value.id_name, [Validators.required]),
          id_number: this.fb.control(value.id_number,[Validators.required]),
          expiry_date: this.fb.control(value.expiry_date),
          document_id: this.fb.control(value.document_id, []),
          document: this.fb.control(value.document, []),
          id: this.fb.control(value.id, []),
        });
      } else {
        return this.fb.group({
          id: this.fb.control('', []),
          document: this.fb.control('', []),
          id_name: this.fb.control('', [Validators.required]),
          id_number: this.fb.control('',[Validators.required]),
          expiry_date: this.fb.control(''),
          document_id: this.fb.control('', []),
        });
      }
      }
  cancel() {
    this.router.navigate(['approval/freelancer-approved']);
  }
  saveDetail() {
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      let formValid = this.detailForm.valid;
      const formValue = this.detailForm.getRawValue();
      let validDocument = true;
      if (this.workPermitRequired) {
        validDocument = formValue.documents &&
          formValue.documents.documents &&
          formValue.documents.documents.length > 0;
      }
      if (!validDocument) {
        formValid = false;
      }
      const onlyValidForm = this.isOnboarding || (this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') !== -1);
      if ((onlyValidForm && formValid) || (!onlyValidForm)  || this.isAdmin) {

        const obj: FreelancerVM = {};
        obj.bankaccount_holder = formValue.bankaccount_holder;
        obj.iban = formValue.iban;
        obj.bic = formValue.bic;
        obj.bankDetailsDocument = formValue.bankDetailsDocument.id;
        obj.bankname = formValue.bankname;
        formValue.identityDocuments.forEach((res: any)=> {
        let expiry_date = this.datePipe.transform(res.expiry_date, 'yyyy-MM-dd')
          res.expiry_date = expiry_date;
         })
        let identityDocuments = formValue.identityDocuments
        obj.nationality = formValue.nationality;
        let documentIds = [];
        let collectionId = undefined;
        if (formValue.documents &&
          formValue.documents.documents &&
          formValue.documents.documents.length) {
          documentIds = formValue.documents.documents.map((a: any) => a.id);
          collectionId = formValue.documents.id;
        }
        if (this.profile && this.profile.id) {
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
          obj.contract_type_ids = [];
          if(this.freelanceData.enabled) {
            obj.contract_type_ids.push(1);
          }
          obj.tax_number = this.freelanceData.freelancer?.tax_number;
          obj.vat_tax_id = this.freelanceData.freelancer?.vat_tax_id;
          obj.documents = this.freelanceData.freelancer?.licence;
          if(typeof this.freelanceData === 'object'){
            if(this.freelanceData.length && Object.keys(this.freelanceData?.freelancer?.licence).length !== 0){
              collectionId =typeof  this.freelanceData.freelancer.licence == 'object' ?  this.freelanceData.freelancer.licence?.id : this.freelanceData.freelancer.licence?.documents?.id;
            }
          }
          if(this.freelancerTaxCardData.enabled) {
            obj.contract_type_ids.push(2);
          }
          obj.socialsecurity_number = this.freelancerTaxCardData.taxCard?.socialsecurity_number;
          obj.health_insurance_number = this.freelancerTaxCardData.taxCard?.health_insurance_type;
          obj.health_insurance_id = this.freelancerTaxCardData.taxCard?.health_insurance_id;
          obj.child_tax_allowance = this.freelancerTaxCardData.taxCard?.child_tax_allowance;
          obj.tax_class = this.freelancerTaxCardData.taxCard?.tax_class;
          obj.tax_id = this.freelancerTaxCardData.taxCard?.tax_id;
          obj.profession = this.freelancerTaxCardData.taxCard?.profession;
          this.store.dispatch(
            new fromProfileAction.UpdateLegalData({
              profile: obj,
              id: this.profile.id,
              documentIds: documentIds,
              identityDocuments: identityDocuments,
              collectionId: collectionId,
              originalCollectionId: obj?.documents ? obj.documents?.id : undefined,
              onboarding: !!this.isOnboarding,
              deletedLegalDocuments: this.deletedLegalDocuments,
              deletedIdentityDocuments: this.deletedLegalIdentityCards,
              isValid: formValid,
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
        if (!validDocument) {
          this.displayMessage.documents = this.translateService.instant('form.errors.required');
        }
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
  next() {
    if (this.profile && this.profile.id) {
      this.store.dispatch(new fromProfileAction.GoToNext({
        id: this.profile.id,
        part: 'legal',
        isOnboarding: !!this.isOnboarding,
        valid: true,
        contractTypeEnabled: false
      }));
    }
  }
  freelancerValue($event: any) {
    this.freelanceData = $event;
  }
  freelancerTaxCardValue($event: any) {
    this.freelancerTaxCardData = $event;
  }
}
