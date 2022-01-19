import * as fromTender from './../state';
import * as fromTenderAction from './../state/tender.actions';
import * as moment from 'moment';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdditionalCostVM, JobVM } from '../../model/job.model';
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
import { take, takeWhile } from 'rxjs/operators';

import { AgentVM } from '../../model/agent.model';
import { AssignmentDocumentVM } from '../../model/document.model';
import { AssignmentVM } from '../../model/assignment.model';
import { BudgetService } from '../../services/budget.service';
import { CurrencyPipe } from '@angular/common';
import { DatesVM } from '../../model/dates.model';
import { FormConfig } from '../../constant/forms.constant';
import { FormatConfig } from '../../constant/formats.constant';
import { FormatService } from '../../services/format.service';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { OptionVM } from '../../model/option.model';
import { SiteVM } from '../../model/site.model';
import { TenderVM } from '../../model/tender.model';
import { TranslateService } from '../../services/translate.service';
import { currencyValidator } from '../../utility/currency.validator';

@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.component.html',
  styleUrls: ['./create-tender.component.scss'],
})
export class CreateTenderComponent implements OnInit {
  componentActive = true;
  id?: string | null;
  mode?: string;

  tenderDetail$: Observable<TenderVM | undefined> = of(undefined);
  assignment$: Observable<AssignmentVM | undefined> = of(undefined);
  state: string | undefined;
  tenderId: string | undefined;
  invalidAt: string | undefined;
  assignment: AssignmentVM | undefined;
  agent: AgentVM | undefined;
  date: DatesVM | undefined;
  job: JobVM | undefined;
  site: SiteVM | undefined;
  publish_time: string;
  budgetLK: OptionVM[] = [];
  templateReportDocs: AssignmentDocumentVM[] = [];
  templateQuestionnaireDocs: AssignmentDocumentVM[] = [];
  briefingDocs: AssignmentDocumentVM[] = [];
  deletedDocuments: number[] = [];
  uploadedDocuments: number[] = [];

  createForm?: FormGroup;
  validationMessages: any;
  displayMessage: any = {};

  get additional_costs(): FormArray | undefined {
    return this.createForm
      ? (this.createForm.get('additional_costs') as FormArray)
      : undefined;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromTender.State>,
    private budgetService: BudgetService,
    private formatService: FormatService,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
    private el: ElementRef
  ) {
    this.publish_time = moment().format('HH:mm');
  }

  ngOnInit(): void {
    this.retrieveIdFromParameters();
    this.initForm();
    this.assignment$ = this.store.pipe(
      select(fromTender.getAssignmentDetail),
      takeWhile(() => this.componentActive)
    );

    this.assignment$.subscribe((res) => {
      if (res) {
        this.assignment = res;
        this.agent = res.agent;
        this.date = res.date.data;
        this.job = res.date.data.job.data;
        this.site = res.date.data.job.data.site.data;
        if (this.job && this.job.project?.data.client_id) {
          this.loadBudget(this.job.project.data.client_id);
        }
      }
      this.patchFormData();
    });
    this.state = FormConfig.tenders.initial;
  }

  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.mode = res.mode;
    });
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.loadDetail(params);
    });
  }

  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id');
      if (this.id) {
        this.store.dispatch(new fromTenderAction.LoadAssignmentDetail(this.id));
      }
    }
  }

  loadBudget(clientId: any) {
    this.translateService.get('administration.budgets').subscribe(() => {
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
                        ? a.contacts.data
                            .map((c) => {
                              this.translateService.instant(
                                'common.salutation' + c.gender
                              ) +
                                ' ' +
                                c.firstname +
                                ' ' +
                                c.lastname;
                            })
                            .join(', ')
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

  patchFormData() {
    if (this.createForm) {
      this.createForm.reset();
      if (this.validationMessages) {
        this.validationMessages.additional_costs = [];
      }
      if (this.assignment) {
        console.log(this.assignment);
        const obj = {
          start_time: this.assignment.start_time,
          finish_time: this.assignment.finish_time,
          published_at: moment().format(),
          cities: this.site?.cities || [],
          zip_min: this.site?.zip_min,
          zip_max: this.site?.zip_max,
          budget_id: this.assignment.budget_id
            ? this.assignment.budget_id
            : null,
          assignment_budget: this.assignment.assignment_budget,
          wage: this.assignment.wage,
          additional_costs: this.assignment.job?.additional_costs
            ? this.assignment.job?.additional_costs.forEach((a) => {
                this.addAdditionalCost(a);
              })
            : [],
        };
        this.createForm.patchValue(obj);
      }
    }
  }

  initForm() {
    this.createForm = this.fb.group({
      start_time: ['', [Validators.required]],
      finish_time: ['', [Validators.required]],
      published_at: ['', [Validators.required]],
      invalid_at: ['', [Validators.required]],
      invalid_time: ['', [Validators.required]],
      comment: ['', []],
      cities: ['', []],
      zip_min: ['', []],
      zip_max: ['', []],
      budget_id: [
        {
          value: '',
          disabled: this.job?.project?.client?.id ? true : false,
        },
        [],
      ],
      assignment_budget: ['', [Validators.required]],
      wage: ['', [Validators.required]],
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
        published_at: {
          required: this.translateService.instant('form.errors.required'),
        },
        publish_time: {
          required: this.translateService.instant('form.errors.required'),
        },
        invalid_at: {
          required: this.translateService.instant('form.errors.required'),
        },
        invalid_time: {
          required: this.translateService.instant('form.errors.required'),
        },
        // assignment_budget: {
        //   required: this.translateService.instant('form.errors.required'),
        // },
        wage: {
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
      this.assignment &&
      this.assignment.documents
    ) {
      const templateReports = this.assignment.documents.filter(
        (a: any) => a.type === 'template-report'
      );
      if (templateReports && templateReports.length) {
        this.templateReportDocs = templateReports;
      } else {
        this.templateReportDocs = [];
      }

      const templateQuestionnaire = this.assignment.documents.filter(
        (a: any) => a.type === 'template-questionnaire'
      );
      if (templateQuestionnaire && templateQuestionnaire.length) {
        this.templateQuestionnaireDocs = templateQuestionnaire;
      } else {
        this.templateQuestionnaireDocs = [];
      }

      const briefingDocs = this.assignment.documents.filter(
        (a: any) => a.type === 'briefing'
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
      if (this.assignment && this.createForm.valid) {
        const formValue = this.createForm.getRawValue();
        const documents = this.getDocuments();
        const obj = {
          additional_costs: formValue.additional_costs,
          address: this.site?.address,
          appointedAt: this.assignment.appointed_at,
          assignment: this.assignment,
          assignment_id: this.assignment.id,
          assignment_budget: formValue.assignment_budget,
          budget_id: formValue.budget_id,
          briefing: this.assignment.briefing,
          categoryName: this.translateService.instant('projects.inherited.fields.category.none'),
          certificate_ids: this.assignment.certificate_ids,
          cities: this.site && this.site.cities ? this.site.cities : [],
          clientName: this.job?.project?.data?.client?.data?.name,
          comment: formValue.comment,
          dailyRateMax: '',
          dailyRateMin: '',
          date: this.date,
          deletedAt: '',
          documents: documents,
          finish_time: formValue.finish_time,
          incentive_model: this.assignment.incentive_model,
          invalid_at: moment.utc(formValue.invalid_at).local().format('YYYY-MM-DD HH:MM:SS'),
          job: this.job,
          jobShortTitle: this.job?.title?.split(' | ')[0],
          jobTitle: this.job?.title,
          job_id: this.date?.job_id,
          project: this.job?.project?.data,
          projectName: this.job?.project?.data?.name,
          publishedAt: '',
          published_at: formValue.published_at
            ? moment.utc(formValue.published_at).local().format('YYYY-MM-DD HH:MM:SS')
            : moment().format('YYYY-MM-DD HH:MM:SS'),
          siteCity: this.site?.city,
          siteClientContact: this.job?.site_client_contact,
          siteName: this.site?.name,
          sitePlace: this.site && (this.site.zip + ' ' + this.site.city + ' ' + this.site.address),
          sitePostcode: this.site?.zip,
          startDateTime: moment.utc(this.assignment.appointed_at).local().format(),
          startDateTimeLabel: this.formatService.datetime(this.assignment.appointed_at),
          start_time: formValue.start_time,
          state: this.state,
          status: this.translateService.instant('tenders.tender.state.undefined'),
          wage: formValue.wage,
          zip_min: formValue.zip_min,
          zip_max: formValue.zip_max,
        };

        console.log(obj);
        if (this.assignment) {
          this.store.dispatch(
            new fromTenderAction.CreateTenders({tender: obj})
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
