import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';

import { BudgetMappingService } from './../../services/mapping-services/budget-mapping.service';
import { BudgetService } from './../../services/budget.service';
import { BudgetVM } from '../../model/budget.model';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { currencyValidator } from '../../utility/currency.validator';

@Component({
  selector: 'app-admin-budget-record-create',
  templateUrl: './admin-budget-record-create.component.html',
  styleUrls: ['./admin-budget-record-create.component.scss']
})
export class AdminBudgetRecordCreateComponent implements OnInit {
  budget: BudgetVM | undefined;
  budgetId: number | undefined;
  displayMessage: any = {};
  form = new FormGroup({
    recordValue: new FormControl('', [Validators.required, currencyValidator(), this.validateBudget()]),
    recordComment: new FormControl('', [])
  });
  validationMessages: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private budgetService: BudgetService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private router: Router,
    private budgetMappingService: BudgetMappingService,
    private genericValidatorService: GenericValidatorService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        recordValue: {
          required: this.translateService.instant('form.errors.required'),
          currency: this.translateService.instant('form.errors.currencyformat'),
          budget: this.translateService.instant('form.errors.affectedBudget'),
        }
      };
    });
    if (this.form) {
      this.form.valueChanges.subscribe((value) => {
        if (this.form) {
          this.displayMessage = this.genericValidatorService.processMessages(
            this.form,
            this.validationMessages
          );
        }
      });
    }
    this.activatedRoute.params.subscribe(res => {
      if (res.id) {
        this.budgetId = res.id;
        this.budgetService.getBudgetById({
          id: res.id,
          include: ['client,contacts,order.budget,creator'],
        }).subscribe(budgetResponse => {
          if (budgetResponse.data) {
            this.budget = this.budgetMappingService.budgetResponseToVM(budgetResponse.data);

          }
        });
      }
    });
  }
  save() {
    this.form.markAllAsTouched();
    if (this.form.valid && this.budgetId) {
      const obj = this.form.getRawValue();
      this.budgetService.createRecord(this.budgetId, obj.recordValue, obj.recordComment).subscribe(res => {
        this.toastrService.success(this.translateService.instant('notification.post.budgets.success'));
        this.router.navigate(['/administration/budgets', this.budget?.id]);
      });
    } else if (this.form) {
      this.displayMessage = this.genericValidatorService.processMessages(
        this.form,
        this.validationMessages
      );
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
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
  cancelEdit() {
    this.router.navigate(['/administration/budgets', this.budgetId]);
  }
  validateBudget(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.budget?.available?.toString() && control.value) {
        const budget = parseFloat(this.budget.available.toString());
        var val = parseFloat(control.value);
        if (val) {
          return (val + budget) > 0 ? null : { budget: '' };
        } else {
          return null;
        }
      } else {
        return null;
      }
    };
  }
}
