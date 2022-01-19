import * as fromProfile from '../state/index';
import * as fromProfileAction from '../state/profile.actions';
import * as fromUser from '../../root-state/user-state';
import * as moment from 'moment-timezone';

import { Component, ElementRef, Inject, Input, LOCALE_ID, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { FormConfig } from '../../constant/forms.constant';
import { FreelancerMappingService } from '../../services/mapping-services';
import { FreelancerService } from '../../services/freelancer.service';
import {FreelancerAssignmentVM, FreelancerVM} from '../../model/freelancer.model';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { OptionVM } from '../../model/option.model';
import { TranslateService } from '../../services/translate.service';
import { UserService } from '../../services/user.service';
import {Router} from "@angular/router";

@Component({
  selector: '[app-freelancer-employment-info]',
  templateUrl: './freelancer-employment-info.component.html',
  styleUrls: ['./freelancer-employment-info.component.scss'],
})
export class FreelancerEmploymentInfoComponent implements OnInit, OnChanges {
  @Input()
  profile: FreelancerVM | undefined;
  @Input()
  freelancerAssignment: FreelancerAssignmentVM | undefined;
  @Input()
  readonly = false;
  validationMessages: any;
  detailForm: FormGroup | undefined;
  displayMessage: any = {};
  industryExposureLK: string[]= [];
  workPreferencesLK: OptionVM[] = [];
  selectedWorkPreference:any[]=[];
  useCases:any[]=[
    'Advertising agencies',
     'Autombiles',
     'Banking and Financial Services',
     'E-commerce',
     'Education',
     'Event Management',
     'Govt. & Public Utilites',
     'Healthcare',
     'Health & Beauty Products',
     'Logistics',
     'Media & Entertainment',
     'NGOs',
     'Real Estate',
     'Recuritment',
     'Restaurants & takeways',
     'Retail',
     'Technology',
     'Travel & Tourism'
  ]
  deleteWorkHistory: number[] = [];
  deletedReferences: number[] = [];
  deletedSkill: number[] = [];
  deletedSecondaryRole: number[] = [];
  isShown: boolean=false;
  skills: any = [];
  roles: any = [];
  count:any=0;
  isOnboarding: boolean | undefined;
  isAdmin = false;


    constructor(
      private translateService: TranslateService,
      private el: ElementRef,
      private router: Router,
      private store: Store<fromProfile.State>,
      private freelancerService: FreelancerService,
      private userService: UserService, private genericValidatorService: GenericValidatorService,
      private fb: FormBuilder) {
  }

  get industryExposure(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('industryExposure') as FormArray)
      : undefined;
  }

  ngOnInit(): void {
    var mainContent = document.getElementById("main-content");
    mainContent?.scrollIntoView()
    this.store
      .pipe(select(fromProfile.getProfileDetail))
      .subscribe((profile) => {
        if(profile) {
          this.profile = profile;
          this.initForm();
        }
      });
    this.store.pipe(select(fromProfile.getFreelancerAssignment))
      .subscribe((freelancerAssignment) => {
        this.freelancerAssignment = freelancerAssignment;
      })
    this.getRolesList();
    this.getSkillList();
    this.isOnboarding = this.userService.user().onboarding();
    this.isAdmin = this.userService.user().role() === 'admin';

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.profile) {
      if (this.profile) {
        this.initForm();
      }
    }
  }
  getSkillList(){
    this.freelancerService.getSkills().subscribe((res) => {
      let users =   res.data.reduce(function (r: any, a: any) {
        r[a.skillCategory.name] = r[a.skillCategory.name] || [];
        r[a.skillCategory.name].push(a);
        return r;
    }, Object.create(null));
    Object.keys(users).forEach(key => { this.skills.push({ name: key, value: users[key]})
});
    })
  }

  getRolesList(){
    this.freelancerService.getRoles().subscribe((res) => {
      this.roles = res.data;
    })
  }
  addIndustryExposure(value?: string, required = false) {
    if (this.industryExposure) {
      this.industryExposure.push(this.getNewIndustryExposure(value, required));
      // if (required) {
      //   this.validationMessages.languages.push({
      //     required: this.translateService.instant('form.errors.required'),
      //   });
      // }
    }
  }
  getNewIndustryExposure(value?: string, required = false) {
    return this.fb.group({
      name: this.fb.control(value, required ? [Validators.required] : []),
       });
    // return this.fb.control(value, required ? [Validators.required] : []);
  }
  removeIndustryExposure(i: number) {
    if (this.industryExposure) {
      this.industryExposure.removeAt(i);
      // this.validationMessages.languages.slice(i, 1);
      // this.validationMessages.languages = this.validationMessages.languages;
    }
  }

  initForm() {
    this.detailForm = this.fb.group({
      emplyeeHistory: this.fb.array([]),
      references: this.fb.array([]),
      skills: this.fb.array([]),
      work_preference: this.fb.array([]),
      secondaryRole: this.fb.array([]),
      primaryRole: this.fb.array([]),
      industryExposure: this.fb.array([]),

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
    this.loadLookup();
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
  get employmentHistory(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('emplyeeHistory') as FormArray)
      : undefined;
  }
  get employmentSkill(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('skills') as FormArray)
      : undefined;
  }
  get secondaryRole(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('secondaryRole') as FormArray)
      : undefined;
  }
  get primaryRole(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('primaryRole') as FormArray)
      : undefined;
  }
  get work_preference(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('work_preference') as FormArray)
      : undefined;
  }

  onFormValueChange(){
    if (this.detailForm) {
      this.displayMessage = this.genericValidatorService.processMessages(
        this.detailForm,
        this.validationMessages
      );
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
  removeSkill(i: number) {
    if (this.employmentSkill) {
      const id = this.employmentSkill.at(i).get('id')?.value;
      if (id) {
        this.deletedSkill.push(Number(id));
      }
      this.employmentSkill.removeAt(i);
    }
  }
  removeRole(i: number) {
    if (this.secondaryRole) {
      const id = this.secondaryRole.at(i).get('id')?.value;
      if (id) {
        this.deletedSecondaryRole.push(Number(id));
      }
      this.secondaryRole.removeAt(i);
    }
  }
  next() {
    // if (this.profile && this.profile.id) {
    //   this.store.dispatch(new fromProfileAction.GoToNext({
    //     id: this.profile.id,
    //     part: 'qualifications',
    //     isOnboarding: !!this.isOnboarding,
    //     valid: true,
    //     contractTypeEnabled: false
    //   }));
    // }
  }
  saveDetail() {
    if (this.detailForm) {
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
          const references = formValue.references;
          const emplyeeHistory = formValue.emplyeeHistory;
          const industry_exposure:any = [];
          formValue.industryExposure.forEach((res: any) => {
            industry_exposure.push(res.name)
          });
          const primary_role = formValue.primaryRole;
          const secondry_role = formValue.secondaryRole;
          let skillArr : any;
          skillArr = [];
          formValue.skills.forEach((val: any)=>{
             skillArr.push({
              "skill_id" : val.skill_id,
              "document_id" : val.document_id
             })
          })
          const skills = formValue.skills;
          const work_preference = formValue.work_preference

          references.forEach((val: any) =>{
            val.freelancer_id = this.profile?.id,
            val.document_id = val.document?.id;
          })
          emplyeeHistory.forEach((val: any) =>{
            val.freelancer_id = this.profile?.id,
            val.document_id = val.document?.id;
          })
          this.store.dispatch(
            new fromProfileAction.UpdateEmploymentData({
             id: this.profile.id,
             refernces: references,
             industry_exposure: industry_exposure,
             workHistories: emplyeeHistory,
             skills: skillArr,
             primary_role: primary_role,
             secondry_role: secondry_role,
             isValid: this.detailForm.valid,
             work_preference:work_preference,
             deletedReferences: this.deletedReferences,
             deleteWorkHistory: this.deleteWorkHistory,
             state: state,
             onboarding: !!this.isOnboarding,
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
  removeWorkHistory(i:number){
    if (this.employmentHistory) {
      const id = this.employmentHistory.at(i).get('id')?.value;
      if (id) {
        this.deleteWorkHistory.length==0 ? this.deleteWorkHistory = [Number(id)] : this.deleteWorkHistory.push(Number(id));

      }
      this.employmentHistory.removeAt(i);
    }
  }
  cancel() {
    this.router.navigate(['approval/freelancer-approved']);
  }
  patchData() {
    if (this.detailForm && this.profile) {
      this.deletedReferences = [];
      this.deletedSecondaryRole = [];
      this.deletedSkill = [];
      this.industryExposure?.clear();
      this.references?.clear();
      this.validationMessages.references = [];
      this.employmentHistory && this.employmentHistory.clear();
      this.work_preference && this.work_preference.clear();
      this.employmentSkill && this.employmentSkill.clear();
      this.primaryRole && this.primaryRole.clear();
      this.secondaryRole && this.secondaryRole.clear();
      (this.profile.references
        ? this.profile.references.map((a) => {
          return {
            id: a.id,
            name: a.name,
            relationship: a.relationship,
            email: a.email,
            contact_number: a.contact_number,
            document_id: a.document_id,
            document: a.document,
            freelancer_id: a.freelancer_id,
            isVerification: a.isVerification,
          };
        })
        : []
      ).forEach((reference) => {
        this.addReferences(reference);
      });
      (this.profile.work_preference
        ? this.profile.work_preference
        : []
      ).forEach((work_preference) => {
        this.addWork_preference(work_preference);
      });
      (this.profile.industry_exposure
        ? this.profile.industry_exposure
        : []
      ).forEach((industry_exposure) => {
        this.addIndustryExposure(industry_exposure);
      });

      (this.profile.workHistories
        ? this.profile.workHistories.map((a) => {
          return {
            id: a.id,
            job_title: a.job_title,
            company_name: a.company_name,
            is_current_company: a.is_current_company,
            start_from: a.start_from,
            till: a.till,
            document_id: a.document_id,
            document: a.document,
            freelancer_id: a.freelancer_id,
            description: a.description,
          };
        })
        : []
      ).forEach((workHistory) => {
        this.addEmployee(workHistory);
      });
      (this.profile.primary_role
        ? this.profile.primary_role.map((a) => {
          return {
            role_id: a.role_id,
            role_label: a.role_label,
            role_description: a.role_description,
          };
        })
        : []
      ).forEach((primaryRole) => {
        this.addPrimaryRole(primaryRole);
      });

      (this.profile.skills
        ? this.profile.skills.map((a,ind) => {
          let skill:any;
          if(this.profile?.skill_documents){
            this.profile?.skill_documents.forEach((val) => {
              if(val.skill_id == a.id)
              {
                skill = val;
              }
            })
          }
          return {
            skillcategory: a.skillcategory,
            skillName: a.title,
            skill_id: a.id,
            document_id: skill ? skill.document.id : undefined,
            document: skill ? skill.document : undefined,
            required_proof: a.required_proof,
            skill_category_id: a.skill_category_id,
          };
        })
        : []
      ).forEach((skill) => {
        this.addSkill(skill);
      });
      (this.profile.secondry_role
        ? this.profile.secondry_role.map((a) => {
          return {
            role_id: a.role_id,
            role_label: a.role_label,
            role_description: a.role_description,
          };
        })
        : []
      ).forEach((secondaryRole) => {
        this.addSecondaryRole(secondaryRole);
      });
      if (this.readonly) {
        this.detailForm.disable();
      }

    }
  }
  addReferences(value?: any) {
    if (this.references) {
      this.references.push(this.getNewReferences(value));
      this.validationMessages.references.push({
        name: {
          required: this.translateService.instant('form.errors.required'),
        },
        relationship: {
          required: this.translateService.instant('form.errors.required'),
        }
      });
    }
  }
loadLookup() {
    this.industryExposureLK = FormConfig.master.industryExposure
    // .map((a) => {
    //   return {
    //     text: a,
    //     value: a,
    //   };
    // });
    this.workPreferencesLK = FormConfig.master.workPreferences.map((a) => {
      return {
        text: a,
        value: a,
      };
    });
  }
  addEmployee(value?: any) {
    if (this.employmentHistory) {
      this.employmentHistory.push(this.getNewEmployee(value));
      // this.validationMessages.references.push({
      //   title: {
      //     required: this.translateService.instant('form.errors.required'),
      //   },
      //   description: {
      //     required: this.translateService.instant('form.errors.required'),
      //   }
      // });
    }
  }
  getNewEmployee(value?: any) {
    if (value) {
      return this.fb.group({
        id: this.fb.control(value.id,[]),
        job_title: this.fb.control(value.job_title,[]),
        company_name: this.fb.control(value.company_name,[]),
        is_current_company: this.fb.control(value.is_current_company,[]),
      start_from:this.fb.control(value.start_from,[]),
      till:this.fb.control(value.till,[]),
      description:this.fb.control(value.description,[]),
      document_id:this.fb.control(value.document_id,[]),
      document:this.fb.control(value.document,[]),
      // started_at:this.fb.control(value.started_at,[]),

      });
    } else {
      return this.fb.group({
        job_title: this.fb.control('',[]),
        company_name: this.fb.control('', []),
        is_current_company: this.fb.control('',[]),
        start_from:this.fb.control('',[]),
        till:this.fb.control('',[]),
        description:this.fb.control('',[]),
        document_id:this.fb.control('',[]),
        document:this.fb.control('',[])
      });
    }
  }

  addSkill(value?:any){
    if (this.employmentSkill) {
      this.employmentSkill.push(this.getNewSkill(value));
    }
  }

  addRole(value?:any){
    if (this.secondaryRole && this.primaryRole) {
      if(this.count==0){
        this.secondaryRole.push(this.getNewRole(value));
        this.primaryRole.push(this.getNewRole(value));
      }else{
        this.secondaryRole.push(this.getNewRole(value));
      }
      this.count++;
    }
  }

  addPrimaryRole(value?:any){
    if(this.primaryRole)
    {
      this.count++;
      this.primaryRole.push(this.getNewRole(value));
    }
  }
  addSecondaryRole(value?:any){
    if(this.secondaryRole)
    {
      this.count++;
      this.secondaryRole.push(this.getNewRole(value));
    }
  }
  getNewRole(value?:any){
    if (value) {
      return this.fb.group({
        role_id: this.fb.control(value.role_id, []),
        role_label: this.fb.control(value.role_label, []),
        role_description:this.fb.control(value.role_description,[])

      });
    } else {
      return this.fb.group({
        role_id: this.fb.control('', []),
        role_label: this.fb.control('', []),
        role_description:this.fb.control('',[])
      });
    }

  }
  getNewSkill(value?:any){
    if (value) {
      return this.fb.group({
        required_proof: this.fb.control(value.required_proof, []),
        skill_category_id: this.fb.control(value.skill_category_id, []),
        skillcategory: this.fb.control(value.skillcategory, []),
        skillName:this.fb.control(value.skillName,[]),
        skill_id: this.fb.control(value.skill_id,[]),
        document_id: this.fb.control(value.document_id,[]),
        document: this.fb.control(value.document,[])
      });
    } else {
      return this.fb.group({
        skill_category_id: this.fb.control('', []),
        skillcategory: this.fb.control('', []),
        skillName:this.fb.control('',[]),
        skill_id: this.fb.control('',[]),
        document_id: this.fb.control('',[]),
        document: this.fb.control('',[])
      });
    }

  }
  getNewReferences(value?: any) {
    if (value) {
      return this.fb.group({
        id: this.fb.control(value.id, []),
        name: this.fb.control(value.name, [Validators.required]),
        relationship: this.fb.control(value.relationship, [Validators.required]),
        email: this.fb.control(value.email, []),
        contact_number: this.fb.control(value.contact_number,[]),
        document_id: this.fb.control(value.document_id,[]),
        isVerification: this.fb.control(value.isVerification, []),
        document:this.fb.control(value.document,[]),

      });
    } else {
      return this.fb.group({
        name: this.fb.control('', [Validators.required]),
        relationship: this.fb.control('', [Validators.required]),
        email: this.fb.control('',[]),
        contact_number: this.fb.control('', []),
        document_id: this.fb.control('', []),
        isVerification: this.fb.control('', []),
        document:this.fb.control('', []),

      });
    }
  }

  isCheckedWorkPreferences(val: any){
    let count = 0;
    this.work_preference?.value.forEach((res: any) => {
      if(res == val){
        count++;
      }
    })
    if(count==1){
      return true
    }
    else{
      return false
    }
  }

  addWork_preference(value?:any){
    if (this.work_preference) {
      this.work_preference.push(this.getNewWork_preference(value));
    }
  }

  getNewWork_preference(value: any){
       return this.fb.control(value ,[]);
  }
  checkCheckBoxvalue($event:any){
if(this.work_preference){
    if($event.checked==true){
      // this.work_preference.push($event.source.value)
      this.work_preference.push(this.getNewWork_preference($event.source.value));

    }
    else{
     let index=this.work_preference.controls.indexOf($event.source.value);
     this.work_preference.removeAt(index)
    }
    //
    if(($event.source.value=="Other" && $event.checked==true)){
      this.isShown=true
    }
    if(($event.source.value=="Other" && $event.checked==false)){
      this.isShown=false
    }
  }}
}
