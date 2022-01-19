import * as fromJob from '../state/index';
import * as fromJobAction from './../state/job.actions';
import * as fromUser from './../../root-state/user-state';

import {
  ClientJobExportVM,
  JobExportVM,
  JobSearchVM,
  JobVM,
} from '../../model/job.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AgentService } from '../../services/agent.service';
import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ClientMappingService } from '../../services/mapping-services';
import { ClientService } from '../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { JobMappingService } from '../../services/mapping-services/job-mapping.service';
import { JobService } from '../../services/job.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-client-job-list',
  templateUrl: './client-job-list.component.html',
  styleUrls: ['./client-job-list.component.scss'],
})
export class ClientJobListComponent implements OnInit {
  projectLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  componentActive = true;

  searchModel$: Observable<JobSearchVM | undefined> = of({});
  searchModel: JobSearchVM = {};
  result$: Observable<JobVM[]> = of([]);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);

  searchForm = new FormGroup({
    project: new FormControl(''),
    contractType: new FormControl(''),
    search: new FormControl(''),
  });

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('job.search');
  }

  constructor(
    private fileExportService: FileExportService,
    private store: Store<fromJob.State>,
    private agentService: AgentService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private jobService: JobService,
    private clientMappingService: ClientMappingService,
    private contractTypesService: ContractTypesService,
    private jobMappingService: JobMappingService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getSelectedFilters();
    this.loadLookUps();

    this.loading$ = this.store.pipe(
      select(fromJob.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromJob.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromJob.getNoRecords),
      takeWhile(() => this.componentActive)
    );
    this.currentPage$ = this.store.pipe(
      select(fromJob.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromJob.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromJob.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromJob.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromJobAction.LoadJobList({
            search: this.searchModel,
            view: 'client',
          })
        );
      } else {
        const searchModel: JobSearchVM = {
          pageIndex: 1,
          pageSize: 12,
          sortBy: 'title',
          sortDir: 'asc',
        };
        this.store.dispatch(new fromJobAction.UpdateSearch(searchModel));
      }
    });
    this.searchForm.get('project')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, project: res };
      this.store.dispatch(new fromJobAction.UpdateSearch(update));
    });
    this.searchForm.get('contractType')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, contractType: res };
      this.store.dispatch(new fromJobAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromJobAction.UpdateSearch(update));
      }
    });
  }

  getProjectsByClient(id: string) {
    this.projectLK = this.projectLK.filter((x) => x.data.clientId === id);
  }

  getSelectedFilters() {
    const previous = this.storageService.get('job.search');
    if (previous !== null) {
      const { agent, client, project, contractType, attributes, search } =
        JSON.parse(previous) as JobSearchVM;
      this.searchForm.patchValue({
        agent: agent,
        client: client,
        project: project,
        search: search,
        contractType: contractType,
        attributes: attributes,
      });
    } else {
      const searchModel: JobSearchVM = {
        pageIndex: 1,
        pageSize: 25,
        sortBy: 'title',
        sortDir: 'asc',
      };
      this.store.dispatch(new fromJobAction.UpdateSearch(searchModel));
    }
  }

  loadLookUps() {
    this.translateService.get('projects').subscribe((p) => {
      this.translateService.get('common').subscribe((c) => {
        this.projectService.getProjectsLK().subscribe((res) => {
          this.projectLK = this.sortOption(
            res.data
              ? res.data.map((a) => {
                  const info =
                    this.translateService.instant(
                      'projects.fields.category.' + a.category
                    ) +
                    '-' +
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
    this.contractTypesService.getContractTypes({}).subscribe((res) => {
      this.contractTypeLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.name,
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
    this.store.dispatch(new fromJobAction.UpdateSearch(update));
  }

  deleteRecord(job: JobVM) {
    if (job.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant('jobs.table.remove.title'),
          message: this.translateService.instant('jobs.table.remove.message'),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && job.id) {
          this.store.dispatch(new fromJobAction.DeleteJob(job.id));
        }
      });
    }
  }

  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.jobMappingService.searchRequest(model);
        this.jobService
          .getJobs({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const { list } = this.jobMappingService.jobSearchResponseToVM(res);
            const exportList: ClientJobExportVM[] = [];
            if (list && list.length > 0) {
              list.forEach((job) => {
                const assignmentState = job.summary?.assignments?.states;
                const revenueTotal = job.revenues?.reduce((a, b) => a + b);
                let revenueAvg = undefined;
                if (job.revenues?.length) {
                  revenueAvg = revenueTotal / (job.revenues?.length > 0 ? job.revenues?.length : 1);
                }

                exportList.push({
                  title: job.title || '',
                  projectname: job.project?.name || '',
                  sitename: job.site?.name || '',
                  siteaddress: job.site?.address || '',
                  sitezip: job.site?.zip || '',
                  sitecity: job.site?.city || '',
                  clientname: job.project?.client?.name || '',
                  siteClientContact: job.site_client_contact?.fullname || '',
                  status: job.state || '',
                  categoryName: job.category || '',
                  agentName: job.agent?.fullname || '',
                  assignmentsNumber: `${job.summary?.assignments?.count}` || '',
                  bookedAssignmentsNumber: `${assignmentState?.booked}` || '',
                  openUpcomingAssignmentsNumber:
                    `${assignmentState?.open_upcoming}` || '',
                  finishedAssignmentsNumber:
                    `${
                      assignmentState &&
                      (assignmentState.preparation
                        ? assignmentState.preparation
                        : 0) +
                        (assignmentState.invoiced
                          ? assignmentState.invoiced
                          : 0)
                    }` || '',
                  revenueTotal: `${revenueTotal}` || '',
                  revenueAvg: `${revenueAvg}` || '',
                });
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('jobs.table.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'jobs_table',
              });
            }
          });
      }
    });
  }
}
