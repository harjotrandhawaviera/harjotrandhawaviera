import * as fromProfile from './../state/index';
import * as fromProfileAction from './../state/profile.actions';
import * as fromUser from './../../root-state/user-state';

import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FreelancerAssignmentVM, FreelancerVM } from '../../model/freelancer.model';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';
import { CertificateMappingService } from '../../services/mapping-services/certificate-mapping.service';
import { CertificateService } from './../../services/certificate.service';
import { CertificateVM } from '../../model/certificate.model';
import { ContractTypeResponse } from '../../model/contract-type.response';
import { ContractTypesService } from '../../services/contract-types.service';
import { DocumentVM } from '../../model/document.model';
import { FormConfig } from './../../constant/forms.constant';
import { FormatConfig } from './../../constant/formats.constant';
import { FreelancerMappingService } from '../../services/mapping-services';
import { FreelancerService } from '../../services/freelancer.service';
import { GenericValidatorService } from '../../services/generic-validator.service';
import {OptionVM} from '../../model/option.model';
import { TranslateService } from '../../services/translate.service';
import { UserService } from './../../services/user.service';
import { multiDocumentRequiredValidator } from '../../utility/multi-document.validator';

@Component({
  selector: '[app-freelancer-contract-type]',
  templateUrl: './freelancer-contract-type.component.html',
  styleUrls: ['./freelancer-contract-type.component.scss']
})
export class FreelancerContractTypeComponent implements OnInit, OnChanges {
  detailForm: FormGroup | undefined;
  validationMessages: any;
  assignment: OptionVM | any;
  show = false;
  selectedDate = new Date();
  displayMessage: any = {};
  assignmentIdentifierCheck = false;
  @Output() freelancerContract = new EventEmitter();
  isActive: boolean = false;
  isActiveTaxCard: boolean = false;
  // role: string | undefined;
  // roleId: number | undefined;
  @Input()
  profile: FreelancerVM | undefined;
  @Input()
  freelancerAssignment: [] | undefined
  @Input()
  readonly = false;
  @Input()
  type: string = '';
  // isOnboarding$: Observable<boolean | undefined> = of(undefined);
  isOnboarding: boolean | undefined;
  definition: ContractTypeResponse | undefined;
  @Input()
  isShowGeneralContract = false;
  gtcDefinition: any = {};
  passed: boolean = false;
  gtcDisplayMessage: any = null;
  invalidExamResult: boolean = false;
  gtcDocs: any;
  Assignment: OptionVM | any;
  requiredDocuments = {
    evidence: false,
    licence: false,
  };
  get freelancerForm() {
    return this.detailForm ? this.detailForm.get('freelancer') : undefined;
  }
  get freelancerDisplayMessages() {
    return this.displayMessage && this.displayMessage.freelancer ? this.displayMessage.freelancer : {};
  }
  get taxCardForm() {
    return this.detailForm ? this.detailForm.get('taxCard') : undefined;
  }
  get taxCardDisplayMessages() {
    return this.displayMessage && this.displayMessage.taxCard ? this.displayMessage.taxCard : {};
  }

  data = {
    inreview: false,
    gtcreview: false,
    contract_type_ids: [] as number[],
    contract_types: [] ,
    pending: false,
    enabled: false,
    current: undefined as any,
    contractOnboarding: undefined as any
  }
  certificate: CertificateVM | undefined;

  licenceOriginalDoc: DocumentVM | undefined;
  licenceCurrentDoc: DocumentVM | undefined;
  licencePendingDoc: DocumentVM | undefined;

  evidenceOriginalDoc: DocumentVM | undefined;
  evidenceCurrentDoc: DocumentVM | undefined;
  evidencePendingDoc: DocumentVM | undefined;
  enableDisableValue: any;

  constructor(
    private fb: FormBuilder,
    private freelancerService: FreelancerService,
    private userService: UserService,
    private store: Store<fromProfile.State>,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private el: ElementRef,
    private freelancerMappingService: FreelancerMappingService,
    private route: ActivatedRoute,
    private contractTypesService: ContractTypesService,
    private certificateMappingService: CertificateMappingService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type || changes.profile) {
      if (this.type) {
        if (this.type === 'freelancer') {
          this.requiredDocuments.licence = FormConfig.legal.documents.includes('licence');
        } else {
          this.requiredDocuments.licence = false;
        }
        if (this.type === 'tax_card') {
          this.requiredDocuments.evidence = FormConfig.legal.documents.includes('evidence');
        } else {
          this.requiredDocuments.evidence = false;
        }
        this.contractTypesService.getContractTypes({ filters: [{ key: 'identifier', value: this.type }], include: ['certificate.training', 'certificate.exam'] }).subscribe(res => {
          if (res && res.data && res.data.length) {
            this.definition = res.data[0];
            if (res.data[0].certificate && res.data[0].certificate.data) {
              this.certificate = this.certificateMappingService.certificateResponseToVM(res.data[0].certificate.data);
            }
            if (this.profile && this.type) {
              this.initForm();
            }
          }
        });
      }
      if (this.profile) {
        this.data.contract_type_ids = this.profile && this.profile.contract_type_ids ? this.profile.contract_type_ids : [];
        console.log(this.data.contract_type_ids, 'this.data.contract_type_ids');
      }
      // if (this.profile && this.type && this.definition) {
      //   this.initForm();
      // }
    }
  }

  ngOnInit(): void {
    this.store.pipe(select(fromProfile.getFreelancerAssignment))
      .subscribe((freelancerAssignment) => {
        const assignmentList = freelancerAssignment?.data?.forEach((list: any) => {
          const GivenDate = new Date(list.date.data.appointed_at);
          if (GivenDate >= this.selectedDate) {
            this.assignmentIdentifierCheck = true;
          }
        });
      });
    this.isOnboarding = this.userService.user().onboarding();
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  initForm() {
    this.detailForm = this.fb.group({
      enabled: this.fb.control(this.data.enabled, []),
    });
    if (this.type === 'freelancer') {
      this.detailForm.addControl('freelancer', this.fb.group({
        vat_tax_id: this.fb.control('', []),
        tax_number: this.fb.control('', []),
        licence: this.fb.control(null, [])
      }));
    }
    if (this.type === 'tax_card') {
      this.detailForm.addControl('taxCard', this.fb.group({
        profession: this.fb.control('', []),
        evidence: this.fb.control(null, []),
        tax_id: this.fb.control('', []),
        tax_class: this.fb.control('', []),
        child_tax_allowance: this.fb.control('', []),
        denomination: this.fb.control('', []),
        socialsecurity_number: this.fb.control('', []),
        health_insurance_type: this.fb.control('', []),
        health_insurance_id: this.fb.control('', []),
      }));
    }
    this.detailForm.get('enabled')?.valueChanges.subscribe((res) => {
      this.data.enabled = res;
      this.data.contract_type_ids = res && this.definition && this.definition.id ? [this.definition.id] : [];
      if (res) {
        if (this.type === 'freelancer' && this.freelancerForm) {
          this.freelancerForm.get('tax_number')?.setValidators([Validators.required]);
          this.freelancerForm.get('licence')?.setValidators([multiDocumentRequiredValidator()]);
        }
        if (this.type === 'tax_card' && this.taxCardForm) {
          this.taxCardForm.get('profession')?.setValidators([Validators.required]);
          this.taxCardForm.get('tax_id')?.setValidators([Validators.required, Validators.pattern(FormatConfig.check.taxIdPattern)]);
          this.taxCardForm.get('tax_class')?.setValidators([Validators.required]);
          this.taxCardForm.get('child_tax_allowance')?.setValidators([Validators.required]);
          this.taxCardForm.get('socialsecurity_number')?.setValidators([Validators.required]);
          // this.taxCardForm.get('health_insurance_type')?.setValidators([Validators.required]);
          // this.taxCardForm.get('health_insurance_id')?.setValidators([Validators.required]);
        }
      } else {
        if (this.type === 'freelancer' && this.freelancerForm) {
          this.freelancerForm.get('tax_number')?.clearValidators();
          this.freelancerForm.get('tax_number')?.setErrors(null);
          this.freelancerForm.get('licence')?.clearValidators();
          this.freelancerForm.get('licence')?.setErrors(null);
        }
        if (this.type === 'tax_card' && this.taxCardForm) {
          this.taxCardForm.get('profession')?.clearValidators();
          this.taxCardForm.get('profession')?.setErrors(null);
          this.taxCardForm.get('tax_id')?.clearValidators();
          this.taxCardForm.get('tax_id')?.setErrors(null);
          this.taxCardForm.get('tax_class')?.clearValidators();
          this.taxCardForm.get('tax_class')?.setErrors(null);
          this.taxCardForm.get('child_tax_allowance')?.clearValidators();
          this.taxCardForm.get('child_tax_allowance')?.setErrors(null);
          this.taxCardForm.get('socialsecurity_number')?.clearValidators();
          this.taxCardForm.get('socialsecurity_number')?.setErrors(null);
          // this.taxCardForm.get('health_insurance_type')?.clearValidators();
          // this.taxCardForm.get('health_insurance_type')?.setErrors(null);
          // this.taxCardForm.get('health_insurance_id')?.clearValidators();
          // this.taxCardForm.get('health_insurance_id')?.setErrors(null);
        }
        this.detailForm?.clearValidators();
        this.detailForm?.setErrors(null);
      }
    });
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        freelancer: {},
        taxCard: {}
      };
      if (this.type === 'freelancer') {
        this.validationMessages.freelancer = {
          tax_number: {
            required: this.translateService.instant('form.errors.required'),
          },
          licence: {
            required: this.translateService.instant('form.errors.required'),
          }
        };
      } else if (this.type === 'tax_card') {
        this.validationMessages.taxCard = {
          profession: {
            required: this.translateService.instant('form.errors.required'),
          },
          evidence: {
            required: this.translateService.instant('form.errors.required'),
          },
          tax_id: {
            required: this.translateService.instant('form.errors.required'),
            pattern: this.translateService.instant('form.errors.pattern.taxId'),
          },
          tax_class: {
            required: this.translateService.instant('form.errors.required'),
          },
          child_tax_allowance: {
            required: this.translateService.instant('form.errors.required'),
          },
          denomination: {
            required: this.translateService.instant('form.errors.required'),
          },
          socialsecurity_number: {
            required: this.translateService.instant('form.errors.required'),
            pattern: this.translateService.instant('form.errors.pattern.socialSecurity'),
          },
          health_insurance_type: {
            required: this.translateService.instant('form.errors.required'),
          },
          health_insurance_id: {
            required: this.translateService.instant('form.errors.required'),
          },
        }
      }
      if (this.detailForm) {
        this.detailForm.valueChanges.subscribe((value) => {
          if (this.detailForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.detailForm,
              this.validationMessages
            );
          }
          this.freelancerContract.emit(value);
        });
      }
      this.patchData();
      this.enableDisableValue = {
        type: this.type,
        contractType: this.detailForm?.value?.enabled
      };
    });

  }
  patchData() {
    if (this.type === 'freelancer' && this.detailForm && this.profile && this.definition && this.definition.id
      && this.freelancerForm) {
      this.freelancerForm.get('tax_number')?.setValidators([Validators.required]);
      this.data.inreview = !!this.profile.requests?.find(a => a.params &&
        a.params.contract_type_identifier === this.definition?.identifier);
      this.data.enabled = !!this.profile.contract_type_ids?.includes(this.definition.id);
      this.data.current = this.profile.contract_types?.find(a => a.identifier === this.definition?.identifier);
      this.data.contractOnboarding = !this.data.current || (this.data.current && !this.data.current.is_approved)
      const obj = {
        enabled: this.profile.contract_type_ids?.includes(this.definition.id),
        freelancer: {
          vat_tax_id: this.profile.vat_tax_id,
          tax_number: this.profile.tax_number,
          licence: this.profile?.documents?.current['work-permit']
        }
      }
      if(Object.keys(obj.freelancer).length > 0){
        let isInvalid = true
        Object.values(obj.freelancer).forEach((item) => {
          if(item != null){
            isInvalid = false;
          }
        });
        if(!isInvalid){
          this.isActive = true;
          obj.enabled = true;
        }
        }
      this.detailForm.patchValue(obj);

      // if (this.profile.documents && this.profile.documents['trade-licence']) {
      //   const licence = this.profile.documents.find(a => a.type === 'trade-licence');
      //   if (licence) {
      //     this.licenceOriginalDoc = licence.document;
      //     this.licenceCurrentDoc = licence.document;
      //   }
      // }
      if (this.profile.documents) {
        this.licenceOriginalDoc = this.profile.documents.current['work-permit'];
        this.licenceCurrentDoc = this.profile.documents.current['work-permit'];
      }
      if ((!this.definition || (this.data.current && this.data.current.is_approved) || this.data.inreview)
        && this.assignmentIdentifierCheck) {
        this.detailForm.get('enabled')?.disable();
      } else {
        this.detailForm.get('enabled')?.enable();
      }
      this.freelancerForm.get('licence')?.patchValue({ ...this.licenceCurrentDoc });
    }
    if (this.type === 'tax_card' && this.detailForm && this.profile && this.definition && this.definition.id
      && this.taxCardForm) {
      this.data.inreview = !!this.profile.requests?.find(a => a.params &&
        a.params.contract_type_identifier === this.definition?.identifier)
      this.data.enabled = !!this.profile.contract_type_ids?.includes(this.definition.id);
      this.data.current = this.profile.contract_types?.find(a => a.identifier === this.definition?.identifier);
      const obj = {
        enabled: this.profile.contract_type_ids?.includes(this.definition.id),
        taxCard: {
          profession: this.profile.profession,
          tax_id: this.profile.tax_id,
          tax_class: this.profile.tax_class,
          child_tax_allowance: this.profile.child_tax_allowance,
          denomination: this.profile.denomination,
          socialsecurity_number: this.profile.socialsecurity_number,
          health_insurance_type: this.profile.health_insurance_number,
          health_insurance_id: this.profile.health_insurance_id,

        }
      };
      if(Object.keys(obj.taxCard).length > 0){
        let isInvalid = true
        Object.values(obj.taxCard).forEach((item) => {
          if(item != null){
            isInvalid = false;
          }
        })
        if(!isInvalid){
          this.isActiveTaxCard = true;
          obj.enabled = true
        }
      }
      this.detailForm.patchValue(obj);

      // if (this.profile.orgDocuments && this.profile.orgDocuments['evidence']) {
      //   const evidence = this.profile.documents.find(a => a.type === 'evidence');
      //   if (evidence) {
      //     this.evidenceOriginalDoc = evidence.document;
      //     this.evidenceCurrentDoc = evidence.document;
      //   }
      // }
      if (this.profile.documents && this.profile.documents['evidence']) {
        this.evidenceOriginalDoc = this.profile.documents.original['evidence'];
        this.evidenceCurrentDoc = this.profile.documents.current['evidence'];
      }
      if (!this.definition || this.data.current?.is_approved || this.data.inreview) {
        this.detailForm.get('enabled')?.disable()
      } else {
        this.detailForm.get('enabled')?.enable()
      }
      this.taxCardForm.get('evidence')?.patchValue({ ...this.evidenceCurrentDoc });
    }
    if (this.readonly && this.detailForm) {
      this.detailForm.disable();
    }
    this.data.contract_type_ids = this.profile && this.profile.contract_type_ids ? this.profile.contract_type_ids : [];
  }

  saveDetailFreelancer() {
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      let isValid = this.data.enabled ? this.detailForm.valid : true;
      this.invalidExamResult = false;
      if (this.certificate && !this.passed && this.data.enabled) {
        this.invalidExamResult = true;
        isValid = false;
      }
      this.validateGTCDoc();
      if (this.gtcDisplayMessage && this.data.enabled) {
        isValid = false;
      }
      const onlyValidForm = !this.isOnboarding || (this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') !== -1);
      if ((onlyValidForm && isValid) || (!onlyValidForm)) {
        let state = 'open';
        if (isValid) {
          state = (this.isOnboarding && this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') === -1) ? 'saved' : 'submitted';
        }
        let part = 'contract_' + this.type;
        // create change request if freelancer is already approved
        let change = {
          contract_type_identifier: !this.isOnboarding && this.data.contractOnboarding && this.definition && this.definition.identifier,
          gtc_id: (this.gtcDocs && this.gtcDocs.id) || undefined,
          update: false
        };

        const formValue = this.detailForm.getRawValue();
        const obj: FreelancerVM = {};
        obj.contract_type_ids = this.data.contract_type_ids;
        obj.vat_tax_id = formValue.freelancer.vat_tax_id || null;
        obj.tax_number = formValue.freelancer.tax_number || null;
        let documentIds: any[] = [];
        let collectionId = undefined;
        // if (formValue.freelancer.licence &&
        //   formValue.freelancer.licence.documents &&
        //   formValue.freelancer.licence.documents.length) {
        //   documentIds = formValue.freelancer.licence.documents.map((a: any) => a.id);
        //   collectionId = formValue.freelancer.licence.id;
        // }
        const documents = {
          'trade-licence': this.requiredDocuments.licence ? formValue.freelancer.licence : undefined
        }
        const hasChange = !!(!collectionId && this.licenceOriginalDoc?.id) || obj.vat_tax_id !== this.profile?.vat_tax_id ||
          obj.tax_number !== this.profile?.tax_number;
        if (this.data.current && this.data.current.is_approved === true) {
          if (hasChange && this.definition) {
            change.contract_type_identifier = this.definition.identifier;
            change.update = true;
          }
        }
        if (this.profile && this.profile.id) {
          const gtc = {};

          this.store.dispatch(
            new fromProfileAction.UpdateFreelancerContractData({
              profile: obj,
              id: this.profile.id,
              documentIds: documentIds,
              collectionId: collectionId,
              hasChange: hasChange,
              isUpdate: !!(this.profile.is_approved && hasChange),
              contract_type_identifier: this.definition?.identifier,
              documents: documents,
              gtcDocs: this.getGTCDoc(),
              change: change,
              part: part,
              state: state,
              contractTypeEnabled: this.data.contract_type_ids && this.data.contract_type_ids.length > 0,
              onboarding: !!this.isOnboarding,
              isValid: isValid
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
  cancel() {
    location.reload();
  }
  saveTaxCard() {
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      let isValid = this.data.enabled ? this.detailForm.valid : true;
      this.invalidExamResult = false;
      if (this.certificate && !this.passed && this.data.enabled) {
        this.invalidExamResult = true;
        isValid = false;
      }
      this.validateGTCDoc();
      if (this.gtcDisplayMessage && this.data.enabled) {
        isValid = false;
      }
      const onlyValidForm = !this.isOnboarding || (this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') !== -1);
      if ((onlyValidForm && isValid) || (!onlyValidForm)) {
        let state = 'open';
        let part = 'contract_' + this.type;
        if (isValid) {
          state = (this.isOnboarding && this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') === -1) ? 'saved' : 'submitted';
        }
        // create change request if freelancer is already approved
        let change = {
          contract_type_identifier: !this.isOnboarding && this.data.contractOnboarding && this.definition && this.definition.identifier,
          gtc_id: (this.gtcDocs && this.gtcDocs.id) || undefined,
          update: false
        };
        const formValue = this.detailForm.getRawValue();
        const obj: FreelancerVM = {};
        obj.contract_type_ids = this.data.contract_type_ids;
        obj.profession = formValue.taxCard.profession || null;
        obj.tax_id = formValue.taxCard.tax_id || null;
        obj.tax_class = formValue.taxCard.tax_class || null;
        obj.child_tax_allowance = formValue.taxCard.child_tax_allowance || null;
        obj.denomination = formValue.taxCard.denomination || null;
        obj.socialsecurity_number = formValue.taxCard.socialsecurity_number || null;
        obj.health_insurance_number = formValue.taxCard.health_insurance_type || null;
        obj.health_insurance_id = formValue.taxCard.health_insurance_id || null;
        let documentIds = [];
        let collectionId = undefined;
        // if (formValue.freelancer.evidence &&
        //   formValue.freelancer.evidence.documents &&
        //   formValue.freelancer.evidence.documents.length) {
        //   documentIds = formValue.freelancer.evidence.documents.map((a: any) => a.id);
        //   collectionId = formValue.freelancer.evidence.id;
        // }
        const documents = {
          evidence: this.requiredDocuments.evidence ? formValue.taxCard.evidence : undefined
        }
        const hasChange = obj.profession !== this.profile?.profession ||
          obj.tax_id !== this.profile?.tax_id ||
          obj.tax_class !== this.profile?.tax_class ||
          obj.child_tax_allowance !== this.profile?.child_tax_allowance ||
          obj.denomination !== this.profile?.denomination ||
          obj.socialsecurity_number !== this.profile?.socialsecurity_number ||
          obj.health_insurance_number !== this.profile?.health_insurance_type ||
          obj.health_insurance_id !== this.profile?.health_insurance_id;
        if (this.data.current && this.data.current.is_approved === true) {
          if (hasChange && this.definition) {
            change.contract_type_identifier = this.definition.identifier;
            change.update = true;
          }
        }
        if (this.profile && this.profile.id) {
          this.store.dispatch(
            new fromProfileAction.UpdateFreelancerContractData({
              profile: obj,
              id: this.profile.id,
              documentIds: [],
              collectionId: undefined,
              hasChange: hasChange,
              isUpdate: !!(this.profile.is_approved && hasChange),
              contract_type_identifier: this.definition?.identifier,
              documents: documents,
              gtcDocs: this.getGTCDoc(),
              change: change,
              part: part,
              state: state,
              contractTypeEnabled: this.data.contract_type_ids && this.data.contract_type_ids.length > 0,
              onboarding: !!this.isOnboarding,
              isValid: isValid
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
  gtcValidationAdd(templateId: string) {
    if (!this.gtcDisplayMessage) {
      this.gtcDisplayMessage = {};
    }
    this.gtcDisplayMessage[templateId] = this.translateService.instant('form.errors.required');
  }
  getGTCDoc() {
    const gtcToUpdate: any = {};
    if (this.gtcDefinition && this.gtcDefinition.documents) {
      this.gtcDefinition.documents.forEach((template: any) => {
        if (template.confirmation_type !== 'none') {
          if (template.confirmation_type === 'checked') {
            gtcToUpdate[template.id] = this.gtcDocs[template.id];
          } else if (template.confirmation_type === 'upload-signed') {
            gtcToUpdate[template.id] = this.gtcDocs[template.id];
          }
        }
      })
    }
    return gtcToUpdate;
  }
  validateGTCDoc() {
    this.gtcDisplayMessage = null;
    if (this.gtcDefinition && this.gtcDefinition.documents) {
      this.gtcDefinition.documents.forEach((template: any) => {
        if (template.confirmation_type !== 'none') {
          if (template.confirmation_type === 'checked') {
            if (!(this.gtcDocs && this.gtcDocs[template.id].is_checked)) {
              // invalid;
              this.gtcValidationAdd(template.id);
            }
          } else if (template.confirmation_type === 'upload-signed') {
            if (!(this.gtcDocs && this.gtcDocs[template.id]) ||
              (
                this.gtcDocs && this.gtcDocs[template.id] &&
                this.gtcDocs[template.id].freelancer_documents
                  .findIndex((x: any) => x && x.document && x.document.documents.length > 0) === -1)
            ) {
              this.gtcValidationAdd(template.id);
            }
          }
        }
      })
    }
  }
  examPassed() {
    this.passed = true;
  }
  gtcUpdated(data: any) {
    this.gtcDocs = data;
  }
  definitionUpdated(data: any) {
    this.gtcDefinition = data;
  }
  next() {
    if (this.profile && this.profile.id) {
      this.store.dispatch(new fromProfileAction.GoToNext({
        id: this.profile.id,
        part: 'contract_' + this.type,
        isOnboarding: !!this.isOnboarding,
        valid: true,
        contractTypeEnabled: this.data.contract_type_ids && this.data.contract_type_ids.length > 0
      }));
    }
  }
}
