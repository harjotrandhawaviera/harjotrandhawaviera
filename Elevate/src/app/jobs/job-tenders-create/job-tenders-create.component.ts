/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */

import * as fromCurrentUser from './../../root-state/user-state';
import * as fromJob from './../state';
import * as fromJobAction from './../state/job.actions';
import * as moment from 'moment';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AdditionalCostVM,
  JobFeedbackQuestionVM,
  JobVM,
} from '../../model/job.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatCalendar,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';
import { Observable, empty, of } from 'rxjs';
import { SalesSlotVM, TaskInfoVM, TeamInfoVM } from '../../model/client.model';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { BudgetService } from '../../services/budget.service';
import { BudgetVM } from '../../model/budget.model';
import { CertificateService } from '../../services/certificate.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FormConfig } from '../../constant/forms.constant';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { SkillService } from '../../services/skill.service';
import { TenderRequestVM } from '../../model/tender.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { currencyValidator } from '../../utility/currency.validator';

@Component({
  selector: 'app-job-tenders-create',
  templateUrl: './job-tenders-create.component.html',
  styleUrls: ['./job-tenders-create.component.scss'],
})
export class JobTendersCreateComponent implements OnInit {
  @ViewChild(MatCalendar) dateCalendar?: MatCalendar<Date>;
  componentActive = true;
  id?: string | null;

  jobDetail$: Observable<JobVM | undefined> = of(undefined);
  budgetDetail$: Observable<BudgetVM | undefined> = of(undefined);
  salesSlot$: Observable<SalesSlotVM[] | undefined> = of(undefined);
  feedback$: Observable<JobFeedbackQuestionVM[] | undefined> = of(undefined);
  jobDetail: JobVM | undefined;
  budgetContactNames: string | undefined;

  date: any;
  minDate?: any;
  maxDate?: any;
  selectedDates: any[] = [];
  selectedDatesCount = 0;
  budgetLK: OptionVM[] = [];
  publish_time: string;
  budgetExceeded = false;
  validateDatesField = false;
  datesLength = 0;
  mode?: string;
  genderLK: OptionVM[] = [];
  radiusLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  certificateLK: OptionVM[] = [];
  skillsLK: OptionVM[] = [];

  editForm?: FormGroup;
  validationMessages: any;
  displayMessage: any = {};
  teamInfo$: Observable<TeamInfoVM[] | undefined> = of(undefined);
  taskInfo$: Observable<TaskInfoVM[] | undefined> = of(undefined);

  get additional_costs(): FormArray | undefined {
    return this.editForm
      ? (this.editForm.get('additional_costs') as FormArray)
      : undefined;
  }

  get maxValidDate() {
    return this.selectedDates && this.selectedDates.length ? this.selectedDates[this.selectedDates.length-1] : this.minDate;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<fromJob.State>,
    private currencyPipe: CurrencyPipe,
    private contractTypesService: ContractTypesService,
    private skillsService: SkillService,
    private budgetService: BudgetService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private certificateService: CertificateService,
    private fb: FormBuilder,
    private el: ElementRef,
    private datePipe: DatePipe
  ) {
    this.publish_time = moment().format('HH:mm');
  }

  ngOnInit(): void {
    this.retrieveIdFromParameters();
    this.initForm();
    this.store
      .pipe(
        select(fromJob.CreatedJobTenders),
        takeWhile(() => this.componentActive)
      )
      .subscribe((res) => {
        if (res) {
          this.datesLength = res.length;
          this.validateDatesField = false;
          this.selectedDates = [];
          this.selectedDatesCount = 0;
          this.dateCalendar?.updateTodaysDate();
          const topContainer = document.querySelector('.container-fluid');
          topContainer?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    this.jobDetail$ = this.store.pipe(
      select(fromJob.getJobDetail),
      takeWhile(() => this.componentActive)
    );
    this.teamInfo$ = this.store.pipe(
      select(fromJob.getTeamInfo),
      takeWhile(() => this.componentActive)
    );
    this.taskInfo$ = this.store.pipe(
      select(fromJob.getTaskInfo),
      takeWhile(() => this.componentActive)
    );
    this.salesSlot$ = this.store.pipe(
      select(fromJob.getSaleSlots),
      takeWhile(() => this.componentActive)
    );
    this.feedback$ = this.store.pipe(
      select(fromJob.getFeedbackQuestions),
      takeWhile(() => this.componentActive)
    );
    this.jobDetail$.subscribe((res) => {
      if (res) {
        this.jobDetail = res;
        if (res.project?.client_id) {
          if (this.mode !== 'clientJobTender') {
            this.loadBudget(res.project.client_id);
          }
        }
        this.patchFormData();

        const projStartDate = res.start_date;
        this.minDate = res.start_date;
        this.maxDate = res.finish_date;
      }
    });
    this.budgetDetail$.subscribe((res) => {
      if (res && res.data) {
        const contacts = res.data[0].contacts.data;
        if (contacts) {
          this.budgetContactNames = contacts
            ?.map((c: any) => c.fullname)
            .join(',');
        }
      }
    });
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
        this.store.dispatch(
          new fromJobAction.LoadJobDetail({
            id: this.id,
            mode: this.mode ? this.mode : 'detail',
          })
        );
      }
    }
    this.genderLK = FormConfig.master.gender.map((a) => ({
        value: a,
        text: undefined,
      }));
    this.radiusLK = FormConfig.radius.map((a) => ({
        value: a,
        text: a,
      }));
    this.translateService.get('contracts').subscribe((p) => {
      this.contractTypesService.getContractTypes({}).subscribe((c) => {
        this.contractTypeLK = this.sortOption(
          c.data
            ? c.data.map((a) => ({
                value: a.id,
                text: this.translateService.instant(
                  'contracts.identifier.' + a.identifier
                ),
              }))
            : []
        );
      });
    });
    this.certificateService.getCertificate({}).subscribe((results) => {
      this.certificateLK = this.sortOption(
        results.data
          ? results.data.map((a) => ({
              value: a.id,
              text: a.name
            }))
          : []
      );
    });
    this.skillsService.getSkills({}).subscribe((res) => {
      let newReg = [];
      if (res.data && res.data.length) {
        newReg = res.data.map((reg: { id: any; title: any }) => ({
            value: reg.id,
            text: reg.title,
          }));
      }
      this.skillsLK = newReg;
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
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
              ? res.data.map((a) => ({
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
                }))
              : []
          );
          // if (this.budgetLK && this.budgetLK.length) {
          //   this.patchFormData();
          // }
        });
    });
  }

  patchFormData() {
    if (this.jobDetail && this.editForm) {
      this.editForm.reset();
      if (this.validationMessages) {
        this.validationMessages.additional_costs = [];
      }
      const obj = {
        start_time: this.jobDetail.start_time,
        finish_time: this.jobDetail.finish_time,
        cities: this.jobDetail.site?.cities || [],
        zip_min: this.jobDetail.site?.zip_min,
        zip_max: this.jobDetail.site?.zip_max,
        radius: this.jobDetail.site?.radius,
        gender: this.jobDetail.site?.gender,
        assignment_budget: this.jobDetail.assignment_budget,
        wage: this.jobDetail.wage,
        additional_costs: this.jobDetail.additional_costs,
        budget_id: this.jobDetail.budget_id,
        contractType: this.jobDetail.contract_type_id,
        certificate: this.jobDetail.site?.certificate,
        skill: this.jobDetail.site?.skill
      };
      console.log('patching value');
      this.editForm.patchValue(obj);
    }
  }

  initForm() {
    if (this.mode === 'clientJobTender') {
      this.editForm = this.fb.group({
        start_time: ['', [Validators.required]],
        finish_time: ['', [Validators.required]],
      });

      this.translateService.get('form.errors.required').subscribe(() => {
        this.validationMessages = {
          start_time: {
            required: this.translateService.instant('form.errors.required'),
          },
          finish_time: {
            required: this.translateService.instant('form.errors.required'),
          },
        };
        if (this.editForm) {
          this.editForm.valueChanges.subscribe((value) => {
            if (this.editForm) {
              this.displayMessage =
                this.genericValidatorService.processMessages(
                  this.editForm,
                  this.validationMessages
                );
            }
          });
        }
      });
    } else {
      this.editForm = this.fb.group({
        start_time: ['', [Validators.required]],
        finish_time: ['', [Validators.required]],
        published_at: ['', [Validators.required]],
        published_time: ['', [Validators.required]],
        cities: ['', []],
        zip_min: ['', []],
        zip_max: ['', []],
        radius: [''],
        gender: [''],
        contractType: [''],
        skill: [''],
        certificate: [''],
        budget_id: [
          {
            value: '',
            disabled: this.jobDetail?.project?.client?.id ? true : false,
          },
          [],
        ],
        assignment_budget: [''],
        wage: [''],
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
          published_time: {
            required: this.translateService.instant('form.errors.required'),
          },
          assignment_budget: {
            required: this.translateService.instant('form.errors.required'),
          },
          wage: {
            required: this.translateService.instant('form.errors.required'),
          },
          additional_costs: [],
        };
        if (this.editForm) {
          this.editForm.valueChanges.subscribe((value) => {
            if (this.editForm) {
              this.displayMessage =
                this.genericValidatorService.processMessages(
                  this.editForm,
                  this.validationMessages
                );
            }
          });
        }
      });
    }
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.selectedDates
        .map((x) => new Date(x))
        .some((d) => moment(d).isSame(moment(date)));
      return highlightDate ? 'selected-date-td' : '';
    };
  }

  selectDate(event: any) {
    this.date = event;
    const dateExist =
      this.selectedDates.findIndex((x) =>
        moment(x).isSame(moment(this.date))
      ) !== -1;

    if (!dateExist) {
      this.selectedDates.push(event);
      this.selectedDatesCount += 1;
      this.sortDates(this.selectedDates);
      const dateDivs: any = document.querySelectorAll(
        '[class*="mat-calendar-body-cell-content"]'
      );
      const selectedDiv = [...dateDivs].find(
        (e) => e.innerHTML == event.getDate()
      );
      selectedDiv?.parentElement?.classList.add('selected-date-td');
      if (this.jobDetail?.budget_id) {
        this.getBudget(this.jobDetail.budget_id);
      } else {
        const budgetIdValue = this.editForm?.get('budget_id')?.value;
        this.getBudget(budgetIdValue);
      }
    } else {
      this.updateSelectedDates(event);
    }
    setTimeout(() => {
      const focusedEle = document.querySelector('.mat-calendar-body-selected');
      focusedEle?.classList.remove('mat-calendar-body-selected');
    }, 1000);
  }

  sortDates(dates: any[]) {
    dates.sort((a, b) => moment(a).diff(b));
  }

  updateSelectedDates(date: any) {
    this.selectedDates = this.selectedDates.filter(
      (x) => !moment(x).isSame(moment(date))
    );
    this.selectedDatesCount = this.selectedDates.length;
    const dateDivs: any = document.querySelectorAll('[class*="selected-date-td"]');
    const selectedEle = [...dateDivs].find(
      (e) =>
        e.firstElementChild &&
        +e.firstElementChild.innerHTML === new Date(date).getDate()
    );
    selectedEle?.classList.remove('selected-date-td');
    if (this.jobDetail?.budget_id) {
      this.getBudget(this.jobDetail.budget_id);
    } else {
      const budgetIdValue = this.editForm?.get('budget_id')?.value;
      this.getBudget(budgetIdValue);
    }
  }

  onBudgetChange(id: number) {
    this.getBudget(id);
  }

  getBudget(id: number, assignmentBudget?: number) {
    if (id) {
      this.budgetService
        .getBudgetById({
          id,
          include: ['client,contacts,order.budget,creator'],
        })
        .subscribe((res) => {
          const availableBudget = res.data?.available
            ? res.data?.available
            : null;
          if (this.jobDetail?.assignment_budget) {
            if (assignmentBudget) {
              this.checkAvailableBudget(availableBudget, assignmentBudget);
            } else {
              this.checkAvailableBudget(
                availableBudget,
                this.editForm?.get('assignment_budget')?.value
              );
            }
          }
        });
    } else {
      this.budgetExceeded = false;
    }
  }

  onAssignmentBudgetChange(target: any) {
    if (target.value && this.jobDetail?.budget_id) {
      this.getBudget(this.jobDetail.budget_id, target.value);
    }
  }

  checkAvailableBudget(availableBudget: any, assignmentBudget: number) {
    this.budgetExceeded =
      availableBudget < assignmentBudget * this.selectedDatesCount;
    if (this.budgetExceeded) {
      this.toastrService.error(
        this.translateService.instant('job.create-tenders.budget-exceeded')
      );
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

  formatSelectedDates(dates: string[]) {
    const formattedDates: string[] = [];
    dates.forEach((d) => {
      formattedDates.push(moment(d).format('YYYY-MM-DD h:mm:ss'));
    });
    return formattedDates;
  }

  save() {
    if (this.editForm) {
      this.validateDatesField = true;
      const dates = this.formatSelectedDates(this.selectedDates);
      this.editForm.markAllAsTouched();
      this.editForm.markAsDirty();
      if (this.editForm.valid && this.selectedDatesCount > 0) {
        const formValue = this.editForm.getRawValue();
        let publishedAt = formValue.published_at ? this.datePipe.transform(formValue.published_at, 'yyyy-MM-dd ') : null;
        if(formValue.published_time && publishedAt) {
          publishedAt += formValue.published_time + ':59';
        }
        const obj: TenderRequestVM = {
          additional_costs: formValue.additional_costs
            ? formValue.additional_costs
            : [],
          assignment_budget: formValue.assignment_budget
            ? formValue.assignment_budget
            : this.jobDetail?.assignment_budget,
          budget_id: formValue.budget_id ? formValue.budget_id : null,
          cities: formValue.cities ? formValue.cities : [],
          dates,
          start_time: formValue.start_time,
          finish_time: formValue.finish_time,
          published_at: publishedAt,
          wage: formValue.wage,
          zip_max: formValue.zip_max ? formValue.zip_max : null,
          zip_min: formValue.zip_min ? formValue.zip_min : null,
          gender: formValue.gender ? formValue.gender : null,
          radius: formValue.radius ? formValue.radius : null,
          contractType: formValue.contractType ? formValue.contractType : null,
          certificate: formValue.certificate ? formValue.certificate : null,
          skill: formValue.skill ? formValue.skill : null
        };
        if (this.id) {
          const dialogRef = this.dialog.open(ConfirmBoxComponent, {
            data: {
              type: 'warning',
              title: this.translateService.instant(
                'job.create-tenders.save.title'
              ),
              message: this.translateService.instant(
                'job.create-tenders.save.message'
              ),
              cancelCode: 'common.buttons.cancel',
              confirmCode: 'common.buttons.yes-save',
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result && this.id) {
              this.store.dispatch(
                new fromJobAction.CreateJobTenders({
                  tender: obj,
                  jobId: this.id,
                })
              );
            }
          });
        }
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.editForm,
          this.validationMessages
        );
        for (const key of Object.keys(this.editForm.controls)) {
          if (this.editForm.controls[key].invalid) {
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
    const invalidField = document.querySelector('.ng-invalid[formControlName]');
    if (invalidField)
      {invalidField.scrollIntoView({ behavior: 'smooth', block: 'start' });}

    const EmptyDates = document.querySelector('.dates-invalid');
    if (EmptyDates)
      {EmptyDates.scrollIntoView({ behavior: 'smooth', block: 'start' });}
  }

  cancel() {
    if (this.mode !== 'clientJobTender') {
      this.router.navigate(['/jobs/', this.id]);
    } else {
      this.router.navigate(['/jobs/client/', this.id]);
    }
  }
}
