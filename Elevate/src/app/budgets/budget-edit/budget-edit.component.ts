import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { BudgetMappingService } from './../../services/mapping-services/budget-mapping.service';
import { BudgetService } from './../../services/budget.service';
import { BudgetVM } from '../../model/budget.model';
import { ClientService } from './../../services/client.service';
import { ContactMappingService } from './../../services/mapping-services/contact-mapping.service';
import { ContactVM } from '../../model/contact.model';
import { FormGroup } from '@angular/forms';
import { FormatService } from './../../services/format.service';
import { OptionVM } from './../../model/option.model';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-budget-edit, [app-budget-edit]',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.scss']
})
export class BudgetEditComponent implements OnInit, OnChanges {
  @Input()
  budget: BudgetVM | undefined;
  @Output()
  availableParentBudgetUpdated = new EventEmitter();
  @Input()
  isEdit = false;
  @Input()
  budgetFormGroup!: FormGroup;
  @Input()
  displayMessage: any = {};
  clientContacts: ContactVM[] = [];
  clientNames: OptionVM[] = [];
  budgetLK: OptionVM[] = [];
  contactLK: OptionVM[] = [];
  availableParentBudget: number = 0;
  client: any;
  constructor(
    private budgetService: BudgetService,
    private clientService: ClientService,
    private contactMappingService: ContactMappingService,
    private translateService: TranslateService,
    private formatService: FormatService,
    private budgetMappingService: BudgetMappingService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.budgetFormGroup) {
      // if (this.budgetFormGroup) {
      //   var formValue = this.budgetFormGroup.getRawValue();
      //   this.clientChange(formValue.client_id)
      // }
      // this.clientChangeSubscribe();
      this.budgetChangeSubscribe();
    }
    if (changes.budget && this.budget) {
      if (this.budget && this.budget.client) {
        this.client = this.budget.client;
        this.clientChange(this.budget.client.id)
      }
    }
  }
  ngOnInit(): void {
    // this.clientService.getClients({
    //   only_fields: ['client.id', 'client.name'],
    //   limit: 10000, order_by: 'name'
    // }).subscribe(res => {
    //   this.clientNames = (res && res.data ? res.data : []).map(a => {
    //     return {
    //       text: a.name,
    //       value: a.id
    //     }
    //   })
    // });
    if (!this.isEdit) {
      this.loadBudgets(undefined);
    }
  }
  private clientChangeSubscribe() {
    const clientIdCtrl = this.budgetFormGroup.get('client_id');
    clientIdCtrl?.valueChanges.subscribe(clientId => {
      this.clientChange(clientId);
    });
  }
  private clientChange(clientId: any) {
    if (!this.isEdit) {
      this.loadBudgets(clientId);
    }
    if (clientId) {
      this.clientService.getClientContactByClientId(clientId, { include: ['contact,user'] }).subscribe(res => {
        const contacts = this.contactMappingService.contactSearchResponseToVM(res)?.list;
        if (contacts) {
          this.translateService.get('common.salutation').subscribe(() => {
            this.contactLK = contacts.map(contact => {
              return {
                text: (contact.salutation ? this.translateService.instant('common.salutation.' + contact.salutation.toUpperCase()) : '') + contact.firstname + ' ' + contact.lastname,
                value: contact.id,
                info: contact.position + (contact.department ? ' - ' + contact.department : '')
              }
            })
          });

        }
      });
    }
  }
  private budgetChangeSubscribe() {
    const budgetIdCtrl = this.budgetFormGroup.get('budget_id');
    budgetIdCtrl?.valueChanges.subscribe(budgetId => {
      this.budgetChange(budgetId);
    });
  }
  private budgetChange(budgetId: any) {
    if (this.budgetLK && budgetId) {
      const budget = this.budgetLK.find(a => a.value === parseInt(budgetId, 10));
      this.availableParentBudget = budget && budget.data.available;
      this.availableParentBudgetUpdated.emit(this.availableParentBudget);
      if (budget && budget.data && budget.data.client) {
        this.client = budget.data.client;
        this.clientService.getClientContactByClientId(this.client.id, { include: ['contact,user'] }).subscribe(res => {
          const contacts = this.contactMappingService.contactSearchResponseToVM(res)?.list;
          if (contacts) {
            this.translateService.get('common.salutation').subscribe(() => {
              this.contactLK = contacts.map(contact => {
                return {
                  text: (contact.salutation ? this.translateService.instant('common.salutation.' + contact.salutation.toUpperCase()) : '') + contact.firstname + ' ' + contact.lastname,
                  value: contact.id,
                  info: contact.position + (contact.department ? ' - ' + contact.department : '')
                }
              })
            });

          }
        });
      }
    }
  }


  private loadBudgets(client_id: number | null | undefined) {
    this.budgetService.getBudgets({
      limit: 100000, order_by: 'name', order_dir: 'asc',
      include: ['client,contacts'],
      only_fields: ['budget.id', 'budget.available', 'budget.name',
        'contact.id', 'contact.lastname', 'contact.firstname',
        'client.id', 'client.name'],
      filters: client_id ? [{ key: 'client_id', value: client_id }] : []
    }).subscribe(res => {
      const budgets = this.budgetMappingService.budgetMultipleResponseToVM(res)?.list || [];
      this.translateService.get('administration.budgets.label.available').subscribe(tran => {
        this.translateService.get('common.salutation').subscribe(() => {
          this.budgetLK = budgets.map(a => {
            return {
              text: a.name + ' (' + tran + ': ' + this.formatService.formatCurrency(a.available) + ')',
              value: a.id,
              info: a.contacts?.length ? a.contacts.map(contact =>
                (contact.gender ? this.translateService.instant('common.salutation.' + contact.gender.toUpperCase()) : '') + contact.firstname + ' ' + contact.lastname).join(', ') : '-',
              data: a
            }
          });
        });
      });

    });
  }


}
