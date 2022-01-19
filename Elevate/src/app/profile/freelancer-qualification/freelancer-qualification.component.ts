import * as fromProfile from './../state/index';
import * as fromProfileAction from './../state/profile.actions';
import * as fromUser from './../../root-state/user-state';

import { Component, DebugElement, ElementRef, Inject, Input, LOCALE_ID, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { FormConfig } from '../../constant/forms.constant';
import { FreelancerMappingService } from '../../services/mapping-services';
import {FreelancerAssignmentVM, FreelancerVM} from '../../model/freelancer.model';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { OptionVM } from './../../model/option.model';
import { TranslateService } from '../../services/translate.service';
import { UserService } from '../../services/user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
// import { Moment } from 'moment-timezone';
import * as _moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ThrowStmt } from '@angular/compiler';
import { Moment } from 'moment';
import * as moment from 'moment';
import {Router} from "@angular/router";
import { PreviewDownloadPopupComponent } from '../../admin-freelancer/preview-download-popup/preview-download-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
// import { default as _rollupMoment,Moment } from 'moment';
// const moment = _rollupMoment || _moment;
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM/YYYY',
  },
  display: {
    dateInput: 'MMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: '[app-freelancer-qualification]',
  templateUrl: './freelancer-qualification.component.html',
  styleUrls: ['./freelancer-qualification.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class FreelancerQualificationComponent implements OnInit, OnChanges {
  @Input()
  profile: FreelancerVM | undefined;
  @Input()
  freelancerAssignment: FreelancerAssignmentVM | undefined;
  @Input()
  readonly = false;
  detailForm: FormGroup | undefined;
  validationMessages: any;
  displayMessage: any = {};
  about_me:any='';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
  };
  date = new FormControl(moment());
  isAdmin = false;

  chosenYearHandler(normalizedYear: any) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.getYear());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.getMonth());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  @ViewChild('DatePickerStart') DatePickerStart : any;
  //....
  reOpenCalendar(){
    let self = this;
       setTimeout(
           ()=>{
               self.DatePickerStart.open();
           },
           50
       );
  }

  // role: string | undefined;
  // roleId: number | undefined;

  // isOnboarding$: Observable<boolean | undefined> = of(undefined);
  isOnboarding: boolean | undefined;

  languageLK: OptionVM[] = [];

  get languages(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('languages') as FormArray)
      : undefined;
  }
  get aboutme(): FormControl | undefined {
    return this.detailForm
      ? (this.detailForm.get('about_me') as FormControl)
      : undefined;
  }
  get languagesDisplayMessage() {
    return this.displayMessage && this.displayMessage.languages
      ? this.displayMessage.languages
      : {};
  }
  get references(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('references') as FormArray)
      : undefined;
  }
  get referencesDisplayMessage() {
    return this.displayMessage && this.displayMessage.references
      ? this.displayMessage.references
      : [];
  }
  // referencesGroup(index: number): FormGroup {
  //   return this.references?.controls[index];
  // }
  deletedReferences: number[] = [];
  deletedQualifications: number[] = [];
  deletedTrainingDetails: number[] = [];
  get qualifications(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('qualifications') as FormArray)
      : undefined;
  }
  get training(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('training') as FormArray)
      : undefined;
  }
  get qualificationsDisplayMessage() {
    return this.displayMessage && this.displayMessage.qualifications
      ? this.displayMessage.qualifications
      : [];
  }
  get trainingDisplayMessage() {
    return this.displayMessage && this.displayMessage.training
      ? this.displayMessage.training
      : [];
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private store: Store<fromProfile.State>,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private el: ElementRef,
    @Inject(LOCALE_ID) protected localeId: string,
    private dialog: MatDialog,
    private freelancerMappingService: FreelancerMappingService
  ) { }
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
    this.loadLookup();
    this.isOnboarding = this.userService.user().onboarding();
    this.isAdmin = this.userService.user().role() === 'admin';
    this.initForm()
    // this.role = this.userService.user().role();
    // this.isOnboarding$ = this.userStore.pipe(select(fromUser.isOnboarding));
    // this.isOnboarding$.subscribe((res) => {
    //   this.isOnboarding = res;
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
    //     if (profile) {
    //       this.profile = profile;
    //       this.initForm();
    //     }
    //   });
  }
  patchData() {
    if (this.detailForm && this.profile) {
      this.deletedReferences = [];
      this.deletedTrainingDetails = [];
      this.deletedQualifications = [];
      this.languages?.clear();
      this.training?.clear()
      this.qualifications?.clear();
      this.references?.clear();
      this.validationMessages.languages = [];
      this.validationMessages.training = [];
      this.validationMessages.references = [];
      this.validationMessages.qualifications = [];
      const languages = (this.profile.languages ? this.profile.languages.split(',') : []);
      languages.forEach(
        (lan, index: number) => {
          this.addLanguages(lan, index === 0);
        }
      );
      if (languages.length === 0) {
        this.addLanguages('', true);
      }
      this.detailForm.controls?.resume?.patchValue(this.profile.resume);
      this.detailForm.controls.about_me.setValue(this.profile.about_me);
      // (this.profile.references
      //   ? this.profile.references.map((a) => {
      //     return {
      //       id: a.id,
      //       name: a.name,
      //       relationship: a.relationship,
      //       email: a.email,
      //       document: a.document,
      //       contact_number: a.contact_number,
      //       document_id: a.document_id,
      //       isVerification: a.isVerification,
      //     };
      //   })
      //   : []
      // ).forEach((reference) => {
      //   this.addReferences(reference);
      // });
      (this.profile.qualifications
        ? this.profile.qualifications.map((a) => {
          return {
            id: a.id,
            school_college_university: a.school_college_university,
            end_date: a.end_date,
            degree: a.degree,
            fieldofstudy: a.fieldofstudy,
            grade: a.grade,
            start_date: a.start_date,
            document_id:a.document_id,
            description: a.description,
            document: a.document,
          };
        })
        : []
      ).forEach((qua) => {
        this.addQualifications(qua);
      });
      (this.profile.trainingAndCertificates
        ? this.profile.trainingAndCertificates.map((a) => {
          return {
            id: a.id,
            name: a.name,
            issuing_organization: a.issuing_organization,
            issue_date: a.issue_date,
            description: a.description,
            document_id: a.document_id,
            document: a.document
          };
        })
        : []
      ).forEach((qua) => {
        this.addTraining(qua);
      });
      if (this.readonly) {
        this.detailForm.disable();
      }

    }
  }
  loadLookup() {
    this.languageLK = FormConfig.master.languages.map((a) => {
      return {
        text: a,
        value: a,
      };
    });
  }

  initForm() {
    this.detailForm = this.fb.group({
      about_me: this.fb.control([]),
      languages: this.fb.array([this.fb.control('', [Validators.required])]),
      references: this.fb.array([]),
      qualifications: this.fb.array([]),
      training: this.fb.array([]),
      resume: this.fb.control([]),
    });
    if (this.readonly) {
      this.detailForm.disable();
    }
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        languages: [
          {
            required: this.translateService.instant('form.errors.required'),
          },
        ],
        references: [],
        training: [
          {
            issueDate: {
              required: this.translateService.instant('form.errors.required'),
            },
          }
        ],
        qualifications: [],
      };
      this.patchData();
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

  // languages
  addLanguages(value?: string, required = false) {
    if (this.languages) {
      this.languages.push(this.getNewLanguages(value, required));
      if (required) {
        this.validationMessages.languages.push({
          required: this.translateService.instant('form.errors.required'),
        });
      }
    }
  }
  getNewLanguages(value?: string, required = false) {
    return this.fb.control(value, required ? [Validators.required] : []);
  }
  removeLanguages(i: number) {
    if (this.languages) {
      this.languages.removeAt(i);
      this.validationMessages.languages.slice(i, 1);
      this.validationMessages.languages = this.validationMessages.languages;
    }
  }

  // references
  addReferences(value?: any) {
    if (this.references) {
      this.references.push(this.getNewReferences(value));
      this.validationMessages.references.push({
        title: {
          required: this.translateService.instant('form.errors.required'),
        },
        description: {
          required: this.translateService.instant('form.errors.required'),
        }
      });
    }
  }
  getNewReferences(value?: any) {
    if (value) {
      return this.fb.group({
        id: this.fb.control(value.id, []),
        title: this.fb.control(value.title, [Validators.required]),
        company: this.fb.control(value.company, []),
        description: this.fb.control(value.description, [Validators.required]),
        document: this.fb.control(value.document, []),
      });
    } else {
      return this.fb.group({
        id: this.fb.control('', []),
        title: this.fb.control('', [Validators.required]),
        company: this.fb.control('', []),
        description: this.fb.control('', [Validators.required]),
        document: this.fb.control('', []),
      });
    }
  }
  removeReferences(i: number) {
    if (this.references) {
      const id = this.references.at(i).get('id')?.value;
      if (id) {
        this.deletedReferences.push(Number(id));
      }
      this.references.removeAt(i);
      this.validationMessages.references.slice(i, 1);
      this.validationMessages.references = this.validationMessages.references;
    }
  }

  // qualifications
  addQualifications(value?: any) {
    if (this.qualifications) {
      this.qualifications.push(this.getNewQualifications(value));
      if(this.validationMessages.qualifications == undefined)
          this.validationMessages.qualifications = [];
        this.validationMessages.qualifications.push({
          school_college_university: {
            required: this.translateService.instant('form.errors.required'),
          },
          degree: {
            required: this.translateService.instant('form.errors.required'),
          },
          grade: {
            required: this.translateService.instant('form.errors.required'),
          },
          start_date: {
            required: this.translateService.instant('form.errors.required'),
          },
          end_date: {
            required: this.translateService.instant('form.errors.required'),
          },
        });
    }
  }

  downloadDocumentResume(doc: any) {
    if (!doc.url) {
      doc.url = environment.api + '/documents/' + doc.id;
    }
    if (doc?.mime.includes('pdf')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }
    else if (doc?.mime.includes('image')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          image: doc
        },
        disableClose: true
      });
    }
    else {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }
  }

  onFormValueChange(){
    if (this.detailForm) {
      this.displayMessage = this.genericValidatorService.processMessages(
        this.detailForm,
        this.validationMessages
      );
    }
  }

    // qualifications
    addTraining(value?: any) {
      if (this.training) {
        this.training.push(this.getNewTrainingDetails(value));
        this.validationMessages.training.push({
          issue_date: {
            required: this.translateService.instant('form.errors.required'),
          },
          // achieved_at: {
          //   matDatepickerParse: this.translateService.instant('form.errors.dateformat', { format: moment.localeData(this.localeId).longDateFormat('L') }),
          // },
        });
      }
    }

  getNewQualifications(value?: any) {
    if(value){
     return this.fb.group({
        id: this.fb.control(value.id, []),
      school_college_university: this.fb.control(value.school_college_university, [Validators.required]),
      degree: this.fb.control(value.degree, [Validators.required]),
      fieldofstudy: this.fb.control(value.fieldofstudy, []),
      description: this.fb.control(value.description, []),
      start_date: this.fb.control(value.start_date, [Validators.required]),
      end_date: this.fb.control(value.end_date, [Validators.required]),
      grade: this.fb.control(value.grade, [Validators.required]),
      document_id: this.fb.control(value.document_id, []),
      document: this.fb.control(value.document, []),
    })
  }
  else{
    return this.fb.group({
      id: this.fb.control('', []),
    school_college_university: this.fb.control('', [Validators.required]),
    degree: this.fb.control('', [Validators.required]),
    fieldofstudy: this.fb.control('', []),
    grade: this.fb.control('', [Validators.required]),
    end_date:this.fb.control('',[Validators.required]),
    start_date:this.fb.control('',[Validators.required]),
    description: this.fb.control('', []),
    document_id: this.fb.control('', []),
    document: this.fb.control('', []),
  })
  }
    // if (value) {
    //   return this.fb.group({
    //     id: this.fb.control(value.id, []),
    //     name: this.fb.control(value.name, [Validators.required]),
    //     achieved_at: this.fb.control(value.achieved_at, []),
    //     description: this.fb.control(value.description, []),
    //     document: this.fb.control(value.document, []),
    //   });
    // }
    //  else {
    //   return this.fb.group({
    //     id: this.fb.control('', []),
    //     name: this.fb.control('', [Validators.required]),
    //     achieved_at: this.fb.control('', []),
    //     description: this.fb.control('', []),
    //     document: this.fb.control('', []),
    //   });
    // }
  }
  getNewTrainingDetails(value?: any) {

    if(value){
     return this.fb.group({
       id: this.fb.control(value.id, []),
        name: this.fb.control(value.name, []),
        issuing_organization: this.fb.control(value.issuing_organization, []),
        issue_date: this.fb.control(value.issue_date, []),
      description: this.fb.control(value.description, []),
      document_id: this.fb.control(value.document_id, []),
      document: this.fb.control(value.document, []),
    })
  }
  else{
    return this.fb.group({
      id: this.fb.control('', []),
      name: this.fb.control('', []),
      issuing_organization: this.fb.control('', []),
      issue_date: this.fb.control('', []),
      description: this.fb.control('', []),
      document_id: this.fb.control('', []),
      document: this.fb.control('', []),

  })
  }
  }
  removeQualifications(i: number) {
    if (this.qualifications) {
      const id = this.qualifications.at(i).get('id')?.value;
      if (id) {
        this.deletedQualifications.push(Number(id));
      }
      this.qualifications.removeAt(i);
      this.validationMessages.qualifications.slice(i, 1);
      this.validationMessages.qualifications = this.validationMessages.qualifications;
    }
  }
  removeTrainingDetails(i: number) {
    if (this.training) {
      const id = this.training.at(i).get('id')?.value;
      if (id) {
        this.deletedTrainingDetails.push(Number(id));
      }
      this.training.removeAt(i);
      this.validationMessages.training.slice(i, 1);
      this.validationMessages.training = this.validationMessages.training;
    }
  }
  cancel() {
    this.router.navigate(['approval/freelancer-approved']);
  }
  next() {
    if (this.profile && this.profile.id) {
      this.store.dispatch(new fromProfileAction.GoToNext({
        id: this.profile.id,
        part: 'qualifications',
        isOnboarding: !!this.isOnboarding,
        valid: true,
        contractTypeEnabled: false
      }));
    }
  }
  saveDetail() {
    if (this.detailForm) {
      this.training?.controls.forEach((res: any)=> {
       res.controls.document_id.setValue(res.controls?.document?.value?.id);
      })
      // document_id.setValue(this.det)
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      const onlyValidForm = !this.isOnboarding || (this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') !== -1);
      if ((onlyValidForm && this.detailForm.valid) || (!onlyValidForm)) {
        const formValue = this.detailForm.getRawValue();
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
        if (this.profile && this.profile.id) {
          const qualifications = formValue.qualifications;
          const references = formValue.references;
          const training = formValue.training;
          this.store.dispatch(
            new fromProfileAction.UpdateQualificationData({
              languages: formValue.languages
                ? formValue.languages.filter((a: string) => a && a.toString().trim().length > 0).join(',')
                : null,
              resume: formValue.resume.id,
              about_me: formValue.about_me,
              id: this.profile.id,
              training: training,
              qualifications: qualifications,
              deletedQualifications: this.deletedQualifications,
              deletedTrainings: this.deletedTrainingDetails,
              onboarding: !!this.isOnboarding,
              isValid: this.detailForm.valid,
              state: state,
              isAdmin: this.isAdmin
            })
          );
          console.log(training);
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
}
