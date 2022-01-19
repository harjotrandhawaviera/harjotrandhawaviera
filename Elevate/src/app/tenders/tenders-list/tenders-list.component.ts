import * as fromTender from '../state/index';
import * as fromTenderAction from './../state/tender.actions';
import * as moment from 'moment';

import { Component, HostListener, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TenderExportVM, TenderSearchVM, TenderVM } from '../../model/tender.model';
import { take, takeWhile } from 'rxjs/operators';

import { AgentService } from '../../services/agent.service';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { JobService } from '../../services/job.service';
import { MY_FORMATS } from '../../model/date-format.model';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { TenderMappingService } from '../../services/mapping-services/tender-mapping.service';
import { TenderService } from '../../services/tender.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-tenders-list',
  templateUrl: './tenders-list.component.html',
  styleUrls: ['./tenders-list.component.scss'], providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class TendersListComponent implements OnInit {
  agentLK: OptionVM[] = [];
  stateLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  jobLK: OptionVM[] = [];
  hasFilter = false;
  componentActive = true;

  searchModel$: Observable<TenderSearchVM | undefined> = of({});
  searchModel: TenderSearchVM = {};
  result$: Observable<TenderVM[]> = of([]);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  jobId: any;

  searchForm = new FormGroup({
    agent: new FormControl(''),
    state: new FormControl(''),
    contractType: new FormControl(''),
    job: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    zipFrom: new FormControl(''),
    zipTo: new FormControl(''),
    search: new FormControl(''),
  });

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('tender.search');
  }

  constructor(
    private fileExportService: FileExportService,
    private store: Store<fromTender.State>,
    private agentService: AgentService,
    private contractTypesService: ContractTypesService,
    private jobService: JobService,
    private tenderService: TenderService,
    private tenderMappingService: TenderMappingService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.jobId = this.router.getCurrentNavigation()?.extras.state?.jobId;
  }

  ngOnInit(): void {
    this.getSelectedFilters();
    this.loadLookUps();

    this.loading$ = this.store.pipe(
      select(fromTender.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromTender.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromTender.getNoRecords),
      takeWhile(() => this.componentActive)
    );
    this.currentPage$ = this.store.pipe(
      select(fromTender.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromTender.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromTender.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromTender.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        if (
          res.agent ||
          res.state ||
          res.contractType ||
          res.job ||
          res.date_from ||
          res.date_to ||
          res.zip_from ||
          res.zip_to ||
          (res.search?.length && res.search?.length > 2)
        ) {
          this.hasFilter = true;
          this.store.dispatch(
            new fromTenderAction.LoadTenderList({ search: this.searchModel })
          );
        } else {
          this.hasFilter = false;
          this.store.dispatch(new fromTenderAction.LoadTenderListFailed(null));
        }
      } else {
        const searchModel: TenderSearchVM = {
          pageIndex: 1,
          pageSize: 12,
          sortBy: 'appointed_at',
        };
        this.store.dispatch(new fromTenderAction.UpdateSearch(searchModel));
      }
    });

    this.searchForm.get('agent')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, agent: res };
      this.store.dispatch(new fromTenderAction.UpdateSearch(update));
    });
    this.searchForm.get('state')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, state: res };
      this.store.dispatch(new fromTenderAction.UpdateSearch(update));
    });
    this.searchForm.get('contractType')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, contractType: res };
      this.store.dispatch(new fromTenderAction.UpdateSearch(update));
    });
    if (this.jobId) {
      this.searchForm.get('job')?.patchValue(this.jobId);
      const update = { ...this.searchModel, pageIndex: 1, job: this.jobId };
      this.store.dispatch(new fromTenderAction.UpdateSearch(update));
    } else {
      this.searchForm.get('job')?.valueChanges.subscribe((res) => {
        const update = { ...this.searchModel, pageIndex: 1, job: res };
        this.store.dispatch(new fromTenderAction.UpdateSearch(update));
      });
    }
    this.searchForm.get('dateFrom')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          date_from: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.store.dispatch(new fromTenderAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          date_from: undefined,
        };
        this.store.dispatch(new fromTenderAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('dateTo')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          date_to: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.store.dispatch(new fromTenderAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          date_to: undefined,
        };
        this.store.dispatch(new fromTenderAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('zipFrom')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, zip_from: res };
      this.store.dispatch(new fromTenderAction.UpdateSearch(update));
    });
    this.searchForm.get('zipTo')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, zip_to: res };
      this.store.dispatch(new fromTenderAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromTenderAction.UpdateSearch(update));
      }
    });
  }

  getSelectedFilters() {
    const previous = this.storageService.get('tender.search');
    if (previous !== null) {
      const { agent, state, contractType, job, date_from, date_to, zip_from, zip_to, search } =
        JSON.parse(previous) as TenderSearchVM;
      this.searchForm.patchValue({
        agent: agent,
        state: state,
        contractType: contractType,
        job: job,
        date_from: date_from,
        date_to: date_to,
        zip_from: zip_from,
        zip_to: zip_to,
        search: search,
      });
    } else {
      const searchModel: TenderSearchVM = {
        pageIndex: 1,
        pageSize: 12,
        sortBy: 'appointed_at',
      };
      this.store.dispatch(new fromTenderAction.UpdateSearch(searchModel));
    }
  }

  loadLookUps() {
    this.agentService.getAgentsLK().subscribe((res) => {
      this.agentLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: [a.lastname, a.firstname].join(' '),
              };
            })
          : []
      );
    });

    this.translateService.get('contracts').subscribe((p) => {
      this.contractTypesService.getContractTypes({}).subscribe((res) => {
        this.contractTypeLK = this.sortOption(
          res.data
            ? res.data.map((a) => {
                return {
                  value: a.id,
                  text: this.translateService.instant(
                    'contracts.identifier.' + a.identifier
                  ),
                };
              })
            : []
        );
      });
    });

    this.jobService.getJobsLK().subscribe((res) => {
      this.jobLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.title,
              };
            })
          : []
      );
    });

    this.translateService
      .get('tenders.tender.state')
      .subscribe((a) => {
        this.stateLK = FormConfig.tenders.state.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'tenders.tender.state.' + a
            ),
          };
        });
      });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromTenderAction.UpdateSearch(update));
  }

  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.tenderMappingService.searchRequest(model);
        this.tenderService
          .getTenders({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const { list } = this.tenderMappingService.tenderSearchResponseToVM(res);
            const exportList: TenderExportVM[] = [];
            if (list && list.length > 0) {
              console.log(list)
              list.forEach((tender) => {
                exportList.push({
                  jobTitle: tender.job_name || '',
                  clientName: tender.client_name || '',
                  start_date: tender.job_advert_start_date || '',
                  finish_date: tender.job_advert_end_date || '',
                  siteName: tender.job_location || '',
                  status: tender.job_status || '',
                  publishedAt: tender.job_advert_start_date_time || '',
                  invalidAt: tender.job_advert_end_date_time || '',
                  staff_manager: tender.staff_manager || '',
                  role: tender.role_name || '',
                  staff_count: tender.staff_count || '',
                  days: tender.days || ''
                });
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('tenders.tenders.table.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'tenders_table',
              });
            }
          });
      }
    });
  }

}
