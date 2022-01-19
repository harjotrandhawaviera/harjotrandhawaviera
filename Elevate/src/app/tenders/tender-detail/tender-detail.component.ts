import * as fromTender from './../state';
import * as fromTenderAction from './../state/tender.actions';
import * as fromUser from './../../root-state/user-state';
import * as moment from 'moment';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TenderLogExportVM, TenderVM } from '../../model/tender.model';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { FileExportService } from '../../services/file-export.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-tender-detail',
  templateUrl: './tender-detail.component.html',
  styleUrls: ['./tender-detail.component.scss']
})
export class TenderDetailComponent implements OnInit {
  componentActive = true;
  id?: string | null;
  mode?: string;

  tenderDetail$: Observable<TenderVM | undefined> = of(undefined);
  tenderDetailWithLogs$: Observable<TenderVM | undefined> = of(undefined);
  hasFullAccess$: Observable<boolean> = of(false);
  viewLogsPermission$: Observable<boolean> = of(false);
  loading$: Observable<boolean> = of(true);
  deletedAt: string | undefined;
  publishedAt: string | undefined;
  invalidAt: string | undefined;
  logs: any;
  isLogVisible = false;
  role_id?: string | null;

  displayedColumns = [
    'timestamp',
    'performer_name',
    'message',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromTender.State>,
    private userStore: Store<fromUser.State>,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private fileExportService: FileExportService,
  ) { }

  ngOnInit(): void {
    this.retrieveIdFromParameters();
    this.tenderDetail$ = this.store.pipe(
      select(fromTender.getTenderDetail),
      takeWhile(() => this.componentActive)
    );

    this.tenderDetailWithLogs$ = this.store.pipe(
      select(fromTender.getTenderDetailWithLogs),
      takeWhile(() => this.componentActive)
    );
    this.loading$ = this.store.pipe(
      select(fromTender.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.tenderDetail$.subscribe((res) => {
      if (res) {
        this.deletedAt = moment.utc(res.deleted_at).local().format('DD.MM.YYYY, HH:MM');
        this.publishedAt = moment.utc(res.job_advert_start_date_time).local().format('DD.MM.YYYY, HH:MM');
        this.invalidAt = moment.utc(res.job_advert_end_date_time).local().format('DD.MM.YYYY, HH:MM');
        this.logs = res.logs;
      }
    });

    this.hasFullAccess$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['manage-projects'],
      }),
      takeWhile(() => this.componentActive)
    );

    this.viewLogsPermission$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['view-logs'],
      }),
      takeWhile(() => this.componentActive)
    );
  }

  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.mode = res.mode;
    });
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.loadDetail(params);
    });
  }

  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id');
      this.role_id = params.get('role_id');
      if (this.id) {
        this.store.dispatch(
          new fromTenderAction.LoadTenderDetail({ id: this.id, role_id: this.role_id, mode: 'detail' })
        );
      }
    }
  }

  deleteRecord(tender: TenderVM) {
    if (tender.job_advertisement_id && tender.staff_role_id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'tenders.tenders.table.close.title'
          ),
          message: this.translateService.instant(
            'tenders.tenders.table.close.message'
          ),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'tenders.tenders.table.actions.close',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && tender.job_advertisement_id) {
          this.store.dispatch(
            new fromTenderAction.DeleteTender({id: tender.job_advertisement_id, role_id: tender.staff_role_id})
          );
        }
      });
    }
  }

  showLogs() {
    if (this.id) {
      this.store.dispatch(
        new fromTenderAction.LoadTenderDetailWithLogs({ id: this.id, mode: 'logs-detail' })
      );
    }
    this.isLogVisible = true;
  }

  downloadLogs() {
    const exportList: TenderLogExportVM[] = [];
    if (this.logs && this.logs.length > 0) {
      this.logs.forEach((log: any) => {
        exportList.push({
          timestamp: log?.created_at || '',
          performer_name: log?.performer_name || '',
          message: log?.message || '',
        });
      });
      const fieldNames = Object.keys(exportList[0]).map((a) =>
        this.translateService.instant('ui.logs-table.' + a)
      );
      this.fileExportService.downloadCSV({
        headerFields: fieldNames,
        data: exportList,
        filePrefix: 'tender_logs_table',
      });
    }
  }

}
