import { Component, OnInit } from '@angular/core';
import { AccountingFacade } from '../+state/accounting.facade';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountingDetailExportVM, AccountingSearchVM } from '../../model/accounting.model';
import { TranslateService } from '../../services/translate.service';
import { FileExportService } from '../../services/file-export.service';

@Component({
  selector: 'app-accounting-details',
  templateUrl: './accounting-details.component.html',
  styleUrls: ['./accounting-details.component.scss']
})
export class AccountingDetailsComponent implements OnInit {
  mode?: string;
  paramId: string = '';
  data: any;
  meta: any;
  result: any = of([]);
  displayedColumns = ['jobname', 'term', 'start', 'end', 'reported_times', 'expert_advisor', 'comment', 'cost_customer', 'correction'];
  hasFilter = false;
  noRecords$: Observable<boolean> = of(false);
  loading$: Observable<boolean> = of(false);
  searchModel: AccountingSearchVM = {};
  paginator: any;
  constructor(private accountingFacade: AccountingFacade,
              private route: ActivatedRoute,
              private translateService: TranslateService,
              private fileExportService: FileExportService
            ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.accountingFacade.loadEditAccountData(this.paramId);
    this.accountingFacade.getAccountEditData$.subscribe((res ) => {
      if ('data' in res && res?.data){
        this.data = res?.data;
      }
    });

    this.loading$ = this.accountingFacade.getLoading$;

    this.accountingFacade.loadEditAccountListData(this.paramId);
    this.accountingFacade.getEditDisplayRecord$.subscribe((ress) => {
      if ('data' in ress) {
        this.result = ress?.data;
        this.paginator = ress?.meta?.pagination;
      }
    });
  }

  download() {
    const update = true;
    this.accountingFacade.exportDetailList(this.paramId, update);
    this.accountingFacade.getExportDetailData$.subscribe((res) => {
      if ('data' in res) {
        const exportDetailList: AccountingDetailExportVM[] = [];
        const exportDetailData = res.data;
        exportDetailData.forEach((list: any) => {
          exportDetailList.push({
            jobname: list?.date?.data?.job?.data?.title || null,
            appointed_at: list.appointed_at || null,
            start_time: list.start_time || null,
            finish_time: list.finish_time || null,
            reported_times: list.start_time || null + '-' + list.finish_time || null,
            expert_advisor: list.freelancers.data[0].fullname || null,
            comment: list.comment || null,
            cost_customer: list.planned_costs.toString(),
            correction: list.title || null
          });
        });
        const fieldNames = Object.keys(exportDetailList[0]).map((a) =>
          this.translateService.instant('accounting.table.' + a)
        );
        this.fileExportService.downloadCSV({
          headerFields: fieldNames,
          data: exportDetailList,
          filePrefix: 'accounting_table',
        });
      }
    });
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.accountingFacade.loadEditAccountListData(this.paramId, update);

  }

}
