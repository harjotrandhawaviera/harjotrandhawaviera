import { Component, Input, OnInit } from '@angular/core';

import { BudgetVM } from '../../model/budget.model';
import { JobVM } from '../../model/job.model';

@Component({
  selector: 'app-job-detail-general',
  templateUrl: './job-detail-general.component.html',
  styleUrls: ['./job-detail-general.component.scss']
})
export class JobDetailGeneralComponent implements OnInit {

  @Input() job: JobVM | undefined | null;
  @Input() budget: BudgetVM | undefined | null;
  @Input() budgetContactNames: string | undefined;
  @Input() mode: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
