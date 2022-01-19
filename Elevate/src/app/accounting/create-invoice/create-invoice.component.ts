import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AccountingFacade } from '../+state/accounting.facade';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  accountingNewForm = new FormGroup({});
  result: any = of([]);
  displayedColumns = ['select', 'jobname', 'term', 'start', 'end', 'reported_times', 'comment', 'cost_customer', 'correction', 'mission_report'];
  selection = new SelectionModel<any>(true, []);
  constructor(private route: ActivatedRoute, private accountingFacade: AccountingFacade) { }

  ngOnInit(): void {
    this.accountingNewForm = new FormGroup({
      billId: new FormControl(),
      dateFrom: new FormControl(),
      comment: new FormControl(),
      assignment_ids: new FormArray([])
    });
    const params = this.route.snapshot.queryParams;
    const clientId = params.client;
    const dateTo = params.start;
    const dateFrom = params.end;
    this.accountingFacade.createInvoiceGrids({ clientId, dateTo, dateFrom});
  }

  downloadReport(id: number, filename?: string) { }

}
