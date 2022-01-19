import * as fromProfile from './../state/index';
import * as fromProfileAction from './../state/profile.actions';

import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FreelancerAssignmentVM, FreelancerVM} from '../../model/freelancer.model';

import {AssetsConfig} from './../../constant/assets.constant';
import {DocumentVM} from '../../model/document.model';
import {FormConfig} from '../../constant/forms.constant';
import {FreelancerMappingService} from '../../services/mapping-services';
import {GenericValidatorService} from '../../services/generic-validator.service';
import {MatDialog} from '@angular/material/dialog';
import {OptionVM} from '../../model/option.model';
import {PictureResponse} from '../../model/freelancer.response';
import {ReasonBoxComponent} from '../../core/reason-box/reason-box.component';
import {Router} from "@angular/router";
import {Store} from '@ngrx/store';
import {TranslateService} from '../../services/translate.service';
import {UserService} from '../../services/user.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-freelancer-appearance',
  templateUrl: './freelancer-appearance.component.html',
  styleUrls: ['./freelancer-appearance.component.scss'],
})
export class FreelancerAppearanceComponent implements OnInit, OnChanges {
  @Input()
  profile: FreelancerVM | undefined;
  @Input()
  freelancerAssignment: FreelancerAssignmentVM | undefined;
  @Input()
  readonly = false;
  detailForm: FormGroup | undefined;
  validationMessages: any;
  displayMessage: any = {};

  // role: string | undefined;
  // roleId: number | undefined;
  // isOnboarding$: Observable<boolean | undefined> = of(undefined);
  isOnboarding: boolean | undefined;

  shirtSizeLK: OptionVM[] = [];
  pantSizeLK: OptionVM[] = [];
  shoeSizeLK: OptionVM[] = [];
  bodyPlaceholder: string | undefined;
  facePlaceholder: string | undefined;
  body_picture_id: any;
  newBodyPictureId: any;
  face_picture_id: any;
  newProfilePictureId: any;
  orgPictures: any;
  isAdmin = false;
  goodPhotoExampleURL: any = environment.api + '/download-photo-example';
  shoeSizeReferenceExampleURL: any = environment.api + '/download-shoesize-example';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private store: Store<fromProfile.State>,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private genericValidatorService: GenericValidatorService,
    private el: ElementRef,
    private freelancerMappingService: FreelancerMappingService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.profile) {
      if (this.profile) {
        if (this.profile && this.profile.orgPictures) {
          this.orgPictures = { ...this.profile.orgPictures };
        }
        this.initForm();
      }
    }
  }
  ngOnInit(): void {
    let mainContent = document.getElementById('main-content');
    mainContent?.scrollIntoView();
    this.loadLookups();
    this.isOnboarding = this.userService.user().onboarding();
    this.isAdmin = this.userService.user().role() === 'admin';
    this.initForm();
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
    //     this.profile = profile;
    //     if (this.profile && this.profile.orgPictures) {
    //       this.orgPictures = { ...this.profile.orgPictures };
    //     }
    //     this.initForm();
    //   });
  }
  loadLookups() {
    this.bodyPlaceholder = AssetsConfig.profile.body.f;
    this.facePlaceholder = AssetsConfig.profile.face.f;
    this.shirtSizeLK = FormConfig.appearance.shirtsize.map((a) => {
      return {
        text: undefined,
        value: a,
      };
    });
    this.pantSizeLK = FormConfig.appearance.pantsize.map((a) => {
      return {
        text: undefined,
        value: a,
      };
    });
    this.shoeSizeLK = FormConfig.appearance.shoesize.map((a) => {
      return {
        text: undefined,
        value: a,
      };
    });
  }

  private initForm() {
    this.detailForm = this.fb.group({
      height: ['', []],
      chest: ['', [Validators.pattern('[0-9]{2,3}')]],
      waist: ['', [Validators.pattern('[0-9]{2,3}')]],
      hip: ['', [Validators.pattern('[0-9]{2,3}')]],
      shirtsize: ['', []],
      haircolor: ['', []],
      shoesize: ['', [  ]],
      pants: ['', []],
    });

    this.patchValue();
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        chest: {
          pattern: this.translateService.instant('form.errors.pattern.height'),
        },
        waist: {
          pattern: this.translateService.instant('form.errors.pattern.height'),
        },
        hip: {
          pattern: this.translateService.instant('form.errors.pattern.height'),
        },
        // height: {
        //   required: this.translateService.instant('form.errors.required'),
        //   pattern: this.translateService.instant('form.errors.pattern.height'),
        // },
        // shirtsize: {
        //   required: this.translateService.instant('form.errors.required'),
        // },
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
    if (this.readonly) {
      this.detailForm.disable();
    }
  }
  patchValue() {
    if (this.profile && this.detailForm) {
      const obj: any = {};
      obj.height = this.profile.height;
      obj.chest = this.profile.chest;
      obj.waist = this.profile.waist;
      obj.hip = this.profile.hip;
      obj.shirtsize = this.profile.shirtsize;
      obj.haircolor = this.profile.haircolor;
      obj.pants = this.profile.pants;
      obj.shoesize = this.profile.shoesize;
      this.detailForm.patchValue(obj);
    }
  }

  cancel() {
    this.router.navigate(['approval/freelancer-approved']);
  }
  appendPicIds(picIds: number[], obj: any) {
    picIds = picIds ? picIds : [];
    if (obj && picIds.indexOf(obj.id) === -1) {
      picIds = [...picIds, obj.id];
    }
    return picIds;
  }
  saveDetail() {
    console.log(this.detailForm)
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      if (!(this.orgPictures &&
        this.orgPictures.current &&
        this.orgPictures.current.profile &&
        this.orgPictures.current.profile.id)) {
        this.displayMessage.profile = this.translateService.instant('form.errors.required');
      } else {
        this.displayMessage.profile = undefined;
      }
      if (!(this.orgPictures &&
        this.orgPictures.current &&
        this.orgPictures.current.body &&
        this.orgPictures.current.body.id)) {
        this.displayMessage.body = this.translateService.instant('form.errors.required');
      } else {
        this.displayMessage.body = undefined;
      }
      let isValid = this.detailForm.valid;
      const onlyValidForm = !this.isOnboarding || (this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') !== -1);
      if ((onlyValidForm && isValid) || (!onlyValidForm)) {
        const formValue = this.detailForm.getRawValue();
        const obj: FreelancerVM = {};
        obj.height = formValue.height || null;
        obj.chest = formValue.chest || null;
        obj.waist = formValue.waist || null;
        obj.hip = formValue.hip || null;
        obj.shirtsize = formValue.shirtsize || null;
        obj.haircolor = formValue.haircolor || null;
        obj.pants = formValue.pants || null;
        obj.shoesize = formValue.shoesize || null;
        if (this.isOnboarding) {
          if (this.body_picture_id) {
            obj.body_picture_id = this.body_picture_id;
          }
          if (this.face_picture_id) {
            obj.face_picture_id = this.face_picture_id;
          }
        }
        if(this.isAdmin) {
          if (this.newBodyPictureId) {
            obj.body_picture_id = this.newBodyPictureId;
          }
          if (this.newProfilePictureId) {
            obj.face_picture_id = this.newProfilePictureId;
          }
        }
        let picIds: number[] = [];
        picIds = this.appendPicIds(picIds, this.orgPictures.original.body);
        picIds = this.appendPicIds(picIds, this.orgPictures.original.profile);
        picIds = this.appendPicIds(picIds, this.orgPictures.current.body);
        picIds = this.appendPicIds(picIds, this.orgPictures.current.profile);
        if (this.orgPictures.pending) {
          picIds = this.appendPicIds(picIds, this.orgPictures.pending.body);
          picIds = this.appendPicIds(picIds, this.orgPictures.pending.profile);
        }

        if (this.orgPictures.current.additional) {
          this.orgPictures.current.additional.forEach((pic: any) => {
            picIds = this.appendPicIds(picIds, pic);
          });
        }
        let state = 'open';
        if (isValid) {
          if ((this.isOnboarding && !(
            this.profile && this.profile.requests && this.profile.requests.findIndex(a => a.type === 'freelancer-onboarding') !== -1
          ))) {
            state = 'saved';
          } else {
            state = 'submitted';
          }
        }
        if (this.profile && this.profile.id && isValid) {
          this.store.dispatch(
            new fromProfileAction.UpdateAppearanceData({
              profile: obj,
              id: this.profile.id,
              newBodyPictureId: this.newBodyPictureId,
              newProfilePictureId: this.newProfilePictureId,
              picIds,
              onboarding: !!this.isOnboarding,
              isValid,
              state,
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

  onBodyPictureChange(pict: DocumentVM) {
    if (pict && this.profile && pict.id !== this.profile.body_picture_id) {
      if (this.isOnboarding) {
        // Can be updated immediately (onboarding not finished yet)
        this.body_picture_id = pict.id; // eslint-disable-line camelcase
      } else {
        // Has to be requested for approval first (no immediate update)
        this.newBodyPictureId = pict.id;
      }
    }
    this.orgPictures = {
      ...this.orgPictures,
      current: {
        ...this.orgPictures.current,
        body: this.freelancerMappingService.transformPicture(pict, false),
      },
    };
  }
  onProfilePictureChange(pict: PictureResponse) {
    if (pict && this.profile && pict.id !== this.profile.face_picture_id) {
      if (this.isOnboarding) {
        // Can be updated immediately (onboarding not finished yet)
        this.face_picture_id = pict.id; // eslint-disable-line camelcase
      } else {
        // Has to be requested for approval first (no immediate update)
        this.newProfilePictureId = pict.id;
      }
    }
    this.orgPictures = {
      ...this.orgPictures,
      current: {
        ...this.orgPictures.current,
        profile: this.freelancerMappingService.transformPicture(pict, false),
      },
    };
  }
  onAdditionalPictureChange(pict: PictureResponse, index: number) {
    if (pict && this.profile && pict.id !== this.profile.face_picture_id) {
      if (this.isOnboarding) {
        // Can be updated immediately (onboarding not finished yet)
        this.face_picture_id = pict.id; // eslint-disable-line camelcase
      } else {
        // Has to be requested for approval first (no immediate update)
        this.newProfilePictureId = pict.id;
      }
    }
    this.orgPictures = {
      ...this.orgPictures,
      current: {
        ...this.orgPictures.current,
        additional: [
          ...this.orgPictures.current.additional.slice(0, index),
          this.freelancerMappingService.transformPicture(pict, false),
          ...this.orgPictures.current.additional.slice(index + 1)
        ]
      },
    };
  }

  open() {
    this.dialog.open(ReasonBoxComponent, {
      width: 'auto',
      data: {
        img: this.shoeSizeReferenceExampleURL
      }
    });
  }

  photoExample() {
    this.dialog.open(ReasonBoxComponent, {
      width: 'auto',
      data: {
        img: this.goodPhotoExampleURL
      }
    });
  }

  next() {
    if (this.profile && this.profile.id) {
      this.store.dispatch(new fromProfileAction.GoToNext({
        id: this.profile.id,
        part: 'appearance',
        isOnboarding: !!this.isOnboarding,
        valid: true,
        contractTypeEnabled: false
      }));
    }
  }
}
