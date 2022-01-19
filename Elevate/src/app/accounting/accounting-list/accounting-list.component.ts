import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountingFacade } from '../+state/accounting.facade';
import { OptionVM } from '../../model/option.model';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Accounting, AccountingExportVM, AccountingSearchVM } from '../../model/accounting.model';
import { TranslateService } from '../../services/translate.service';
import { FileExportService } from '../../services/file-export.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-accounting-list',
  templateUrl: './accounting-list.component.html',
  styleUrls: ['./accounting-list.component.scss']
})
export class AccountingListComponent implements OnInit {
    accountList: OptionVM | any;
  searchForm = new FormGroup({
    client: new FormControl(),
    search: new FormControl()
  });
  noRecords$: Observable<boolean> = of(false);
  loading$: Observable<boolean> = of(false);
  result: any;
  searchModel: AccountingSearchVM = {};
  paginator: any;
  aggregation: any;
  aggregationFinal: number | undefined;
  displayedColumns = [
    'billno',
    'invoice_amt',
    'could',
    'comment',
    'action'
  ];
  constructor(private accountingFacade: AccountingFacade,
              private router: Router,
              private translateService: TranslateService,
              private fileExportService: FileExportService,
              private dialog: MatDialog
            ) { }

  ngOnInit(): void {
    this.accountingFacade.loadAccounting();
    this.accountingFacade.loadAccountingSearchList();
    this.accountingFacade.getAccountList$.subscribe((res: any) => {
      this.accountList = this.ion(
        res.data
          ? res.data.map((a: any) => {
            return {
              value: a.id,
              text: a.name,
            };
          })
          : []
      );
    });
    this.loading$ = this.accountingFacade.getLoading$;
    this.accountingFacade.getAccountSearchList$.subscribe((res) => {
      if ('data' in res) {
        this.result = res?.data;
        this.paginator = res?.meta?.pagination;
        this.aggregation = res.meta?.aggregates;
        this.aggregationFinal = Number(this.aggregation?.bills_total_sum) + this.aggregation?.assignments_billable_not_billed_total_sum;
      }
    });

    this.searchForm.get('client')?.valueChanges.subscribe((res) => {
      this.searchModel = { ...this.searchModel, pageIndex: 1, client: res};
      this.accountingFacade.loadUpdateAccountingSearchList(this.searchModel);
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchModel = { ...this.searchModel, pageIndex: 1, search: res };
        this.accountingFacade.loadUpdateAccountingSearchList(this.searchModel);
      }
    });
  }

  ion(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  download() {
    const update = true;
    this.accountingFacade.exportList(update);
    this.accountingFacade.getExportData$.subscribe((res) => {
      if ('data' in res) {
        const exportList: AccountingExportVM[] = [];
        const exportData = res.data;
        // tslint:disable-next-line:no-unused-expression
        exportData.forEach((list: any) => {
          exportList.push({
            number: list?.number,
            total: list.total,
            client: list?.client?.data?.name,
            comment: list.comment
          });
        });
        const fieldNames = Object.keys(exportList[0]).map((a) =>
          this.translateService.instant('accounting.table.' + a)
        );
        this.fileExportService.downloadCSV({
          headerFields: fieldNames,
          data: exportList,
          filePrefix: 'accounting_table',
        });
      }
    });
  }

  navigateToDetail(row: Accounting){
    this.router.navigate(['accounting', 'invoices', row.id]);
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.accountingFacade.loadUpdateAccountingSearchList(update);
  }

  deleteConfirmModal(row: Accounting) {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'accounting.bills.table.remove.title'
        ),
        message: this.translateService.instant(
          'accounting.bills.table.remove.message'
        ),
        cancelCode: 'accounting.bills.buttons.cancel',
        confirmCode: 'accounting.bills.table.actions.remove',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        const id = row?.id;
        this.accountingFacade.deleteInvoice(id);
        this.accountingFacade.loadAccountingSearchList();
      }
    });
  }

}
