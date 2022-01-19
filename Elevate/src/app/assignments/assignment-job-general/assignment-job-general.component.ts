import * as fromAssignment from './../state';
import * as fromAssignmentAction from './../state/assignment.actions';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AgentVM } from '../../model/agent.model';
import { AssignmentVM } from '../../model/assignment.model';
import { BudgetVM } from '../../model/budget.model';
import { DatesVM } from '../../model/dates.model';
import { JobVM } from '../../model/job.model';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-assignment-job-general',
  templateUrl: './assignment-job-general.component.html',
  styleUrls: ['./assignment-job-general.component.scss']
})
export class AssignmentJobGeneralComponent implements OnInit, OnChanges {

  @Input() assignment: AssignmentVM | undefined;
  @Input() job: any;
  @Input() mode: string | undefined;

  componentActive = true;
  budgetId?: number;
  clientId?: number;
  budgetDetail$: Observable<BudgetVM | undefined> = of(undefined);
  budgetContactNames: string | undefined;

  constructor(
    private store: Store<fromAssignment.State>,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.assignment) {
      this.budgetId = this.assignment?.budget_id;
      if (this.budgetId && this.clientId) {
        this.store.dispatch(
          new fromAssignmentAction.LoadBudgetDetail(this.clientId)
        );
      }
    }
  }

  ngOnInit(): void {
    this.budgetDetail$ = this.store.pipe(
      select(fromAssignment.getBudgetDetail),
      takeWhile(() => this.componentActive)
    );
    this.budgetDetail$.subscribe((res) => {
      if (res && res.data) {
        const contacts = res.data[0].contacts.data;
        if (contacts) {
          this.budgetContactNames = contacts?.map((c: any) => c.fullname).join(',');
        }
      }
    });
  }

}
