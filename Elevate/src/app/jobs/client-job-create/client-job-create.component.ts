import * as fromCurrentUser from './../../root-state/user-state';
import * as fromJob from './../state';
import * as fromJobAction from './../state/job.actions';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobDocumentVM, JobVM } from '../../model/job.model';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { OptionVM } from '../../model/option.model';
import { ProjectService } from '../../services/project.service';
import { ProjectVM } from '../../model/project.model';
import { SiteService } from '../../services/site.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-client-job-create',
  templateUrl: './client-job-create.component.html',
  styleUrls: ['./client-job-create.component.scss'],
})
export class ClientJobCreateComponent implements OnInit {
  projectLK: OptionVM[] = [];
  siteList: OptionVM[] = [];

  overwriteAllowed$: Observable<boolean> = of(false);
  projectDetail: ProjectVM | undefined;
  jobDetail: JobVM | undefined;
  detailForm?: FormGroup;
  projectId: any;
  id: any;
  budgetContactNames: string | undefined;

  componentActive: boolean = true;
  validationMessages: any;
  displayMessage: any = {};
  mode: any;
  siteIdLength: number | undefined = undefined;
  selectedSites: number | undefined = undefined;
  totalSiteCount?: number;
  startTime: string = '';
  endTime: string = '';

  templateDocs: JobDocumentVM[] | undefined | null = undefined;
  briefingDocs: JobDocumentVM[] | undefined | null = undefined;
  deletedDocuments: number[] = [];
  uploadedDocuments: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStore: Store<fromCurrentUser.State>,
    private translateService: TranslateService,
    private projectService: ProjectService,
    private siteService: SiteService,
    private genericValidatorService: GenericValidatorService,
    private store: Store<fromJob.State>,
    private fb: FormBuilder,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadLookUp();
    this.loadSiteList();
    this.initForm();
    this.retrieveIdFromParameters();
    this.detailForm?.get('start_time')?.valueChanges.subscribe((res) => {
      this.startTime = res;
    });
    this.store
      .pipe(
        select(fromJob.CreatedJobs),
        takeWhile(() => this.componentActive)
      )
      .subscribe((res) => {
        this.siteIdLength = res?.length;
        this.detailForm?.get('site_ids')?.patchValue([]);
        const topContainer = document.querySelector('.container-fluid');
        topContainer?.scrollIntoView({ behavior: 'smooth' });
      });
    this.store
      .pipe(
        select(fromJob.getProject),
        takeWhile(() => this.componentActive)
      )
      .subscribe((res) => {
        if (res) {
          this.projectDetail = res;
        }
      });

    this.overwriteAllowed$ = this.userStore.pipe(
      select(fromCurrentUser.isAllowed, {
        permissions: AllowedActions['manage-projects'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.detailForm?.get('project')?.valueChanges.subscribe((res) => {
      if (res) {
        this.getProject(res);
      }
    });

    this.detailForm?.get('site_ids')?.valueChanges.subscribe((res) => {
      if (res) {
        this.selectedSites = res.length;
      }
    });
  }

  loadLookUp() {
    // Project Lookup
    this.translateService.get('projects').subscribe((p) => {
      this.translateService.get('common').subscribe((c) => {
        this.projectService
          .getProjects({
            limit: 100000,
            order_by: 'name',
            only_fields: [
              'project.id',
              'project.name',
              'project.category',
              'project.started_at',
              'project.finished_at',
              'project.client_id',
              'project.state',
            ],
            filters: [{ key: 'states', value: 'draft,active' }],
          })
          .subscribe((res) => {
            this.projectLK = this.sortOption(
              res.data
                ? res.data.map((a) => {
                    const info =
                      this.translateService.instant(
                        'projects.fields.category.' + a.category
                      ) +
                      '-' +
                      this.translateService.instant(
                        'projects.fields.state.' + a.state
                      ) +
                      (a.state === 'active'
                        ? ' ' +
                          this.translateService.instant('common.labels.since') +
                          ' ' +
                          a.started_at
                        : '') +
                      (a.state === 'closed'
                        ? ' ' +
                          this.translateService.instant('common.labels.since') +
                          ' ' +
                          a.finished_at
                        : '') +
                      (a.state === 'draft'
                        ? ' ' +
                          this.translateService.instant('common.labels.from') +
                          ' ' +
                          a.started_at
                        : '');
                    return {
                      value: a.id,
                      text: a.name,
                      data: { clientId: a.client_id },
                      info: info,
                    };
                  })
                : []
            );
          });
      });
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  loadSiteList() {
    this.siteService
      .getSites({
        limit: 1000000,
        order_by: 'name',
        only_fields: [
          'site.id',
          'site.name',
          'site.zip',
          'site.city',
          'site.address',
          'site.number',
        ],
      })
      .subscribe((res) => {
        this.siteList = res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.name + (a.number ? ' | ' + a.number : ''),
                info:
                  a.zip +
                  ' ' +
                  a.city +
                  ', ' +
                  a.address +
                  (a.country ? ', ' + a.country : ''),
              };
            })
          : [];
        this.totalSiteCount = res.meta?.count;
      });
  }

  initForm() {
    this.detailForm = this.fb.group({
      project: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      finish_time: ['', [Validators.required]],
      site_ids: [[], [Validators.required]],
    });

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        project: {
          required: this.translateService.instant('form.errors.required'),
        },
        start_time: {
          required: this.translateService.instant('form.errors.required'),
        },
        finish_time: {
          required: this.translateService.instant('form.errors.required'),
        },
        site_ids: {
          required: this.translateService.instant('form.errors.required'),
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

  getProject(res: any) {
    this.projectId = res;
    this.store.dispatch(
      new fromJobAction.LoadProjectDetail({
        id: this.projectId,
        mode: 'view',
      })
    );
  }

  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.mode = res.mode;
      this.route.paramMap.pipe(take(1)).subscribe((params) => {
        this.loadDetail(params);
      });
    });
  }

  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id');
      if (this.id) {
        this.store.dispatch(
          new fromJobAction.LoadJobDetail({
            id: this.id,
            mode: this.mode,
          })
        );
      }
    }
  }

  saveDetail() {
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      if (this.detailForm.valid) {
        const formValue = this.detailForm.getRawValue();
        const obj: JobVM = {
          start_time: formValue.start_time,
          finish_time: formValue.finish_time,
          site_ids: formValue.site_ids,
        };
        this.store.dispatch(
          new fromJobAction.CreateClientJob({
            job: obj,
            projectId: this.projectId,
          })
        );
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
        this.scrollToError();
      }
    }
  }

  cancelEdit() {
    this.router.navigate(['/jobs/client']);
  }

  scrollToError() {
    const invalidField = document.querySelector('.ng-invalid');
    if (invalidField) {
      invalidField.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
