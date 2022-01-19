import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BudgetService } from './../../services/budget.service';
import { ClientService } from '../../services/client.service';
import { FormConfig } from './../../constant/forms.constant';
import { FormatService } from './../../services/format.service';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { OptionVM } from './../../model/option.model';
import { OrderMappingService } from './../../services/mapping-services/order-mapping.service';
import { OrderService } from './../../services/order.service';
import { OrderVM } from '../../model/order.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { currencyValidator } from '../../utility/currency.validator';

@Component({
  selector: 'app-admin-order-edit',
  templateUrl: './admin-order-edit.component.html',
  styleUrls: ['./admin-order-edit.component.scss']
})
export class AdminOrderEditComponent implements OnInit {
  isEdit = false;
  mode = '';
  form: FormGroup | undefined;
  displayMessage: any = {};
  customProperties: string[] = [];
  orderId: any;
  order: OrderVM | undefined;
  get budgetFormGroup() {
    return this.form && this.form.get('budget') as FormGroup;
  }
  get budgetDisplayMessage() {
    return this.displayMessage.budget || {};
  }
  get dataFormGroup() {
    return this.form && this.form.get('data') as FormGroup;
  }
  clientLK: OptionVM[] = [];
  modes = {
    NO_BUDGET: 0,
    EXISTING_BUDGET: 1,
    CREATE_BUDGET: 2
  }
  budgetMode: number = this.modes.NO_BUDGET;
  validationMessages: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private formatService: FormatService,
    private budgetService: BudgetService,
    private toastrService: ToastrService,
    private orderMappingService: OrderMappingService,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private clientService: ClientService,
    private el: ElementRef) { }

  ngOnInit(): void {
    this.loadLookUps();
    this.activatedRoute.data.subscribe(data => {
      this.mode = data.mode;
      if (this.mode === 'create') {
        this.initForm();
      } else {
        this.activatedRoute.params.subscribe(res => {
          this.orderId = res.id;
          this.orderService.getOrderById({
            id: res.id,
            include: ['client,budget.client,budget.orders'],
          }).subscribe(budgetResponse => {
            if (budgetResponse.data) {
              this.order = this.orderMappingService.orderResponseToVM(budgetResponse.data);
              this.initForm();
            }
          });
        })
      }

    })
  }
  private initForm() {
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        client_id: {
          required: this.translateService.instant('form.errors.required')
        },
        name: {
          required: this.translateService.instant('form.errors.required')
        },
        required_assignments: {
          required: this.translateService.instant('form.errors.required')
        },
        assignment_budget: {
          currency: this.translateService.instant('form.errors.currencyformat'),
        },
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
        },
        data: {

        }
      };
    });
    if (this.order) {
      this.form = new FormGroup({
        client_id: new FormControl(this.order.client_id, [Validators.required]),
        name: new FormControl(this.order.name, [Validators.required]),
        number: new FormControl(this.order.number, []),
        ordered_at: new FormControl(this.order.ordered_at ? new Date(this.order.ordered_at) : '', []),
        remarks: new FormControl(this.order.remarks, []),
        required_assignments: new FormControl(this.order.required_assignments, []),
        assignment_budget: new FormControl(this.order.assignment_budget, [currencyValidator()]),
        data: new FormGroup({})
      });
      this.budgetMode = this.order.budget_id ? this.modes.EXISTING_BUDGET : this.modes.NO_BUDGET;
      if (this.budgetMode === this.modes.NO_BUDGET) {
        this.form.get('required_assignments')?.setValidators([Validators.required]);
      }
      this.clientPropertyProcess(this.order.client.custom_properties);
    } else {
      this.form = new FormGroup({
        client_id: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        number: new FormControl('', []),
        ordered_at: new FormControl('', []),
        budgetMode: new FormControl(this.modes.NO_BUDGET, []),
        remarks: new FormControl('', []),
        required_assignments: new FormControl(null, [Validators.required]),
        assignment_budget: new FormControl(null, [currencyValidator()]),
        data: new FormGroup({})
      });
      this.form.get('client_id')?.valueChanges.subscribe(res => {
        if (res)
          this.clientService.getClientById({ id: res }).subscribe(clientRes => {
            if (clientRes && clientRes.data && clientRes.data.custom_properties) {
              this.clientPropertyProcess(clientRes.data.custom_properties);
            }
          });
      });
      this.form.get('budgetMode')?.valueChanges.subscribe(res => {
        this.budgetMode = res;
        if (this.budgetMode === this.modes.CREATE_BUDGET) {
          this.form?.addControl('budget', new FormGroup({
            value: new FormControl('', [Validators.required, currencyValidator()]),
            remarks: new FormControl('', [])
          }));
        } else {
          this.form?.removeControl('budget');

        }
        this.form?.get('required_assignments')?.clearValidators();
        if (this.budgetMode === this.modes.NO_BUDGET) {
          this.form?.get('required_assignments')?.setValidators([Validators.required]);
        }
      });
    }
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

  private clientPropertyProcess(custom_properties: string[]) {
    const propertiesObj: any = {};
    let dataControl = this.form?.get('data') as FormGroup;
    if (dataControl) {
      this.form?.removeControl('data');
    }
    this.form?.addControl('data', new FormGroup({}));
    dataControl = this.form?.get('data') as FormGroup;
    custom_properties.forEach(prop => {
      dataControl.addControl(prop, new FormControl('', []));
      propertiesObj[prop] = this.order?.data[prop] || '';
    });
    this.customProperties = custom_properties;
    dataControl.patchValue(propertiesObj);
  }

  loadLookUps() {
    this.clientService.getClients({
      only_fields: ['client.id', 'client.name'],
      limit: 10000, order_by: 'name'
    }).subscribe(res => {
      this.clientLK = (res && res.data ? res.data : []).map(a => {
        return {
          text: a.name,
          value: a.id
        }
      })
    });
  }
  save() {
    this.form?.markAllAsTouched();
    if (this.form && this.form.valid) {
      const obj = this.form.getRawValue();
      if (this.order && this.order.id) {
        const order = {
          id: this.order.id,
          name: obj.name,
          client_id: this.order.client_id,
          number: obj.number,
          ordered_at: obj.ordered_at ? this.formatService.date(obj.ordered_at, true, 'YYYY-MM-DD') : null,
          remarks: obj.remarks,
          assignment_budget: obj.assignment_budget,
          required_assignments: obj.required_assignments,
          data: obj.data,
          state: this.order.state
        }
        this.orderService.updateOrder(this.order.id, order).subscribe(res => {
          this.successNotifyAndNavigate(this.order?.id);
        }, error => {
          this.toastrService.error(this.translateService.instant('notification.post.orders.error'));
        })
      } else {
        const order = {
          name: obj.name,
          client_id: obj.client_id,
          number: obj.number,
          ordered_at: obj.ordered_at ? this.formatService.date(obj.ordered_at, true, 'YYYY-MM-DD') : null,
          remarks: obj.remarks,
          assignment_budget: obj.assignment_budget,
          required_assignments: obj.required_assignments,
          data: obj.data,
          state: FormConfig.orders.initial
        }
        this.orderService.createOrder(order).subscribe(res => {
          if (res.body?.data?.id) {
            if (obj.budgetMode !== this.modes.NO_BUDGET && obj.budget && obj.budget.value) {
              const budget = obj.budget;
              budget.order_id = res.body?.data?.id
              budget.name = order.name;
              this.budgetService.createBudget(budget).subscribe(() => {
                this.successNotifyAndNavigate(res.body?.data?.id);
              });
            } else {
              this.successNotifyAndNavigate(res.body?.data?.id);
            }
          }
        }, error => {
          this.toastrService.error(this.translateService.instant('notification.post.orders.error'));
        })
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
  cancelEdit() {
    if (this.mode === 'edit') {
      this.router.navigate(['/administration/orders', this.orderId])
    } else {
      this.router.navigate(['/administration/orders'])
    }
  }
  private successNotifyAndNavigate(id?: number) {
    this.toastrService.success(this.translateService.instant('notification.post.orders.success'));
    this.router.navigate(['/administration/orders', id]);
  }
}
