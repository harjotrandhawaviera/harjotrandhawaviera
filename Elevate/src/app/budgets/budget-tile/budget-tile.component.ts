import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BudgetVM } from '../../model/budget.model';

@Component({
  selector: 'app-budget-tile',
  templateUrl: './budget-tile.component.html',
  styleUrls: ['./budget-tile.component.scss']
})
export class BudgetTileComponent implements OnInit {
  @Input()
  budget: BudgetVM | undefined;
  @Input()
  canDelete = false;
  @Input()
  canViewDetail = true;
  @Output() gotoDetail = new EventEmitter();
  @Output() deleteBudget = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  gotoDetailClick() {
    this.gotoDetail.emit();
  }
  deleteClick() {
    this.deleteBudget.emit();
  }
}
