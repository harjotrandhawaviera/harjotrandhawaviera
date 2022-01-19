import * as fromCurrentUser from './../../root-state/user-state';
import * as fromJob from './../state';
import * as fromJobAction from './../state/job.actions';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdditionalCostVM, ProjectVM, TargetBudgetVM } from '../../model/project.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  JobDocumentChangesVM,
  JobDocumentVM,
  JobFeedbackQuestionVM,
  JobVM,
} from '../../model/job.model';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { BudgetService } from '../../services/budget.service';
import { CurrencyPipe } from '@angular/common';
import { FormConfig } from '../../constant/forms.constant';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { OptionVM } from '../../model/option.model';
import { ProjectService } from '../../services/project.service';
import { SalesSlotVM, TaskInfoVM, TeamInfoVM } from '../../model/client.model';
import { TranslateService } from '../../services/translate.service';
import { currencyValidator } from '../../utility/currency.validator';
import { EditorConfig } from '../../constant/editor.constant';
import { CertificateMappingService } from '../../services/mapping-services';
import { CertificateService } from '../../services/certificate.service';
import { ContractTypesService } from '../../services/contract-types.service';

@Component({
  selector: 'app-job-update',
  templateUrl: './job-update.component.html',
  styleUrls: ['./job-update.component.scss'],
})
export class JobUpdateComponent implements OnInit {
  projectLK: OptionVM[] = [];
  budgetLK: OptionVM[] = [];
  questionTypeLK: string[] = [];

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
  contractTypeLK: OptionVM[] = [];
  mode: any;
  siteIdLength: number | undefined = undefined;
  selectedSites: number | undefined = undefined;

  templateDocs: JobDocumentVM[] | undefined | null = undefined;
  briefingDocs: JobDocumentVM[] | undefined | null = undefined;
  deletedDocuments: number[] = [];
  uploadedDocuments: number[] = [];
  certificateLK: OptionVM[] = [];
  editorConfig = EditorConfig;
  currency = "";
  projectRoles: OptionVM[] = [];
  rateTypes: OptionVM[] = [];
  teamRoles: OptionVM[] = [];
  @ViewChild('locality') locality: any;

  get generalGroup(): FormGroup | undefined {
    return this.detailForm
      ? (this.detailForm.get('general') as FormGroup)
      : undefined;
  }
  get additional_costs(): FormArray | undefined {
    return this.generalGroup
      ? (this.generalGroup.get('additional_costs') as FormArray)
      : undefined;
  }
  get freelancer_ratings(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('freelancer_ratings') as FormArray)
      : undefined;
  }
  get salesSlots(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('salesSlots') as FormArray)
      : undefined;
  }
  get questions(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('questions') as FormArray)
      : undefined;
  }
  get teamInfo(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('teamInfo') as FormArray)
      : undefined;
  }
  get taskInfo(): FormArray | undefined {
    return this.detailForm
      ? (this.detailForm.get('taskInfo') as FormArray)
      : undefined;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStore: Store<fromCurrentUser.State>,
    private translateService: TranslateService,
    private contractTypesService: ContractTypesService,
    private projectService: ProjectService,
    private budgetService: BudgetService,
    private currencyPipe: CurrencyPipe,
    private genericValidatorService: GenericValidatorService,
    private store: Store<fromJob.State>,
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private certificateMappingService: CertificateMappingService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.loadLookUp();
    this.initForm();
    this.retrieveIdFromParameters();

    this.store
      .pipe(
        select(fromJob.getJobDetail),
        takeWhile(() => this.componentActive)
      )
      .subscribe((res) => {
        this.jobDetail = res;
        if (this.jobDetail) {
          if (this.jobDetail && this.jobDetail.documents) {
            const templateReports = this.jobDetail.documents.filter(
              (a) => a.type === 'template-report'
            );
            if (templateReports && templateReports.length) {
              this.templateDocs = templateReports;
            } else {
              this.templateDocs = [];
            }
            this.briefingDocs = this.jobDetail.documents.filter(
              (a) => a.type === 'briefing'
            );
          } else {
            this.briefingDocs = [];
            this.templateDocs = [];
          }
          if (
            this.jobDetail &&
            this.jobDetail.project &&
            this.jobDetail.project.client
          ) {
            this.loadBudget(this.jobDetail.project.client_id);
          }
          this.patchJobDetail();
          if(this.jobDetail.project && this.jobDetail.project.currency) {
            this.currency = this.jobDetail.project.currency;
          }
          if(this.jobDetail.project && this.jobDetail.project.target_budget) {
            this.projectRoles = this.jobDetail.project.target_budget?.map((data: TargetBudgetVM) => {
              return {value: data.role, text: data.role_name, per_shift: data.per_shift, per_hour: data.per_hour}
            });
            this.onTeamRoleChange(null, null);
          }
        }
      });

    this.overwriteAllowed$ = this.userStore.pipe(
      select(fromCurrentUser.isAllowed, {
        permissions: AllowedActions['manage-projects'],
      }),
      takeWhile(() => this.componentActive)
    );
  }

  patchJobDetail() {
    if (this.jobDetail && this.detailForm) {
      this.detailForm.reset();
      if (this.validationMessages) {
        this.validationMessages.general.custom_properties = [];
        this.validationMessages.general.additional_costs = [];
        this.validationMessages.freelancer_ratings = [];
        this.validationMessages.salesSlots = [];
        this.validationMessages.questions = [];
      }
      const obj = {
        title: this.jobDetail.title,
        general: {
          start_time: this.jobDetail.start_time,
          finish_time: this.jobDetail.finish_time,
          start_date: this.jobDetail.start_date,
          finish_date: this.jobDetail.finish_date,
          agent_id: this.jobDetail.agent_id,
          state: this.jobDetail.id ? this.jobDetail.state : 'active',
          budget_id: this.jobDetail.budget_id,
          assignment_budget: this.jobDetail.assignment_budget,
          wage: this.jobDetail.wage,
          category: this.jobDetail.category,
          additional_costs: this.jobDetail.additional_costs,
          job_name: this.jobDetail.job_name,
          job_overview: this.jobDetail.job_overview,
          staff_id: this.jobDetail.staff_id,
          job_code: this.jobDetail.job_code
        },
        certificate_ids: this.jobDetail.certificate_ids,
        description: this.jobDetail.description,
        information: this.jobDetail.information,
        briefing: this.jobDetail.briefing,
        job_location: this.jobDetail.job_location,
        staff_briefing: this.jobDetail.staff_briefing,
        teaminfo: this.jobDetail.teaminfo,
        taskinfo: this.jobDetail.taskinfo,
        job_location_lat: this.jobDetail.job_location_lat,
        job_location_lng: this.jobDetail.job_location_lng,
        contract_type_id: this.jobDetail.contract_type_id
      };
      if (this.jobDetail.additional_costs) {
        this.jobDetail.additional_costs.forEach((a) => {
          this.addAdditionalCost(a);
        });
      }
      if (this.jobDetail.freelancer_ratings) {
        this.jobDetail.freelancer_ratings.forEach((a) => {
          this.addCriteria(a);
        });
      }
      if (this.jobDetail.saleslots) {
        this.jobDetail.saleslots.forEach((a) => {
          this.addSlot({ ...a });
        });
      }
      if (this.jobDetail.feedback) {
        this.jobDetail.feedback.forEach((a) => {
          this.addQuestion({ ...a });
        });
      }
      if (this.jobDetail.teaminfo) {
        if(this.jobDetail.teaminfo.length) {
          this.jobDetail.teaminfo.forEach((a) => {
            this.addTeamInfo({ ...a });
          });
        } else {
          this.addTeamInfo();
        }
      }
      if (this.jobDetail.taskinfo) {
        if(this.jobDetail.taskinfo.length) {
          this.jobDetail.taskinfo.forEach((a) => {
            this.addTaskInfo({ ...a });
          });
        } else {
          this.addTaskInfo();
        }

      }
      console.log('patching value');
      this.detailForm.patchValue(obj);
    }
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
              'project.staff_id',
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

    this.questionTypeLK = FormConfig.projects.feedback.map((a) => a);

    this.certificateService
      .getCertificate({
        limit: 100000,
        order_by: 'name',
        only_fields: [
          'certificate.id',
          'certificate.name',
          'certificate.is_exclusive',
          'certificate.description',
          'certificate.teaser',
        ],
        filters: [{ key: 'only_enabled', value: true }],
      })
      .subscribe((res) => {
        const certificate = this.certificateMappingService.certificateMultipleResponseToVM(
          res
        );
        this.certificateLK = this.sortOption(
          (certificate && certificate.list ? certificate.list : []).map((a) => {
            return {
              value: a.id,
              text: a.name,
              data: { is_exclusive: a.is_exclusive },
            };
          })
        );
      });

      this.rateTypes = [...FormConfig.rate_types].map((a) => {
        return {
          value: a,
          text: '',
        };
      });

      this.translateService.get('contracts').subscribe((p) => {
        this.contractTypesService.getContractTypes({}).subscribe((c) => {
          this.contractTypeLK = this.sortOption(
            c.data
              ? c.data.map((a) => {
                return {
                  value: a.id,
                  text: this.translateService.instant(
                    'contracts.identifier.' + a.identifier
                  ),
                };
              })
              : []
          );
        });
      });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  initForm() {
    this.detailForm = this.fb.group({
      title: ['', [Validators.required]],
      general: this.fb.group({
        start_time: ['', [Validators.required]],
        finish_time: ['', [Validators.required]],
        agent_id: [''],
        state: [''],
        budget_id: ['', []],
        assignment_budget: [''],
        wage: [''],
        category: [''],
        additional_costs: this.fb.array([]),
        custom_properties: this.fb.group({}),
        description: [''],
        staff_id: [''],
        job_name: [''],
        job_overview: [''],
        start_date: [''],
        finish_date: [''],
        job_code: ['', [Validators.required]]
      }),
      certificate_ids: [[], []],
      freelancer_ratings: this.fb.array([]),
      salesSlots: this.fb.array([]),
      questions: this.fb.array([]),
      description: [''],
      information: ['', []],
      briefing: ['', []],
      teamInfo: this.fb.array([]),
      taskInfo: this.fb.array([]),
      job_location: [''],
      staff_briefing: [''],
      job_location_lat: [''],
      job_location_lng: [''],
      contract_type_id: ['']
    });

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        title: {
          required: this.translateService.instant('form.errors.required'),
        },
        general: {
          start_time: {
            required: this.translateService.instant('form.errors.required'),
          },
          finish_time: {
            required: this.translateService.instant('form.errors.required'),
          },
          site_ids: {
            required: this.translateService.instant('form.errors.required'),
          },
          agent_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          state: {
            required: this.translateService.instant('form.errors.required'),
          },
          budget_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          assignment_budget: {
            required: this.translateService.instant('form.errors.required'),
          },
          wage: {
            required: this.translateService.instant('form.errors.required'),
          },
          category: {
            required: this.translateService.instant('form.errors.required'),
          },
          additional_costs: [],
          custom_properties: [],
        },
        freelancer_ratings: [],
        salesSlots: [],
        questions: [],
        description: {
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

  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.mode = res.mode;
      if (res.mode === 'edit') {
        this.route.paramMap.pipe(take(1)).subscribe((params) => {
          this.loadDetail(params);
        });
      }
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

  loadBudget(clientId: any) {
    this.translateService.get('administration.budgets').subscribe((p) => {
      this.budgetService
        .getBudgets({
          limit: 100000,
          order_by: 'name',
          order_dir: 'asc',
          include: ['contacts'],
          only_fields: [
            'budget.id',
            'budget.available',
            'budget.name',
            'contact.id',
            'contact.lastname',
            'contact.firstname',
            'client.id',
            'client.name',
          ],
          filters: [{ key: 'client_id', value: clientId }],
        })
        .subscribe((res) => {
          this.budgetLK = this.sortOption(
            res.data
              ? res.data.map((a) => {
                return {
                  value: a.id,
                  text:
                    a.name +
                    ' (' +
                    this.translateService.instant(
                      'administration.budgets.label.available'
                    ) +
                    ': ' +
                    this.currencyPipe.transform(a.available, 'EUR') +
                    ')',
                  info:
                    a.contacts && a.contacts.data && a.contacts.data.length
                      ? a.contacts.data.map((c) => c.fullname).join(', ')
                      : '-',
                };
              })
              : []
          );
        });
    });
  }

  addAdditionalCost(values?: AdditionalCostVM) {
    if (this.additional_costs) {
      this.additional_costs.push(this.getNewAdditionalCost(values));
      this.validationMessages.general.additional_costs.push({
        name: {
          required: this.translateService.instant('form.errors.required'),
        },
        value: {
          required: this.translateService.instant('form.errors.required'),
          currency: this.translateService.instant('form.errors.currencyformat'),
        },
      });
    }
  }

  getNewAdditionalCost(values?: AdditionalCostVM) {
    if (values) {
      return this.fb.group({
        name: new FormControl(values.name, [Validators.required]),
        value: new FormControl(values.value, [
          Validators.required,
          currencyValidator(),
        ]),
        description: new FormControl(values.description, []),
      });
    } else {
      return this.fb.group({
        name: new FormControl('', [Validators.required]),
        value: new FormControl('', [Validators.required, currencyValidator()]),
        description: new FormControl('', []),
      });
    }
  }

  removeAdditionalCost(i: number) {
    if (this.additional_costs) {
      this.additional_costs.removeAt(i);
      const obj = this.validationMessages.general.additional_costs;
      obj.splice(i, 1);
      this.validationMessages.general.additional_costs = obj;
    }
  }

  addCriteria(value?: string) {
    if (this.freelancer_ratings) {
      this.freelancer_ratings.push(this.getNewCriteria(value));
      this.validationMessages.freelancer_ratings.push({
        required: this.translateService.instant('form.errors.required'),
      });
    }
  }

  getNewCriteria(value?: string) {
    return new FormControl(value, [Validators.required]);
  }

  removeCriteria(i: number) {
    if (this.freelancer_ratings) {
      this.freelancer_ratings.removeAt(i);
      this.validationMessages.freelancer_ratings =
        this.validationMessages.freelancer_ratings.slice(i, 1);
    }
  }

  addSlot(values?: SalesSlotVM) {
    if (this.salesSlots) {
      this.salesSlots.push(this.getNewSlot(values));
      this.validationMessages.salesSlots.push({
        name: {
          required: this.translateService.instant('form.errors.required'),
        },
        price: {
          currency: this.translateService.instant('form.errors.currencyformat'),
        },
      });
    }
  }

  getNewSlot(values?: SalesSlotVM) {
    if (values) {
      return this.fb.group({
        name: new FormControl(values.name, [Validators.required]),
        price: new FormControl(values.price, [currencyValidator()]),
        description: new FormControl(values.description, []),
      });
    } else {
      return this.fb.group({
        name: new FormControl('', [Validators.required]),
        price: new FormControl('', [currencyValidator()]),
        description: new FormControl('', []),
      });
    }
  }

  removeSlot(i: number) {
    if (this.salesSlots) {
      this.salesSlots.removeAt(i);
      this.validationMessages.salesSlots =
        this.validationMessages.salesSlots.slice(i, 1);
    }
  }

  addTeamInfo(values?: TeamInfoVM) {
    if (this.teamInfo) {
      if(!values && this.teamInfo.length > 0) {
        const rawValues = this.teamInfo.getRawValue();
        values = rawValues[rawValues.length-1];
      }
      this.teamInfo.push(this.getNewTeam(values));
    }
  }

  getNewTeam(values?: TeamInfoVM) {
    if (values) {
      return this.fb.group({
        name: new FormControl(values.name),
        checkin_location: new FormControl(values.checkin_location),
        role: new FormControl(values.role),
        staff_count: new FormControl(values.staff_count),
        rate: new FormControl(values.rate),
        rate_type: new FormControl(values.rate_type),
        shift_name: new FormControl(values.shift_name),
        shift_start_time: new FormControl(values.shift_start_time),
        shift_end_time: new FormControl(values.shift_end_time),
        break_durtion: new FormControl(values.break_durtion),
      });
    } else {
      return this.fb.group({
        name: new FormControl(''),
        checkin_location: new FormControl(''),
        role: new FormControl(''),
        staff_count: new FormControl(''),
        rate: new FormControl(''),
        rate_type: new FormControl(''),
        shift_name: new FormControl(''),
        shift_start_time: new FormControl(''),
        shift_end_time: new FormControl(''),
        break_durtion: new FormControl(''),
      });
    }
  }

  removeTeamInfo(i: number) {
    if (this.teamInfo) {
      this.teamInfo.removeAt(i);
      this.validationMessages.teamInfo = this.validationMessages.teamInfo.slice(
        i,
        1
      );
    }
  }

  addTaskInfo(values?: TaskInfoVM) {
    if (this.taskInfo) {
      if(!values && this.taskInfo.length > 0) {
        const rawValues = this.taskInfo.getRawValue();
        values = rawValues[rawValues.length-1];
      }
      this.taskInfo.push(this.getNewTask(values));
    }
  }

  getNewTask(values?: TaskInfoVM) {
    if (values) {
      return this.fb.group({
        task_name: new FormControl(values.task_name),
        role: new FormControl(values.role),
        shift: new FormControl(values.shift),
        type: new FormControl(values.type),
        remarks: new FormControl(values.remarks),
        files: new FormControl(values.files),
      });
    } else {
      return this.fb.group({
        task_name: new FormControl(''),
        role: new FormControl(''),
        shift: new FormControl(''),
        type: new FormControl(''),
        remarks: new FormControl(''),
        files: new FormControl(''),
      });
    }
  }

  removeTaskInfo(i: number) {
    if (this.taskInfo) {
      this.taskInfo.removeAt(i);
      this.validationMessages.taskInfo = this.validationMessages.taskInfo.slice(
        i,
        1
      );
    }
  }

  addQuestion(values?: JobFeedbackQuestionVM) {
    if (this.questions) {
      this.questions.push(this.getNewQuestion(values));
      this.validationMessages?.questions.push({
        question: {
          required: this.translateService.instant('form.errors.required'),
        },
      });
    }
  }

  getNewQuestion(values?: JobFeedbackQuestionVM) {
    if (values) {
      return this.fb.group({
        question: new FormControl(values.question, [Validators.required]),
        type: new FormControl(values.type, [Validators.required]),
      });
    } else {
      return this.fb.group({
        question: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
      });
    }
  }

  removeQuestion(i: number) {
    if (this.questions) {
      this.questions.removeAt(i);
      this.validationMessages.questions =
        this.validationMessages.questions.slice(i, 1);
    }
  }

  getDocumentChanges(): JobDocumentChangesVM {
    const obj: JobDocumentChangesVM = {
      newDocuments: [],
      updatedDocuments: [],
      deletedDocuments: [],
    };
    // new documents
    if (this.templateDocs) {
      obj.newDocuments = [
        ...obj.newDocuments,
        ...this.templateDocs.filter(
          (a) => a && this.uploadedDocuments.findIndex((x) => x === a.id) !== -1
        ),
      ];
    }
    if (this.briefingDocs) {
      obj.newDocuments = [
        ...obj.newDocuments,
        ...this.briefingDocs.filter(
          (a) => a && this.uploadedDocuments.findIndex((x) => x === a.id) !== -1
        ),
      ];
    }
    // updated documents
    if (this.templateDocs) {
      obj.updatedDocuments = [
        ...obj.updatedDocuments,
        ...this.templateDocs.filter(
          (a) => a && this.uploadedDocuments.findIndex((x) => x === a.id) === -1
        ),
      ];
    }
    if (this.briefingDocs) {
      obj.updatedDocuments = [
        ...obj.updatedDocuments,
        ...this.briefingDocs.filter(
          (a) => a && this.uploadedDocuments.findIndex((x) => x === a.id) === -1
        ),
      ];
    }
    // deleted documents
    obj.deletedDocuments = this.deletedDocuments;
    return obj;
  }

  briefingUploaded(document: JobDocumentVM) {
    if (this.briefingDocs && document.id) {
      this.uploadedDocuments = [...this.uploadedDocuments, document.id];
      this.briefingDocs = [
        ...this.briefingDocs,
        { ...document, job_id: this.id, type: 'briefing' },
      ];
    }
  }

  briefingDeleted(docId: number) {
    if (this.briefingDocs) {
      // if recently uploaded just remove document
      if (this.uploadedDocuments.filter((a) => a === docId).length) {
        this.uploadedDocuments = this.uploadedDocuments.filter(
          (a) => a !== docId
        );
      } else {
        // if push document to delete document
        const existingDoc = this.briefingDocs.find(
          (a) => a && a.id && a.id === docId
        );
        if (existingDoc && existingDoc.id) {
          this.deletedDocuments = [...this.deletedDocuments, existingDoc.id];
        }
      }
      this.briefingDocs = this.briefingDocs.filter((a) => a.id !== docId);
    }
  }

  templateDocUploaded(document: JobDocumentVM) {
    if (this.templateDocs && document.id) {
      this.uploadedDocuments = [...this.uploadedDocuments, document.id];
      this.templateDocs = [
        ...this.templateDocs,
        { ...document, job_id: this.id, type: 'template-report' },
      ];
    }
  }

  templateDocDeleted(docId: number) {
    if (this.templateDocs) {
      // if recently uploaded just remove document
      if (this.uploadedDocuments.filter((a) => a === docId).length) {
        this.uploadedDocuments = this.uploadedDocuments.filter(
          (a) => a !== docId
        );
      } else {
        // if push document to delete document
        const existingDoc = this.templateDocs.find(
          (a) => a && a.id && a.id === docId
        );
        if (existingDoc && existingDoc.id) {
          this.deletedDocuments = [...this.deletedDocuments, existingDoc.id];
        }
      }
      this.templateDocs = this.templateDocs.filter((a) => a.id !== docId);
    }
  }

  saveDetail() {
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      if (this.detailForm.valid) {
        const formValue = this.detailForm.getRawValue();
        const obj: JobVM = {
          title: formValue.title,
          start_time: formValue.general.start_time,
          finish_time: formValue.general.finish_time,
          site_ids: formValue.general.site_ids,
          agent_id: formValue.general.agent_id,
          state: formValue.general.state,
          budget_id: formValue.general.budget_id,
          assignment_budget: formValue.general.assignment_budget,
          wage: formValue.general.wage,
          category: formValue.general.category,
          certificate_ids: formValue.certificate_ids,
          additional_costs: formValue.general.additional_costs,
          description: formValue.description,
          information: formValue.information,
          briefing: formValue.briefing,
          project: this.jobDetail?.project,
          project_id: this.jobDetail?.project_id,
          documents: this.jobDetail?.documents,
          agent: this.jobDetail?.agent,
          contract_type_identifier: this.jobDetail?.contract_type_identifier,
          contact_id: this.jobDetail?.contact_id,
          certificates: this.jobDetail?.certificates,
          site: this.jobDetail?.site,
          job_name : formValue.general.job_name,
          job_overview : formValue.general.job_overview,
          job_location : formValue.job_location,
          staff_briefing : formValue.staff_briefing,
          teaminfo : formValue.teaminfo,
          taskinfo : formValue.taskinfo,
          staff_id: formValue.general.staff_id,
          start_date : formValue.general.start_date,
          finish_date : formValue.general.finish_date,
          job_code: formValue.general.job_code,
          job_location_lat : formValue.job_location_lat,
          job_location_lng : formValue.job_location_lng,
          contract_type_id: formValue.contract_type_id
        };
        if (formValue.general.custom_properties) {
          obj.data = formValue.general.custom_properties;
        }
        if (formValue.freelancer_ratings) {
          obj.freelancer_ratings = [];
          formValue.freelancer_ratings.forEach((a: string) => {
            if (obj.freelancer_ratings) {
              obj.freelancer_ratings.push(a);
            }
          });
        }
        if (formValue.salesSlots) {
          obj.saleslots = [];
          formValue.salesSlots.forEach((a: SalesSlotVM) => {
            if (obj.saleslots) {
              obj.saleslots.push({ ...a });
            }
          });
        }
        if (formValue.questions) {
          obj.feedback = [];
          formValue.questions.forEach((a: JobFeedbackQuestionVM) => {
            if (obj.feedback) {
              obj.feedback.push({ ...a });
            }
          });
        }
        if (formValue.teamInfo) {
          obj.teaminfo = [];
          formValue.teamInfo.forEach((a: TeamInfoVM) => {
            if (obj.teaminfo && Object.values(a).some(v => v !== null)) {
              obj.teaminfo.push({ ...a });
            }
          });
        }
        if (formValue.taskInfo) {
          obj.taskinfo = [];
          formValue.taskInfo.forEach((a: TaskInfoVM) => {
            if (obj.taskinfo && Object.values(a).some(v => v !== null)) {
              obj.taskinfo.push({ ...a });
            }
          });
        }
        const documentChanges: JobDocumentChangesVM = this.getDocumentChanges();
        if (this.id) {
          obj.id = this.id;
          this.store.dispatch(
            new fromJobAction.UpdateJob({
              job: obj,
              newDocuments: documentChanges.newDocuments,
              updatedDocuments: documentChanges.updatedDocuments,
              deletedDocuments: documentChanges.deletedDocuments,
            })
          );
        } else {
          this.store.dispatch(
            new fromJobAction.CreateJob({
              job: obj,
              documents: [
                ...documentChanges.newDocuments,
                ...documentChanges.updatedDocuments,
              ],
              projectId: this.projectId,
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
        this.scrollToError();
      }
    }
  }

  cancelEdit() {
    if (this.id) {
      this.router.navigate(['/jobs', this.id]);
    } else {
      this.router.navigate(['/jobs']);
    }
  }

  scrollToError() {
    const invalidField = document.querySelector('.ng-invalid[formControlName]');
    if (invalidField) {
      invalidField.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onTeamRoleChange(event: any, teamInfoObj: AbstractControl | null) {
    if(teamInfoObj) {
      teamInfoObj.get('rate')?.reset();
      teamInfoObj.get('rate_type')?.reset();  
    }
    this.teamRoles = this.projectRoles.filter(pj => this.teamInfo?.value.filter((tf: any) => tf.role === pj.value).length);
  }
  onSearchChange(){
    const autocomplete = new google.maps.places.Autocomplete(this.locality.nativeElement,
      {
          types: ['geocode']  
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place: any = autocomplete.getPlace();
      this.detailForm?.controls.job_location.patchValue(place.formatted_address);
      this.detailForm?.controls.job_location_lat.patchValue(`${place.geometry.location.lat()}`);
      this.detailForm?.controls.job_location_lng.patchValue(`${place.geometry.location.lng()}`);
    });
  }

  onRateType(event: any, teamInfoObj: AbstractControl) {
    const project: any = this.projectRoles.filter(pj => pj.value === teamInfoObj.get('role')?.value);
    if(project.length && project[0][event.value]) {
      teamInfoObj.get('rate')?.patchValue(project[0][event.value]);
    }
  }
}
