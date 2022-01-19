/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */

import * as fromDates from './../state';
import * as fromDatesAction from './../state/dates.actions';
import * as moment from 'moment';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { BudgetService } from '../../services/budget.service';
import { CurrencyPipe } from '@angular/common';
import { DatesVM } from '../../model/dates.model';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { JobVM } from '../../model/job.model';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-date-detail',
  templateUrl: './date-detail.component.html',
  styleUrls: ['./date-detail.component.scss'],
})
export class DateDetailComponent implements OnInit {
  componentActive = true;
  id: any;
  mode?: string;
  budgetLK: OptionVM[] = [];
  detailForm?: FormGroup;
  validationMessages: any;
  displayMessage: any = {};

  dateDetail$: Observable<DatesVM | undefined> = of(undefined);
  jobDetail$: Observable<JobVM | undefined> = of(undefined);
  dateDetail: DatesVM | undefined;
  jobDetail: JobVM | undefined;
  addedDate: any;
  minDate?: any;
  maxDate?: any;
  selectedDates: any[] = [];
  selectedDatesCount = 0;
  validateDatesField = false;
  datesLength = 0;

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private store: Store<fromDates.State>,
    private budgetService: BudgetService,
    private currencyPipe: CurrencyPipe,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.retrieveIdFromParameters();
    this.dateDetail$ = this.store.pipe(
      select(fromDates.getDatesDetail),
      takeWhile(() => this.componentActive)
    );
    this.jobDetail$ = this.store.pipe(
      select(fromDates.getJobDetail),
      takeWhile(() => this.componentActive)
    );

    this.jobDetail$.subscribe((res) => {
      this.jobDetail = res;
      if (res && res.project && res.project.client_id) {
        this.loadBudget(res.project.client_id);
      }
      this.patchDateDetail();

      const projStartDate = res?.project?.started_at;
      this.minDate =
        projStartDate && projStartDate > new Date().toDateString()
          ? projStartDate
          : new Date();
      this.maxDate = res?.project && res?.project.finished_at;
    });

    this.dateDetail$.subscribe((res) => {
      this.dateDetail = res;
      if (res && res.job && res.job.project && res.job.project.client_id) {
        this.loadBudget(res.job.project.client_id);
      }
      this.patchDateDetail();
    });
  }

  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.mode = res.mode;
    });
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.loadDetails(params);
    });
  }

  loadDetails(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id');
      const assign_id = params.get('assign_id');
      if (this.id) {
        if (this.mode !== 'newDate') {
          this.store.dispatch(
            new fromDatesAction.LoadDatesDetail({ id: this.id, mode: 'detail', assignment_id: `${assign_id}` })
          );
        } else {
          this.store.dispatch(
            new fromDatesAction.LoadJobDetail({
              id: this.id,
              mode: this.mode,
            })
          );
        }
      }
    }
  }

  initForm() {
    this.detailForm = this.fb.group({
      start_time: ['', [Validators.required]],
      finish_time: ['', [Validators.required]],
      budget_id: ['', []],
      wage: ['', [Validators.required]],
      assignment_budget: ['', [Validators.required]],
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

  patchDateDetail() {
    if (this.detailForm) {
      this.detailForm.reset();
      if (this.jobDetail && this.mode === 'newDate') {
        const obj = {
          start_time: this.jobDetail.start_time,
          finish_time: this.jobDetail.finish_time,
          budget_id: this.jobDetail.budget_id ? this.jobDetail.budget_id : null,
          assignment_budget: this.jobDetail.assignment_budget,
          wage: this.jobDetail.wage,
        };
        this.detailForm.patchValue(obj);
      }
      if (this.dateDetail && this.mode !== 'newDate') {
        const obj = {
          start_time: this.dateDetail.start_time,
          finish_time: this.dateDetail.finish_time,
          budget_id: this.dateDetail.budget_id,
          assignment_budget: this.dateDetail.assignment_budget,
          wage: this.dateDetail.wage,
        };
        this.detailForm.patchValue(obj);
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
        });
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
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
    this.addedDate = event;
    const dateExist =
      this.selectedDates.findIndex((x) =>
        moment(x).isSame(moment(this.addedDate))
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
  }

  formatSelectedDates(dates: string[]) {
    const formattedDates: string[] = [];
    dates.forEach((d) => {
      formattedDates.push(moment(d).format('YYYY-MM-DD h:mm:ss'));
    });
    return formattedDates;
  }

  saveDetail() {
    if (this.detailForm) {
      this.validateDatesField = true;
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      if (this.mode === 'newDate') {
        if (this.selectedDatesCount > 0) {
          this.saveDate();
        }
      } else {
        this.updateDate();
      }
    }
  }

  saveDate() {
    if (this.detailForm) {
      if (this.detailForm.valid) {
        const formValue = this.detailForm.getRawValue();
        const dates = this.formatSelectedDates(this.selectedDates);
        const datesToCreate: DatesVM[] = [];
        dates.forEach(d => {
          const obj: DatesVM = {
            appointed_at: d,
            start_time: formValue.start_time,
            finish_time: formValue.finish_time,
            budget_id: formValue.budget_id,
            job_id: this.id,
            assignment_budget: formValue.assignment_budget,
            wage: formValue.wage,
          };
          console.log(obj);
          datesToCreate.push(obj);
        });
        this.store.dispatch(new fromDatesAction.CreateDates(datesToCreate));
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

  updateDate() {
    if (this.detailForm) {
      if (this.detailForm.valid) {
        const formValue = this.detailForm.getRawValue();
        const obj: DatesVM = {
          id: this.id,
          appointed_at: this.dateDetail?.appointed_at,
          start_time: formValue.start_time,
          finish_time: formValue.finish_time,
          budget_id: formValue.budget_id,
          assignment_budget: formValue.assignment_budget,
          wage: formValue.wage,
        };
        this.store.dispatch(new fromDatesAction.UpdateDate(obj));
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

  scrollToError() {
    const invalidField = document.querySelector('.ng-invalid[formControlName]');
    if (invalidField) {
      invalidField.scrollIntoView({ behavior: 'smooth' });
    }
  }

  cancelEdit() {
    if (this.id) {
      this.router.navigate(['/dates', this.id]);
    } else {
      this.router.navigate(['/dates']);
    }
  }
}
