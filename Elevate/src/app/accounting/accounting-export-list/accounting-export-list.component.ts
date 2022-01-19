import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';

import { AccountExportSearch } from '../../model/accounting.model';
import { AccountingFacade } from '../+state/accounting.facade';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { FileExportService } from '../../services/file-export.service';
import { MY_FORMATS } from '../../model/date-format.model';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-accounting-export-list',
  templateUrl: './accounting-export-list.component.html',
  styleUrls: ['./accounting-export-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AccountingExportListComponent implements OnInit {
  totalAmount: any;
  exportList: OptionVM | any;
  accountList: OptionVM | any;
  searchForm = new FormGroup({
    type: new FormControl(),
    start: new FormControl(),
    end: new FormControl()
  });
  noRecords$: Observable<boolean> = of(false);
  loading$: Observable<boolean> = of(false);
  result: any;
  searchModel: AccountExportSearch = {};
  paginator: any;
  selection = new SelectionModel(true);
  displayedColumns = [
    'No',
    'billNumber',
    'name',
    'amount',
    'payment',
    'tax',
    'comment'
  ];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private accountingFacade: AccountingFacade,
    private dialog: MatDialog,
    private fileExportService: FileExportService
  ) {
  }
  ngOnInit(): void {
    this.accountingFacade.loadExportListData();
    this.translateService.get('accounting').subscribe(() => {
    this.accountingFacade.getExportListData$.subscribe((res: any) => {
      this.exportList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              value: a.number,
              name: a.freelancer_name,
              amount: a.payment_total,
              comment: a.comment,
              date: a.payment_target,
              taxes: this.translateService.instant( 'accounting.taxes.' + a.includes_taxes),
            };
          })
          : []
      );
    });
    });
    this.accountingFacade.loadExportListSearchData();
    this.accountingFacade.getExportListSearchData$.subscribe((res: any) => {
      this.accountList = this.sortOption(
        res.data
          ? res.data.map((b: any) => {
            return {
              text: b.type,
              value: b.type
            };
          })
          : []
      );
      this.accountList = this.removeDuplicates(this.accountList, 'text');
    });
    this.searchForm.get('type')?.valueChanges.subscribe((res) => {
     const update = { ...this.searchModel, type: res };
     this.accountingFacade.loadExportListData( update );
    });
    this.searchForm.get('start')?.valueChanges.subscribe((res) => {
      if (res) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          payment_target_from: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.accountingFacade.loadExportListData( update );
      }
    });
    this.searchForm.get('end')?.valueChanges.subscribe((res) => {
      if (res) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          payment_target_to: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.accountingFacade.loadExportListData( update );
      }
    });
  }

  removeDuplicates = (originalArray: any, objKey: any) => {
    const trimmedArray = [];
    const values = [];
    let value;
    for (let i = 0; i < originalArray.length; i++) {
      value = originalArray[i][objKey];

      if (values.indexOf(value) === -1) {
        trimmedArray.push(originalArray[i]);
        values.push(value);
      }
    }
    return trimmedArray;
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.exportList.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.exportList.forEach((row: any) => this.selection.select( row ));
  }
  confirmModal() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent,{
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'accounting.export.sepa.export.title'
        ),
        message: this.translateService.instant(
          'accounting.export.sepa.export.message'
        ),
        cancelCode: 'accounting.bills.buttons.cancel' ,
        confirmCode: 'accounting.export.buttons.export',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.downloadList();
    });
  }

  downloadList() {
    const fieldNames = Object.keys(this.exportList).map((a) =>
      this.translateService.instant('pos.files.table.' + a)
    );
    this.fileExportService.downloadCSV({ data: this.selection.selected, filePrefix: 'accounting', headerFields: fieldNames });
  }

  getTotal(value: any[]) {
    // @ts-ignore
    return value.reduce((acc, {amount}) => acc += +(amount || 0), 0);
  }
}
