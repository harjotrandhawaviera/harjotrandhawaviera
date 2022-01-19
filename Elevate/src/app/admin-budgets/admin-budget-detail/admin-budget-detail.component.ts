import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BudgetMappingService } from './../../services/mapping-services/budget-mapping.service';
import { BudgetService } from './../../services/budget.service';
import { BudgetVM } from '../../model/budget.model';

@Component({
  selector: 'app-admin-budget-detail',
  templateUrl: './admin-budget-detail.component.html',
  styleUrls: ['./admin-budget-detail.component.scss']
})
export class AdminBudgetDetailComponent implements OnInit {
  budget: BudgetVM | undefined;
  budgetId: number | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private budgetService: BudgetService,
    private budgetMappingService: BudgetMappingService
  ) { }

  ngOnInit(): void {
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

}
