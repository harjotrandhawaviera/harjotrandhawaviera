import { AccountFilesDocumentList, AccountingFileSearchVM } from '../../model/accounting.model';
import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';

import { AccountingFacade } from '../+state/accounting.facade';
import { DatePipe } from '@angular/common';
import { FileExportService } from '../../services/file-export.service';
import { MY_FORMATS } from '../../model/date-format.model';
import { OptionVM } from '../../model/option.model';
import { Router } from '@angular/router';
import { TranslateService } from '../../services/translate.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-accounting-file-list',
  templateUrl: './accounting-file-list.component.html',
  styleUrls: ['./accounting-file-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AccountingFileListComponent implements OnInit {
  fileList: OptionVM | any;
  fileType: OptionVM | any;
  searchForm = new FormGroup({
    type: new FormControl(),
    start: new FormControl(),
    end: new FormControl()
  });
  noRecords$: Observable<boolean> = of(false);
  loading$: Observable<boolean> = of(false);
  result: any;
  searchModel: AccountingFileSearchVM = {};
  paginator: any;
  aggregation: any;
  aggregationFinal: number | undefined;
  displayedColumns = [
    'date',
    'type',
    'total',
    'bills',
    'reported_by',
    'file_size',
    'action'
  ];

  constructor(private accountingFacade: AccountingFacade,
              private router: Router,
              private translateService: TranslateService,
              private datePipe: DatePipe,
              private fileExportSvc: FileExportService) {}
  ngOnInit(): void {
    const pageIndex = 1;
    this.accountingFacade.loadAccountingfile({ pageIndex });
    this.accountingFacade.getLoadFileData$.subscribe((res: any) => {
      this.fileList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              value: a?.created_at,
              types: a?.type,
              total: a?.payment_total,
              bills: a?.invoice_count,
              text: a?.type,
              name: a?.creator?.data?.name,
              size: a?.document?.data?.size,
              document: a?.document
            };
          })
          : []
      );
      if ('data' in res) {
        this.result = res?.data;
        this.paginator = res?.meta?.pagination;
        this.aggregation = res.meta?.aggregates;
        this.aggregationFinal = Number(this.aggregation?.bills_total_sum) + this.aggregation?.assignments_billable_not_billed_total_sum;
      }
    });
    this.accountingFacade.getLoadFileData$.pipe(take(2)).subscribe((res: any) => {
      this.fileType = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              value: a?.type,
              types: a?.type,
              text: a?.type
            };
          })
          : []
      );
      this.fileType = this.removeDuplicates(this.fileType, 'types');
    });
    this.searchForm.get('type')?.valueChanges.subscribe((res) => {
      this.searchModel = { ...this.searchModel, type: res };
      this.accountingFacade.loadAccountingfile(this.searchModel);
    });
    this.searchForm.get('start')?.valueChanges.subscribe((res) => {
      const date = this.datePipe.transform(res, 'yyyy-MM-dd yy:hh:ss');
      this.searchModel = { ...this.searchModel, s_date: date };
      this.accountingFacade.loadAccountingfile(this.searchModel);
    });
    this.searchForm.get('end')?.valueChanges.subscribe((res) => {
      const date = this.datePipe.transform(res, 'yyyy-MM-dd yy:hh:ss');
      this.searchModel = { ...this.searchModel, e_date: date };
      this.accountingFacade.loadAccountingfile(this.searchModel);
    });
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.accountingFacade.loadAccountingfile(update);
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
  };

  download(document: AccountFilesDocumentList) {
    const url = document?.data?.url;
    const fileName = document?.data?.original_filename;
    const mimeType = document?.data?.mime;
    // @ts-ignore
    this.fileExportSvc.getDownload({ url, fileName, mimeType });
  }
  downloadList() {
    const fieldNames = Object.keys(this.fileList[0]).map((a) =>
      this.translateService.instant('accounting.files.table.' + a)
    );
    this.fileExportSvc.downloadCSV({ data: this.fileList, filePrefix: 'download', headerFields: fieldNames });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
}
