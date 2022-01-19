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
  selector: 'app-admin-budget-edit',
  templateUrl: './admin-budget-edit.component.html',
  styleUrls: ['./admin-budget-edit.component.scss']
})
export class AdminBudgetEditComponent implements OnInit {
  mode: string = '';
  form: FormGroup | undefined;
  budget: BudgetVM | undefined;
  budgetId: any;
  get budgetFormGroup() {
    return this.form && this.form.get('budget') as FormGroup;
  }
  displayMessage: any = {};
  validationMessages: any;
  get budgetDisplayMessage() {
    return this.displayMessage && this.displayMessage.budget ? this.displayMessage.budget : {};
  }
  validateAffectedBudget = 0;
  isTransfer = 0;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private budgetService: BudgetService,
    private budgetMappingService: BudgetMappingService,
    private toastrService: ToastrService,
    private genericValidatorService: GenericValidatorService,
    private el: ElementRef) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      if (res.id) {
        this.mode = 'edit';
        this.budgetId = res.id;
        this.budgetService.getBudgetById({
          id: res.id,
          include: ['client,contacts,order.budget,creator'],
        }).subscribe(budgetResponse => {
          if (budgetResponse.data) {
            this.budget = this.budgetMappingService.budgetResponseToVM(budgetResponse.data);
            this.initForm();
          }
        });
      } else {
        this.mode = 'create';
        this.initForm();
      }
    });
  }
  private initForm() {
    if (this.budget) {
      this.form = new FormGroup({
        budget: new FormGroup({
          name: new FormControl(this.budget.name, [Validators.required]),
          remarks: new FormControl(this.budget.remarks, []),
          contact_ids: new FormControl(this.budget.contacts ? this.budget.contacts.map(a => a.id) : [], [])
        })
      });
    } else {
      this.form = new FormGroup({
        budget: new FormGroup({
          name: new FormControl('', [Validators.required]),
          budget_id: new FormControl('', [Validators.required]),
          value: new FormControl('', [Validators.required, currencyValidator(), this.validateBudget()]),
          remarks: new FormControl('', []),
          contact_ids: new FormControl([], [])
        })
      });
    }
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        budget: {
          budget_id: {
            required: this.translateService.instant('form.errors.required')
          },
          name: {
            required: this.translateService.instant('form.errors.required')
          },
          value: {
            required: this.translateService.instant('form.errors.required'),
            currency: this.translateService.instant('form.errors.currencyformat'),
            budget: this.translateService.instant('form.errors.affectedBudget'),
          }
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
  }
  availableParentBudgetUpdated(availableParentBudget: any) {
    this.validateAffectedBudget = availableParentBudget;
    this.budgetFormGroup?.get('value')?.patchValue('');
  }
  validateBudget(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.validateAffectedBudget.toString() && control.value) {
        const budget = parseFloat(this.validateAffectedBudget.toString());
        var val = parseFloat(control.value);
        if (val) {
          return (budget - val) >= 0 ? null : { budget: '' };
        } else {
          return null;
        }
      } else {
        return null;
      }
    };
  }
  cancelEdit() {
    if (this.mode === 'edit') {
      this.router.navigate(['/administration/budgets', this.budget?.id])
    } else {
      this.router.navigate(['/administration/budgets'])
    }
  }
  saveBudget() {
    this.budgetFormGroup?.markAllAsTouched();
    if (this.budgetFormGroup && this.budgetFormGroup.valid) {
      const obj = this.budgetFormGroup.getRawValue();
      if (this.budget && this.budget.id) {
        this.budgetService.updateBudget(this.budget.id, { id: this.budget.id, name: obj.name, remarks: obj.remarks }).subscribe(res => {
          if (obj.contact_ids && obj.contact_ids.length > 0 && res.body?.data?.id) {
            this.budgetService.updateBudgetContacts(res.body?.data?.id, { contact_ids: obj.contact_ids }).subscribe(() => {
              this.successNotifyAndNavigate(this.budget?.id);
            });
          } else {
            this.successNotifyAndNavigate(this.budget?.id);
          }
        });
      } else {
        this.budgetService.createBudget(obj).subscribe(res => {
          if (obj.contact_ids && obj.contact_ids.length > 0 && res.body?.data?.id) {
            this.budgetService.updateBudgetContacts(res.body?.data?.id, { contact_ids: obj.contact_ids }).subscribe(() => {
              this.successNotifyAndNavigate(res.body?.data?.id);
            });
          } else {
            this.successNotifyAndNavigate(res.body?.data?.id);
          }
        });
      }
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

  private successNotifyAndNavigate(id?: number) {
    this.toastrService.success(this.translateService.instant('notification.post.budgets.success'));
    this.router.navigate(['/administration/budgets', id]);
  }
}
