import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { BudgetVM } from '../../model/budget.model';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-budget-detail-view, [app-budget-detail-view]',
  templateUrl: './budget-detail-view.component.html',
  styleUrls: ['./budget-detail-view.component.scss']
})
export class BudgetDetailViewComponent implements OnInit, OnChanges {
  @Input()
  budget: BudgetVM | undefined;
  constructor(private translateService: TranslateService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.budget) {
      this.translateService.get('common.salutation').subscribe(() => {
        if (this.budget && this.budget.contacts) {
          this.budget.contacts.map(contact => {
            contact.fullname = (contact.salutation ? this.translateService.instant('common.salutation.' + contact.salutation.toUpperCase()) : '') + contact.firstname + ' ' + contact.lastname;
            contact.filterdescription = contact.position + (contact.department ? ' - ' + contact.department : '');
          });
        }
      })

    }
  }

  ngOnInit(): void {
  }

}
