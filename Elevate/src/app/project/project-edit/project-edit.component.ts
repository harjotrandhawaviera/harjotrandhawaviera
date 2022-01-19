import * as fromProject from './../state';
import * as fromProjectAction from './../state/project.actions';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AdditionalCostVM,
  ProjectDocumentChangesVM,
  ProjectDocumentVM,
  ProjectFeedbackQuestionVM,
  TargetBudgetVM,
} from './../../model/project.model';
import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { FormConfig } from './../../constant/forms.constant';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { ProjectVM } from '../../model/project.model';
import {ClientVM, SalesSlotVM} from '../../model/client.model';
import { TranslateService } from './../../services/translate.service';
import { currencyValidator } from '../../utility/currency.validator';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  id: any;
  copyId: any;
  detailForm?: FormGroup;
  validationMessages: any;
  displayMessage: any = {};
  mode: any;
  componentActive: boolean = true;
  projectDetail: ProjectVM | undefined;
  questionTypeLK: string[] = [];
  customProperties: any;
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
  get target_budget(): FormArray | undefined {
    return this.generalGroup
      ? (this.generalGroup.get('target_budget') as FormArray)
      : undefined;
  }
  // document: ProjectDocumentVM | undefined | null = undefined;
  templateDocs: ProjectDocumentVM[] | undefined | null = undefined;
  briefingDocs: ProjectDocumentVM[] | undefined | null = undefined;
  deletedDocuments: number[] = [];
  uploadedDocuments: number[] = [];
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

  // get freelancer_ratings() {
  //   return this.detailForm ? this.detailForm.get('freelancer_ratings') as FormArray : undefined;
  // }

  // get salesSlots(): FormArray | undefined {
  //   return this.detailForm ? this.detailForm.get('salesSlots') as FormArray : undefined;
  // }
  backToJob: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private store: Store<fromProject.State>,
    private fb: FormBuilder,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new fromProjectAction.ClearProject());
    this.questionTypeLK = FormConfig.projects.feedback.map((a) => a);
    this.initForm();
    this.retrieveIdFromParameters();
    this.store
      .pipe(
        select(fromProject.getProjectDetail),
        takeWhile(() => this.componentActive)
      )
      .subscribe((res) => {
        this.projectDetail = res;
        if (this.projectDetail && this.projectDetail.documents) {
          const templateReports = this.projectDetail.documents.filter(
            (a) => a.type === 'template-report'
          );
          if (templateReports && templateReports.length) {
            this.templateDocs = templateReports;
          } else {
            this.templateDocs = [];
          }
          this.briefingDocs = this.projectDetail.documents.filter(
            (a) => a.type === 'briefing'
          );
        } else {
          this.briefingDocs = [];
          this.templateDocs = [];
        }
        this.patchProjectDetail();
      });
      this.backToJob = this.route.snapshot.paramMap.get('backToJob');
  }
  patchProjectDetail() {
    if (this.projectDetail && this.detailForm) {
      this.detailForm.reset();
      if (this.validationMessages) {
        this.validationMessages.general.custom_properties = [];
        this.validationMessages.general.additional_costs = [];
        this.validationMessages.general.target_budget = [];
        this.validationMessages.freelancer_ratings = [];
        this.validationMessages.salesSlots = [];
        this.validationMessages.questions = [];
      }
      const obj = {
        general: {
          name: this.projectDetail.name,
          agent_id: this.projectDetail.agent_id,
          state: this.projectDetail.id ? this.projectDetail.state : 'active',
          contract_type_id: this.projectDetail.contract_type_id,
          started_at: this.projectDetail.started_at,
          finished_at: this.projectDetail.finished_at,
          category: this.projectDetail.category,
          client_id: this.projectDetail.client_id,
          contact_id: this.projectDetail.contact_id,
          order_id: this.projectDetail.order_id,
          budget_id: this.projectDetail.budget_id,
          assignment_budget: this.projectDetail.assignment_budget,
          wage: this.projectDetail.wage,
          description: this.projectDetail.description,
          information: this.projectDetail.information,
          briefing: this.projectDetail.briefing,
          certificate_ids: this.projectDetail.certificate_ids,
          custom_properties: this.projectDetail.data ? this.projectDetail.data : {},
          staff_id: this.projectDetail.staff_id,
          po_no: this.projectDetail.po_no,
          po_amount: this.projectDetail.po_amount,
          po_date: this.projectDetail.po_date,
          po_comment: this.projectDetail.po_comment,
          primary_address: this.projectDetail.primary_address,
          primary_country: this.projectDetail.primary_country,
          primary_state: this.projectDetail.primary_state,
          primary_city: this.projectDetail.primary_city,
          primary_zip: this.projectDetail.primary_zip,
          site_address: this.projectDetail.site_address,
          site_country: this.projectDetail.site_country,
          site_state: this.projectDetail.site_state,
          site_city: this.projectDetail.site_city,
          site_zip: this.projectDetail.site_zip,
          global_brand_id: this.projectDetail.global_brand_id,
          currency: this.projectDetail.currency ? this.projectDetail.currency : '',
          po_currency: this.projectDetail.po_currency ? this.projectDetail.po_currency : '',
          skills_required: this.projectDetail.skills_required,
          target_budget: this.projectDetail.target_budget
        },
      };
      if(this.projectDetail.skills_required && this.projectDetail.skills_required.data) {
        obj.general.skills_required = this.projectDetail.skills_required.data.map((d: any) => `${d.id}`);
      }
      this.customProperties = this.projectDetail.data ? this.projectDetail.data : {}
      for (const key in this.customProperties) {
        if (Object.prototype.hasOwnProperty.call(this.customProperties, key)) {
          const element = this.customProperties[key];
          (this.generalGroup?.get('custom_properties') as FormGroup).addControl(key, this.fb.control(element, []))
        }
      }
      if (this.projectDetail.additional_costs) {
        this.projectDetail.additional_costs.forEach((a) => {
          this.addAdditionalCost(a);
        });
      }
      if (this.projectDetail.target_budget) {
        this.target_budget?.clear();
        this.projectDetail.target_budget.forEach((a) => {
          this.addAdditionalTargetBudget(a);
        });
      }
      if (this.projectDetail.freelancer_ratings) {
        this.projectDetail.freelancer_ratings.forEach((a) => {
          this.addCriteria(a);
        });
      }
      if (this.projectDetail.saleslots) {
        this.projectDetail.saleslots.forEach((a) => {
          this.addSlot({ ...a });
        });
      }
      if (this.projectDetail.feedback) {
        this.projectDetail.feedback.forEach((a) => {
          this.addQuestion({ ...a });
        });
      }
      if (this.id && this.generalGroup) {
        this.generalGroup.get('state')?.disable();
        this.generalGroup.get('contract_type_id')?.disable();
        this.generalGroup.get('client_id')?.disable();
      } else if (this.generalGroup) {
        this.generalGroup.get('state')?.disable();
      }
      this.detailForm.patchValue(obj);
    }
  }
  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.mode = res.mode;
      if (res.mode === 'edit' || res.mode === 'copy') {
        this.route.paramMap.pipe(take(1)).subscribe((params) => {
          this.loadDetail(params);
        });
      } else {
        this.store.dispatch(new fromProjectAction.NewProjectDetail());
      }
    });
  }
  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      if (this.mode === 'edit') {
        this.id = params.get('id');
        if (this.id) {
          this.store.dispatch(
            new fromProjectAction.LoadProjectDetail({ id: this.id, mode: this.mode })
          );
        }
      }
      if (this.mode === 'copy') {
        this.copyId = params.get('id');
        if (this.copyId) {
          this.store.dispatch(
            new fromProjectAction.LoadProjectDetail({ id: this.copyId, mode: this.mode })
          );
        }
      }
    }
  }
  initForm() {
    this.detailForm = this.fb.group({
      general: this.fb.group({
        name: ['', [Validators.required]],
        agent_id: ['', [Validators.required]],
        state: ['', [Validators.required]],
        contract_type_id: [''],
        started_at: [''],
        finished_at: ['', []],
        category: [''],
        client_id: ['', [Validators.required]],
        contact_id: ['', [Validators.required]],
        order_id: ['', []],
        budget_id: ['', []],
        assignment_budget: [''],
        wage: [''],
        additional_costs: this.fb.array([]),
        description: ['', [Validators.required]],
        information: ['', []],
        briefing: ['', []],
        certificate_ids: [[], []],
        update_associated: [false, []],
        custom_properties: this.fb.group({}),
        target_budget: this.fb.array([]),
        staff_id: ['', [Validators.required]],
        po_no: [''],
        po_amount: [''],
        po_date: [''],
        po_comment: [''],
        primary_address: [''],
        primary_country: [''],
        primary_state: [''],
        primary_city: [''],
        primary_zip: [''],
        site_address: [''],
        site_country: [''],
        site_state: [''],
        site_city: [''],
        site_zip: [''],
        global_brand_id: [''],
        currency: ['', [Validators.required]],
        po_currency: ['', [Validators.required]],
        skills_required: [[]]
      }),
      freelancer_ratings: this.fb.array([]),
      salesSlots: this.fb.array([]),
      questions: this.fb.array([]),
    });

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        general: {
          name: {
            required: this.translateService.instant('form.errors.required'),
          },
          agent_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          staff_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          contract_type_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          currency: {
            required: this.translateService.instant('form.errors.required'),
          },
          po_currency: {
            required: this.translateService.instant('form.errors.required'),
          },
          started_at: {
            required: this.translateService.instant('form.errors.required'),
          },
          category: {
            required: this.translateService.instant('form.errors.required'),
          },
          client_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          contact_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          order_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          budget_id: {
            required: this.translateService.instant('form.errors.required'),
          },
          assignment_budget: {
            required: this.translateService.instant('form.errors.required'),
            currency: this.translateService.instant(
              'form.errors.currencyformat'
            ),
          },
          wage: {
            required: this.translateService.instant('form.errors.required'),
            currency: this.translateService.instant(
              'form.errors.currencyformat'
            ),
          },
          description: {
            required: this.translateService.instant('form.errors.required'),
          },
          custom_properties: [],
          additional_costs: [],
          target_budget: []
        },
        freelancer_ratings: [],
        salesSlots: [],
        questions: [],
      };
      this.addAdditionalTargetBudget();
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
  saveDetail() {
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      const hasDocument = this.templateDocs && this.templateDocs.length > 0;
      if (this.detailForm.valid) {
        const formValue = this.detailForm.getRawValue();
        const obj: ProjectVM = {
          name: formValue.general.name,
          agent_id: formValue.general.agent_id,
          state: formValue.general.state,
          contract_type_id: formValue.general.contract_type_id,
          started_at: formValue.general.started_at,
          finished_at: formValue.general.finished_at,
          category: formValue.general.category,
          client_id: formValue.general.client_id,
          contact_id: formValue.general.contact_id,
          order_id: formValue.general.order_id,
          budget_id: formValue.general.budget_id,
          assignment_budget: formValue.general.assignment_budget,
          wage: formValue.general.wage,
          additional_costs: formValue.general.additional_costs,
          description: formValue.general.description,
          information: formValue.general.information,
          briefing: formValue.general.briefing,
          certificate_ids: formValue.general.certificate_ids,
          update_associated: formValue.general.update_associated,
          target_budget: formValue.general.target_budget,
          staff_id: formValue.general.staff_id,
          po_no: formValue.general.po_no,
          po_amount: formValue.general.po_amount,
          po_date: formValue.general.po_date,
          po_comment: formValue.general.po_comment,
          primary_address: formValue.general.primary_address,
          primary_country: formValue.general.primary_country,
          primary_state: formValue.general.primary_state,
          primary_city: formValue.general.primary_city,
          primary_zip: formValue.general.primary_zip,
          site_address: formValue.general.site_address,
          site_country: formValue.general.site_country,
          site_state: formValue.general.site_state,
          site_city: formValue.general.site_city,
          site_zip: formValue.general.site_zip,
          global_brand_id: formValue.general.global_brand_id,
          currency: formValue.general.currency,
          po_currency: formValue.general.po_currency,
          skills_required: formValue.general.skills_required
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
          formValue.questions.forEach((a: ProjectFeedbackQuestionVM) => {
            if (obj.feedback) {
              obj.feedback.push({ ...a });
            }
          });
        }
        const documentChanges: ProjectDocumentChangesVM = this.getDocumentChanges();
        if (this.id) {
          obj.id = this.id;
          this.store.dispatch(
            new fromProjectAction.UpdateProject({
              project: obj,
              newDocuments: documentChanges.newDocuments,
              updatedDocuments: documentChanges.updatedDocuments,
              deletedDocuments: documentChanges.deletedDocuments,
            })
          );
        } else {
          this.store.dispatch(
            new fromProjectAction.CreateProject({
              project: obj,
              newDocuments: documentChanges.newDocuments,
            })
          );
        }
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.detailForm,
          this.validationMessages
        );
        if (!hasDocument) {
          this.setTemplateDocError();
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
  private setTemplateDocError() {
    if (this.displayMessage) {
      if (!this.displayMessage.general) {
        this.displayMessage.general = {};
      }
      this.displayMessage.general.templateDocuments = this.translateService.instant('form.errors.required');
      this.displayMessage = this.displayMessage;
    }

  }
  private clearTemplateDocError() {
    if (this.displayMessage) {
      if (this.displayMessage.general) {
        delete this.displayMessage.general.templateDocuments;
      }
      this.displayMessage = this.displayMessage;
    }
  }

  getDocumentChanges(): ProjectDocumentChangesVM {
    const obj: ProjectDocumentChangesVM = {
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
  cancelEdit() {
    if (this.id) {
      this.router.navigate(['/projects', this.id]);
    } else {
      this.router.navigate(['/projects']);
    }
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
          currency: this.translateService.instant(
            'form.errors.currencyformat'
          ),
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

  addAdditionalTargetBudget(values?: TargetBudgetVM) {
    if (this.target_budget) {
      if(!values && this.target_budget.length > 0) {
        const rawValues = this.target_budget.getRawValue();
        values = rawValues[rawValues.length-1];
      }
      this.target_budget.push(this.getNewTargetBudget(values));
    }
  }
  getNewTargetBudget(values?: TargetBudgetVM) {
    if (values) {
      return this.fb.group({
        role: new FormControl(values.role),
        total: new FormControl(values.total, [
          currencyValidator(),
        ]),
        per_hour: new FormControl(values.per_hour, [
          currencyValidator(),
        ]),
        per_shift: new FormControl(values.per_shift, [
          currencyValidator(),
        ])
      });
    } else {
      return this.fb.group({
        role: new FormControl(''),
        total: new FormControl('', [currencyValidator()]),
        per_hour: new FormControl('', [currencyValidator()]),
        per_shift: new FormControl('', [currencyValidator()]),
      });
    }
  }
  removeTargetBudget(i: number) {
    if (this.target_budget) {
      this.target_budget.removeAt(i);
      const obj = this.validationMessages.general.target_budget;
      obj.splice(i, 1);
      this.validationMessages.general.target_budget = obj;
    }
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  briefingUploaded(document: ProjectDocumentVM) {
    if (this.briefingDocs && document.id) {
      this.uploadedDocuments = [...this.uploadedDocuments, document.id];
      this.briefingDocs = [
        ...this.briefingDocs,
        { ...document, project_id: this.id, type: 'briefing' },
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

  templateDocUploaded(document: ProjectDocumentVM) {
    if (this.templateDocs && document.id) {
      this.uploadedDocuments = [...this.uploadedDocuments, document.id];
      this.templateDocs = [
        ...this.templateDocs,
        { ...document, project_id: this.id, type: 'template-report' },
      ];
      this.clearTemplateDocError();
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
      if (this.templateDocs.length === 0) {
        this.setTemplateDocError();
      } else {
        this.clearTemplateDocError();
      }
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
      this.validationMessages.freelancer_ratings = this.validationMessages.freelancer_ratings.slice(
        i,
        1
      );
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
          currency: this.translateService.instant(
            'form.errors.currencyformat'
          ),
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
      this.validationMessages.salesSlots = this.validationMessages.salesSlots.slice(
        i,
        1
      );
    }
  }

  addQuestion(values?: ProjectFeedbackQuestionVM) {
    if (this.questions) {
      this.questions.push(this.getNewQuestion(values));
      this.validationMessages.questions.push({
        question: {
          required: this.translateService.instant('form.errors.required'),
        },
      });
    }
  }
  getNewQuestion(values?: ProjectFeedbackQuestionVM) {
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
      this.validationMessages.questions = this.validationMessages.questions.slice(
        i,
        1
      );
    }
  }
  clientFreelancerRatings(freelancerRating: string[]) {
    if (!this.freelancer_ratings?.controls.length) {
      freelancerRating.forEach((a) => {
        this.addCriteria(a);
      });
    }
  }
  clientSalesSlot(saleSlots: SalesSlotVM[]) {
    if (!this.salesSlots?.controls.length) {
      saleSlots.forEach((a) => {
        this.addSlot(a);
      });
    }
  }

  gotoJobs() {
    const link = this.id ? `/projects/${this.id}/jobs` : '/jobs/create';
    this.router.navigate([link]);
  }
}
