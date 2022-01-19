import * as fromAssignment from './../state';
import * as fromAssignmentAction from './../state/assignment.actions';
import * as fromUser from './../../root-state/user-state';

import {
  AdditionalCostVM,
  JobDocumentVM,
  JobFeedbackQuestionVM,
} from '../../model/job.model';
import {
  AssignmentDocumentChangesVM,
  AssignmentVM,
} from '../../model/assignment.model';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AgentService } from '../../services/agent.service';
import { AgentVM } from '../../model/agent.model';
import { AssignmentDocumentVM } from '../../model/document.model';
import { BudgetService } from '../../services/budget.service';
import { CurrencyPipe } from '@angular/common';
import { DatesVM } from '../../model/dates.model';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { OptionVM } from '../../model/option.model';
import { Router } from '@angular/router';
import { SalesSlotVM } from '../../model/client.model';
import { TranslateService } from '../../services/translate.service';
import { currencyValidator } from '../../utility/currency.validator';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.scss'],
})
export class CreateAssignmentComponent implements OnInit {
  componentActive = true;
  dateId: any;
  budgetLK: OptionVM[] = [];
  agent: AgentVM | undefined;

  dateDetail$: Observable<DatesVM | undefined> = of(undefined);
  dateDetail: DatesVM | undefined;

  createForm?: FormGroup;
  validationMessages: any;
  displayMessage: any = {};

  templateReportDocs: JobDocumentVM[] = [];
  templateQuestionnaireDocs: JobDocumentVM[] = [];
  briefingDocs: JobDocumentVM[] = [];
  deletedDocuments: number[] = [];
  uploadedDocuments: number[] = [];

  get additional_costs(): FormArray | undefined {
    return this.createForm
      ? (this.createForm.get('additional_costs') as FormArray)
      : undefined;
  }

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private store: Store<fromAssignment.State>,
    private budgetService: BudgetService,
    private agentService: AgentService,
    private currencyPipe: CurrencyPipe,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService
  ) {
    this.dateId = this.router.getCurrentNavigation()?.extras.state?.dateId;
  }

  ngOnInit(): void {
    if (this.dateId) {
      this.store.dispatch(
        new fromAssignmentAction.LoadDatesDetail({
          id: this.dateId,
          mode: 'detail',
        })
      );
    }
    this.dateDetail$ = this.store.pipe(
      select(fromAssignment.getDatesDetail),
      takeWhile(() => this.componentActive)
    );
    this.dateDetail$.subscribe((res) => {
      this.dateDetail = res ? res : undefined;
      this.initForm();
      if (res && res.job && res.job.project && res.job.project.client_id) {
        this.loadBudget(res.job.project.client_id);
      }
      this.agentService
        .getAgents({
          limit: 10000,
          include: ['user'],
          only_fields: ['agent.id', 'agent.fullname', 'user.id', 'user.rights'],
        })
        .subscribe((a) => {
          this.agent = a.data?.find((x) => x.id === res?.job?.agent_id);
          console.log(this.agent);
        });
      this.patchDetail();
    });
  }

  initForm() {
    this.createForm = this.fb.group({
      start_time: ['', [Validators.required]],
      finish_time: ['', [Validators.required]],
      comment: ['', []],
      budget_id: ['', []],
      wage: ['', [Validators.required]],
      assignment_budget: ['', [Validators.required]],
      additional_costs: this.fb.array([]),
    });

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        start_time: {
          required: this.translateService.instant('form.errors.required'),
        },
        finish_time: {
          required: this.translateService.instant('form.errors.required'),
        },
        wage: {
          required: this.translateService.instant('form.errors.required'),
        },
        assignment_budget: {
          required: this.translateService.instant('form.errors.required'),
        },
        additional_costs: [],
      };
      if (this.createForm) {
        this.createForm.valueChanges.subscribe((value) => {
          if (this.createForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.createForm,
              this.validationMessages
            );
          }
        });
      }
    });
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

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  patchDetail() {
    if (this.createForm) {
      this.createForm.reset();
      if (this.validationMessages) {
        this.validationMessages.additional_costs = [];
      }
      if (this.dateDetail) {
        const obj = {
          start_time: this.dateDetail.start_time,
          finish_time: this.dateDetail.finish_time,
          budget_id: this.dateDetail.budget_id
            ? this.dateDetail.budget_id
            : null,
          assignment_budget: this.dateDetail.assignment_budget,
          wage: this.dateDetail.wage,
          additional_costs: this.dateDetail.job?.additional_costs
            ? this.dateDetail.job?.additional_costs.forEach((a) => {
              this.addAdditionalCost(a);
            })
            : [],
        };
        this.createForm.patchValue(obj);
      }
    }
  }

  addAdditionalCost(values?: AdditionalCostVM) {
    if (this.additional_costs) {
      this.additional_costs.push(this.getNewAdditionalCost(values));
      this.validationMessages.additional_costs.push({
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
      const obj = this.validationMessages.additional_costs;
      obj.splice(i, 1);
      this.validationMessages.additional_costs = obj;
    }
  }

  getDocuments() {
    if (
      this.dateDetail &&
      this.dateDetail.job &&
      this.dateDetail.job.documents
    ) {
      const templateReports = this.dateDetail.job.documents.filter(
        (a) => a.type === 'template-report'
      );
      if (templateReports && templateReports.length) {
        this.templateReportDocs = templateReports;
      } else {
        this.templateReportDocs = [];
      }

      const templateQuestionnaire = this.dateDetail.job.documents.filter(
        (a) => a.type === 'template-questionnaire'
      );
      if (templateQuestionnaire && templateQuestionnaire.length) {
        this.templateQuestionnaireDocs = templateQuestionnaire;
      } else {
        this.templateQuestionnaireDocs = [];
      }

      const briefingDocs = this.dateDetail.job.documents.filter(
        (a) => a.type === 'briefing'
      );
      if (briefingDocs && briefingDocs.length) {
        this.briefingDocs = briefingDocs;
      } else {
        this.briefingDocs = [];
      }
      const documents = {
        briefing: this.briefingDocs,
        'template-questionnaire': this.templateQuestionnaireDocs,
        'template-report': this.templateReportDocs,
      };

      return documents;
    } else {
      const documents = {
        briefing: [],
        'template-questionnaire': [],
        'template-report': [],
      };

      return documents;
    }
  }

  save() {
    if (this.createForm) {
      this.createForm.markAllAsTouched();
      this.createForm.markAsDirty();
      if (this.createForm.valid && this.dateDetail) {
        const formValue = this.createForm.getRawValue();
        const obj: AssignmentVM = {
          start_time: formValue.start_time,
          finish_time: formValue.finish_time,
          comment: formValue.comment,
          wage: formValue.wage,
          budget_id: formValue.budget_id,
          assignment_budget: formValue.assignment_budget,
          additional_costs: formValue.additional_costs,
          agent_id: this.dateDetail.job?.agent_id,
          appointed_at: this.dateDetail.appointed_at,
          briefing: this.dateDetail.job?.briefing,
          category: this.dateDetail.job?.category,
          categoryName: this.translateService.instant(
            'projects.inherited.fields.category.' +
              (this.dateDetail.job?.category || 'none')
          ),
          certificate_ids: this.dateDetail.certificate_ids,
          client: this.dateDetail.job?.project?.client,
          data: this.dateDetail.job?.project?.client?.custom_properties,
          date: this.dateDetail,
          date_id: this.dateDetail.id,
          description: this.dateDetail.job?.description,
          information: this.dateDetail.job?.information,
          job: this.dateDetail.job,
          state: this.translateService.instant(
            'assignments.fields.states.' + this.dateDetail.state
          ),
        };
        if (this.dateDetail.job?.freelancer_ratings) {
          obj.freelancer_ratings = [];
          this.dateDetail.job.freelancer_ratings.forEach((a: string) => {
            if (obj.freelancer_ratings) {
              obj.freelancer_ratings.push(a);
            }
          });
        }
        if (this.dateDetail.job?.saleslots) {
          obj.saleslots = [];
          this.dateDetail.job.saleslots.forEach((a: SalesSlotVM) => {
            if (obj.saleslots) {
              obj.saleslots.push({ ...a });
            }
          });
        }
        if (this.dateDetail.job?.feedback) {
          obj.feedback = [];
          this.dateDetail.job.feedback.forEach((a: JobFeedbackQuestionVM) => {
            if (obj.feedback) {
              obj.feedback.push({ ...a });
            }
          });
        }
        const documents = this.getDocuments();
        obj.documents = documents;

        console.log(obj);
        if (this.dateDetail?.job?.documents) {
          this.store.dispatch(
            new fromAssignmentAction.CreateAssignment({
              assignment: obj,
              documents: this.dateDetail.job.documents,
            })
          );
        }
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.createForm,
          this.validationMessages
        );
        for (const key of Object.keys(this.createForm.controls)) {
          if (this.createForm.controls[key].invalid) {
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

  scrollToError() {
    const invalidField = document.querySelector('.ng-invalid');
    if (invalidField) {
      invalidField.scrollIntoView({ behavior: 'smooth' });
    }
  }

  cancel() {
    this.router.navigate(['/dates']);
  }
}
