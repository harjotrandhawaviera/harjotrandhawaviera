import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import { AccountingFacade } from '../+state/accounting.facade';
import { of } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountingService } from '../../services/accounting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounting-edit-details',
  templateUrl: './accounting-edit-details.component.html',
  styleUrls: ['./accounting-edit-details.component.scss']
})
export class AccountingEditDetailsComponent implements OnInit {
  result: any = of([]);
  id = '';
  metaData: any = of([]);
  displayedColumns = ['select', 'jobname', 'term', 'start', 'end', 'reported_times', 'comment', 'cost_customer', 'correction', 'mission_report'];
  selection = new SelectionModel<any>(true, []);
  selectionList = 0;
  // tslint:disable-next-line:variable-name
  assignment_ids: any = of([]);
  accountingEditForm = new FormGroup({});
  costingCustomer = 0;
    editData: any = of([]);
  constructor(private accountingFacade: AccountingFacade,
              private accountingSvc: AccountingService,
              private router: Router
            ) { }

  ngOnInit(): void {
    this.accountingEditForm = new FormGroup({
      billId: new FormControl(),
      dateFrom: new FormControl(),
      comment: new FormControl(),
      assignment_ids: new FormArray([])
    });
    this.accountingFacade.getAccountEditData$.subscribe((response: any) => {
      this.editData = response;
      this.accountingEditForm.patchValue({
          billId: response?.data?.number,
          dateFrom: new Date(response?.data?.issued_at),
          comment: response?.data?.comment
        });
      this.id = response?.data?.id;
      this.assignment_ids = response?.data?.assignment_ids;
      this.assignment_ids.forEach((res: any) => this.control.push(new FormControl(res)));
      this.selectionList = this.assignment_ids.length;
    });

    this.accountingFacade.getEditDisplayRecord$.subscribe((res) => {
      if ('data' in res) {
        this.result = res?.data;
        this.metaData = res?.meta;
        this.costingCustomer = this.metaData.planned_sum;
        this.result = this.result.map((response: any) => {
          const lastArrayPick = response.documents?.data?.slice(-1);
          response = { ...response, documentId: lastArrayPick[0]?.id, documentName: lastArrayPick[0]?.original_filename };
          return response;
        });
      }
    });
    this.accountingEditForm.valueChanges.subscribe((res) => {
      if (res.assignment_ids) {
        const selectionIds = res.assignment_ids.filter((checked: any) => checked !== false);
        this.selectionList = selectionIds.length;
        // tslint:disable-next-line:no-shadowed-variable
        const indexValue = res.assignment_ids.findIndex((res: any) => res === false);
        if (indexValue !== -1) {
          const anc = this.result[indexValue].planned_costs;
          if (this.costingCustomer !== this.metaData.planned_sum) {
            this.costingCustomer = this.costingCustomer - anc;
          }else {
            this.costingCustomer = this.metaData.planned_sum - anc;
          }
        }
        else {
          this.costingCustomer = this.metaData.planned_sum;
        }
      }
    });
  }

  get control() {
    return this.accountingEditForm.get('assignment_ids') as FormArray;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.result.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.result.forEach((row: any) => this.selection.select(row));
  }

  downloadReport(id: number, filename?: string) {
    this.accountingSvc.downloadReports(id).subscribe((res) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(res);
      a.href = url;
      if (filename != null) {
        a.download = filename;
        a.click();
      }
    });
  }

  saveDetail(){
    const allValue = this.accountingEditForm.value;
    const assignmentValue = this.accountingEditForm.value.assignment_ids;
    const finalValue = assignmentValue.map((res: any, index: number) => {
      if (res === true) {
        res = this.assignment_ids[index];
        return res;
      }
      else {
        return res;
      }
    });
    const removeUncheckData = finalValue.filter((res: any) => res !== false);
    this.accountingEditForm.value.assignment_ids = removeUncheckData;
    const postValue = {
      assignment_ids: removeUncheckData,
      classes: '',
      client: this.editData?.data.client,
      clientName: this.editData?.data?.client?.data?.name,
      client_id: this.editData?.data?.client_id,
      comment: this.accountingEditForm.value?.comment,
      issuedAt: this.accountingEditForm.value.dateFrom,
      issued_at: this.editData?.data?.issued_at,
      number: this.accountingEditForm.value.billId,
      total: this.editData?.data?.total,
      totalSum: this.editData?.data?.total
    };

    this.accountingFacade.updateInvoiceValue(Number(this.id), postValue);
    this.router.navigate(['accounting', 'invoices']);
  }

  cancelEdit() {
    if (this.id) {
      this.router.navigate(['/accounting/invoices', this.id]);
    } else {
      this.router.navigate(['/accounting/invoices']);
    }
  }

}
