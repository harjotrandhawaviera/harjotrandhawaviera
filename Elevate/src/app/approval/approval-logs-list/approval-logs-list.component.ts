import * as fromApproval from './../state';
import * as fromApprovalAction from './../state/approval.actions';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventLogExportVM, EventLogSearchVM, EventLogVM } from './../../model/event-log.model';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { ApprovalRequestMappingService } from './../../services/mapping-services/apparoval-request-mapping.service';
import { ApprovalRequestService } from '../../services/approval-request.service';
import { EventLogMappingService } from '../../services/mapping-services/event-log-mapping.service';
import { EventLogService } from './../../services/event-log.service';
import { FileExportService } from './../../services/file-export.service';
import { FormatService } from './../../services/format.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-approval-logs-list',
  templateUrl: './approval-logs-list.component.html',
  styleUrls: ['./approval-logs-list.component.scss']
})
export class ApprovalLogsListComponent implements OnInit {
  result$: Observable<EventLogVM[]> = of([]);
  searchModel$: Observable<EventLogSearchVM | undefined> = of(undefined);
  componentActive = true;
  searchModel: EventLogSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  displayedColumns = ['createdAt', 'performer_name', 'message'];
  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private eventLogMappingService: EventLogMappingService,
    private eventLogService: EventLogService,
    private fileExportService: FileExportService,
    private formatService: FormatService,
    private store: Store<fromApproval.State>
  ) { }

  ngOnInit(): void {

    this.loading$ = this.store.pipe(
      select(fromApproval.getEventLogLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromApproval.getEventLogSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromApproval.getEventLogNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromApproval.getEventLogCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromApproval.getEventLogTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromApproval.getEventLogPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromApproval.getEventLogSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.subscribeSearch();
  }
  subscribeSearch() {
    this.searchModel$.subscribe((res) => {
      if (res && JSON.stringify({}) !== JSON.stringify(res)) {
        this.searchModel = res;
        this.store.dispatch(
          new fromApprovalAction.LoadEventLogList(this.searchModel)
        );
      } else {
        const searchModel: EventLogSearchVM = {
          pageIndex: 1,
          pageSize: 25,
        };
        this.store.dispatch(new fromApprovalAction.UpdateEventLogSearch(searchModel));
      }
    });
  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromApprovalAction.UpdateEventLogSearch(update));
  }
  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.eventLogMappingService.searchRequest(model);
        this.eventLogService
          .getEventLogs({
            include: searchModel.include,
            filters: searchModel.filters,
            limit: 1000000,
            page: 1
          })
          .subscribe((res) => {
            const {
              list,
            } = this.eventLogMappingService.eventLogMultipleResponseToVM(res);
            const exportList: EventLogExportVM[] = [];
            if (list && list.length > 0) {
              list.forEach((log) => {
                const obj: EventLogExportVM = {
                  performer_name: log.performer_name || '',
                  createdAt: log.created_at ? this.formatService.date(log.created_at, true) : '',
                  message: log.message || ''
                };
                exportList.push(obj);
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('approval.logs.data-changed.list.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'event_log_table',
              });
            }
          });
      }
    });
  }
}
