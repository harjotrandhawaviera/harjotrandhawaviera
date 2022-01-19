import * as fromAssignment from './../state';
import * as fromAssignmentAction from './../state/assignment.actions';
import * as fromUser from './../../root-state/user-state';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
import { take, takeWhile } from 'rxjs/operators';

import { AgentService } from '../../services/agent.service';
import { AgentVM } from '../../model/agent.model';
import { AllowedActions } from '../../constant/allowed-actions.constant';
import { AssignmentDocumentVM } from '../../model/document.model';
import { BudgetService } from '../../services/budget.service';
import { CurrencyPipe } from '@angular/common';
import { DatesVM } from '../../model/dates.model';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { OptionVM } from '../../model/option.model';
import { SalesSlotVM } from '../../model/client.model';
import { TranslateService } from '../../services/translate.service';
import { currencyValidator } from '../../utility/currency.validator';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss'],
})
export class EditAssignmentComponent implements OnInit {
  componentActive = true;
  id?: string | null;
  mode?: string;

  assignment$: Observable<AssignmentVM | undefined> = of(undefined);
  assignment: AssignmentVM | undefined = undefined;
  hasFullAccess$: Observable<boolean> = of(false);
  agent: AgentVM | undefined;
  budgetLK: OptionVM[] = [];

  editForm?: FormGroup;
  validationMessages: any;
  displayMessage: any = {};

  get additional_costs(): FormArray | undefined {
    return this.editForm
      ? (this.editForm.get('additional_costs') as FormArray)
      : undefined;
  }

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromAssignment.State>,
    private budgetService: BudgetService,
    private agentService: AgentService,
    private currencyPipe: CurrencyPipe,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private userStore: Store<fromUser.State>
  ) {}

  ngOnInit(): void {
    this.retrieveIdFromParameters();
    this.initForm();
    this.assignment$ = this.store.pipe(
      select(fromAssignment.getAssignmentDetail),
      takeWhile(() => this.componentActive)
    );

    this.assignment$.subscribe((res) => {
      if (res) {
        this.assignment = res;
        console.log(res);
        if (
          res &&
          res.date.data &&
          res.date.data.job.data.project &&
          res.date.data.job.data.project.client_id
        ) {
          this.loadBudget(res.date.data.job.data.project.client_id);
        }
        this.patchAssignmentDetail();
        this.agentService
        .getAgents({
          limit: 10000,
          include: ['user'],
          only_fields: ['agent.id', 'agent.fullname', 'user.id', 'user.rights'],
        })
        .subscribe((a) => {
          this.agent = a.data?.find((x) => x.id === res.agent_id);
          console.log(this.agent);
        });
      }
    });

    this.hasFullAccess$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['manage-projects'],
      }),
      takeWhile(() => this.componentActive)
    );
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
          new fromAssignmentAction.LoadAssignmentDetail(this.id)
        );
      }
    }
  }

  initForm() {
    this.editForm = this.fb.group({
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
      if (this.editForm) {
        this.editForm.valueChanges.subscribe((value) => {
          if (this.editForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.editForm,
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

  patchAssignmentDetail() {
    if (this.assignment && this.editForm) {
      this.editForm.reset();
      if (this.validationMessages) {
        this.validationMessages.additional_costs = [];
      }
      const obj = {
        start_time: this.assignment.start_time,
        finish_time: this.assignment.finish_time,
        comment: this.assignment.comment,
        budget_id: this.assignment.budget_id,
        wage: this.assignment.wage,
        assignment_budget: this.assignment.assignment_budget,
        additional_costs: this.assignment.additional_costs,
      };
      if (this.assignment.additional_costs) {
        this.assignment.additional_costs.forEach((a) => {
          this.addAdditionalCost(a);
        });
      }
      console.log('patching value');
      this.editForm.patchValue(obj);
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

  save() {
    if (this.editForm) {
      this.editForm.markAllAsTouched();
      this.editForm.markAsDirty();
      if (this.editForm.valid) {
        const formValue = this.editForm.getRawValue();
        const obj: AssignmentVM = {
          start_time: formValue.start_time,
          finish_time: formValue.finish_time,
          comment: formValue.comment,
          wage: formValue.wage,
          budget_id: formValue.budget_id,
          assignment_budget: formValue.assignment_budget,
          additional_costs: formValue.additional_costs,
        };
        this.store.dispatch(
          new fromAssignmentAction.UpdateAssignment({
            id: Number(this.id),
            assignment: obj
          })
        );
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
    const invalidField = document.querySelector('.ng-invalid');
    if (invalidField) {
      invalidField.scrollIntoView({ behavior: 'smooth' });
    }
  }

  cancel() {
    this.router.navigate(['/assignments', this.id]);
  }

}
