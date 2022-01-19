import * as fromDates from '../state/index';
import * as fromDatesAction from './../state/dates.actions';
import * as moment from 'moment';

import { Component, HostListener, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatesExportVM, DatesSearchVM, DatesVM } from '../../model/dates.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AgentService } from '../../services/agent.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { DatesMappingService } from '../../services/mapping-services/dates-mapping.service';
import { DatesService } from '../../services/dates.service';
import { FileExportService } from '../../services/file-export.service';
import { JobService } from '../../services/job.service';
import { MY_FORMATS } from '../../model/date-format.model';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { SearchRequestVM } from '../../model/search.model';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-date-list',
  templateUrl: './date-list.component.html',
  styleUrls: ['./date-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],

})
export class DateListComponent implements OnInit {
  agentLK: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  jobLK: OptionVM[] = [];
  jobId: any;
  hasFilter = true;
  componentActive = true;

  searchModel$: Observable<DatesSearchVM | undefined> = of({});
  searchModel: DatesSearchVM = {};
  result$: Observable<DatesVM[]> = of([]);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  displayedColumns = [
    'id',
    'jobtitle',
    'appointedAt',
    'role_name',
    'shift_name',
    'start_time',
    'finish_time',
    'action'
  ];
  startDate: any;
  searchForm = new FormGroup({
    agent: new FormControl(''),
    project: new FormControl(''),
    job: new FormControl(''),
    dateFrom: new FormControl(null),
    dateTo: new FormControl(null),
  });

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('dates.search');
  }

  constructor(
    private fileExportService: FileExportService,
    private store: Store<fromDates.State>,
    private agentService: AgentService,
    private projectService: ProjectService,
    private jobService: JobService,
    private datesService: DatesService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private datesMappingService: DatesMappingService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.jobId = this.router.getCurrentNavigation()?.extras.state?.jobId;
  }

  ngOnInit(): void {
    this.getSelectedFilters();
    this.loadLookUps();

    this.loading$ = this.store.pipe(
      select(fromDates.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromDates.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromDates.getNoRecords),
      takeWhile(() => this.componentActive)
    );
    this.currentPage$ = this.store.pipe(
      select(fromDates.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromDates.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromDates.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromDates.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        if (res.agent || res.project || res.job || res.dateFrom || res.dateTo) {
          this.hasFilter = true;
          this.store.dispatch(
            new fromDatesAction.LoadDatesList(this.searchModel)
          );
        } else {
          this.hasFilter = true;
          this.store.dispatch(
            new fromDatesAction.LoadDatesList(this.searchModel)
          );
        }
      } else {
        const searchModel: DatesSearchVM = {
          pageIndex: 1,
          pageSize: 25,
          sortBy: 'title',
          sortDir: 'asc',
        };
        this.store.dispatch(new fromDatesAction.UpdateSearch(searchModel));
      }
    });
    this.searchForm.get('agent')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, agent: res };
      this.store.dispatch(new fromDatesAction.UpdateSearch(update));
    });
    this.searchForm.get('project')?.valueChanges.subscribe((res) => {
      if (res) {
        const update = { ...this.searchModel, pageIndex: 1, project: res };
        this.store.dispatch(new fromDatesAction.UpdateSearch(update));
        this.getJobsByProject(res);
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          project: undefined,
        };
        this.store.dispatch(new fromDatesAction.UpdateSearch(update));
      }
    });
    if (this.jobId) {
      this.searchForm.get('job')?.patchValue(this.jobId);
      const update = { ...this.searchModel, pageIndex: 1, job: this.jobId };
      this.store.dispatch(new fromDatesAction.UpdateSearch(update));
    }
    this.searchForm.get('job')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, job: res };
      this.jobId = res;
      this.store.dispatch(new fromDatesAction.UpdateSearch(update));
    });
    this.searchForm.get('dateFrom')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        this.startDate = res;
        this.onDateChange();
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateFrom: moment(res).format('YYYY-MM-DD') + ' 00:00:01',
        };
        this.store.dispatch(new fromDatesAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateFrom: undefined,
        };
        this.store.dispatch(new fromDatesAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('dateTo')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateTo: moment(res).format('YYYY-MM-DD') + ' 23:59:59',
        };
        this.store.dispatch(new fromDatesAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateTo: undefined,
        };
        this.store.dispatch(new fromDatesAction.UpdateSearch(update));
      }
    });
  }

  getJobsByProject(id: string) {
    const searchRequest: SearchRequestVM = {};
    searchRequest.limit = 100000;
    searchRequest.order_by = 'title';
    searchRequest.only_fields = ['job.id', 'job.title'];
    searchRequest.filters = [{ key: 'project_id', value: id }];

    this.jobService.getJobs(searchRequest).subscribe((res) => {
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
  }

  getSelectedFilters() {
    const previous = this.storageService.get('dates.search');
    if (previous !== null) {
      const { agent, project, job, dateFrom, dateTo } = JSON.parse(
        previous
      ) as DatesSearchVM;
      this.searchForm.patchValue({
        agent: agent,
        project: project,
        job: job,
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
    } else {
      const searchModel: DatesSearchVM = {
        pageIndex: 1,
        pageSize: 50,
        sortBy: 'appointed_at',
        sortDir: 'asc',
      };
      this.store.dispatch(new fromDatesAction.UpdateSearch(searchModel));
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

    this.translateService.get('projects').subscribe((p) => {
      this.translateService.get('common').subscribe((c) => {
        this.projectService.getProjectsLK().subscribe((res) => {
          this.projectLK = this.sortOption(
            res.data
              ? res.data.map((a) => {
                  const info =
                    this.translateService.instant(
                      'projects.fields.state.' + a.state
                    ) +
                    (a.state === 'active'
                      ? ' ' +
                        this.translateService.instant('common.labels.since') +
                        ' ' +
                        a.started_at
                      : '') +
                    (a.state === 'closed'
                      ? ' ' +
                        this.translateService.instant('common.labels.since') +
                        ' ' +
                        a.finished_at
                      : '') +
                    (a.state === 'draft'
                      ? ' ' +
                        this.translateService.instant('common.labels.from') +
                        ' ' +
                        a.started_at
                      : '');
                  return {
                    value: a.id,
                    text: a.name,
                    data: { clientId: a.client_id },
                    info: info,
                  };
                })
              : []
          );
        });
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
    this.store.dispatch(new fromDatesAction.UpdateSearch(update));
  }

  deleteRecord(dates: DatesVM) {
    if (dates.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant('dates.table.remove.title'),
          message: this.translateService.instant('dates.table.remove.message'),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && dates.id) {
          this.store.dispatch(new fromDatesAction.DeleteDates(dates.id));
        }
      });
    }
  }

  navigateToDetail(dates: DatesVM) {
    this.router.navigate(['/dates', dates.id, dates.assignment_id]);
  }

  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.datesMappingService.searchRequest(model);
        this.datesService
          .getDates({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const { list } =
              this.datesMappingService.datesSearchResponseToVM(res);
            const exportList: DatesExportVM[] = [];
            if (list && list.length > 0) {
              list.forEach((dates) => {
                exportList.push({
                  id: dates.id ? dates.id.toString() : '',
                  jobtitle: dates.job?.title || '',
                  appointedAt: dates.appointed_at || '',
                  start_time: dates.start_time || '',
                  finish_time: dates.finish_time || '',
                });
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('dates.table.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'dates_table',
              });
            }
          });
      }
    });
  }

  navigateToAssignments(dates: DatesVM) {
    const dateTo = moment(dates.appointed_at).format('YYYY-MM-DD');
    this.router.navigate(['/assignments'], {
      state: { jobId: dates.job_id, dateTo: dateTo },
    });
  }

  navigateToCreateAssignment(dates: DatesVM) {
    this.router.navigate(['/assignments/create'], { state: { dateId: dates.id } });
  }

  onDateChange() {
    let durationValue = 0;
    if (this.searchForm && this.searchForm.get('dateFrom')?.value && this.searchForm.get('dateTo')?.value) {
      durationValue = moment(this.searchForm.get('dateTo')?.value).diff(moment(this.searchForm.get('dateFrom')?.value), 'days') + 1;
      if (durationValue <= 0) {
        this.searchForm.get('dateTo')?.reset();
      }
    }
  }
}
