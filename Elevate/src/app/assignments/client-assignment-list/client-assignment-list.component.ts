import * as fromAssignment from '../state/index';
import * as fromAssignmentAction from '../state/assignment.actions';
import * as fromUser from './../../root-state/user-state';
import * as moment from 'moment';

import { AssignmentSearchVM, AssignmentVM } from '../../model/assignment.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AgentService } from '../../services/agent.service';
import { AssignmentMappingService } from '../../services/mapping-services/assignment-mapping.service';
import { AssignmentService } from '../../services/assignment.service';
import { ClientMappingService } from '../../services/mapping-services';
import { ClientService } from '../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FreelancerService } from '../../services/freelancer.service';
import { JobMappingService } from '../../services/mapping-services/job-mapping.service';
import { JobService } from '../../services/job.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { SearchRequestVM } from '../../model/search.model';
import { SiteService } from '../../services/site.service';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';
import { UserVM } from '../../model/user.model';

@Component({
  selector: 'app-client-assignment-list',
  templateUrl: './client-assignment-list.component.html',
  styleUrls: ['./client-assignment-list.component.scss']
})
export class ClientAssignmentListComponent implements OnInit {
  componentActive = true;
  hasFilter = false;

  agentLK: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  siteLK: OptionVM[] = [];
  jobLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  statesLK: OptionVM[] = [];
  freelancerLK: OptionVM[] = [];
  invoiceStateLK: OptionVM[] = [];

  searchModel$: Observable<AssignmentSearchVM | undefined> = of({});
  searchModel: AssignmentSearchVM = {};
  result$: Observable<AssignmentVM[]> = of([]);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loggedInUser: UserVM | undefined = undefined;
  isClientUser: boolean = false;
  isFieldUser: boolean = false;
  displayedColumns = [
    'jobTitle',
    'appointedTimeLabel',
    'siteFullAddress',
    'freelancerName',
    'status',
    'invoiceState',
    'action'
  ];

  searchForm = new FormGroup({
    project: new FormControl(''),
    site: new FormControl(''),
    job: new FormControl(''),
    contractType: new FormControl(''),
    states: new FormControl([]),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    search: new FormControl(''),
  });

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('assignment.search');
  }

  constructor(
    private fileExportService: FileExportService,
    private store: Store<fromAssignment.State>,
    private userStore: Store<fromUser.State>,
    private agentService: AgentService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private siteService: SiteService,
    private jobService: JobService,
    private assignmentService: AssignmentService,
    private clientMappingService: ClientMappingService,
    private assignmentMappingService: AssignmentMappingService,
    private contractTypesService: ContractTypesService,
    private jobMappingService: JobMappingService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getSelectedFilters();
    this.loadLookUps();

    this.userStore
      .pipe(
        select(fromUser.getCurrentUserInfo),
        takeWhile(() => this.componentActive)
      )
      .subscribe((res) => {
        this.loggedInUser = res ? res : undefined;
      });
    this.isClientUser = this.loggedInUser?.role === 'client';
    this.isFieldUser = this.loggedInUser?.role === 'field';

    this.loading$ = this.store.pipe(
      select(fromAssignment.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromAssignment.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.result$.subscribe(res => {
      console.log(res);
    });
    this.noRecords$ = this.store.pipe(
      select(fromAssignment.getNoRecords),
      takeWhile(() => this.componentActive)
    );
    this.currentPage$ = this.store.pipe(
      select(fromAssignment.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromAssignment.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromAssignment.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromAssignment.getSearchModel),
      takeWhile(() => this.componentActive)
    );

    this.getListFromSearchModel();
    this.getUpdatedFormValues();
  }

  getSelectedFilters() {
    const previous = this.storageService.get('assignment.search');
    if (previous !== null) {
      const {
        project,
        contractType,
        states,
        site,
        job,
        dateFrom,
        dateTo,
        search,
      } = JSON.parse(previous) as AssignmentSearchVM;
      this.searchForm.patchValue({
        job: job,
        project: project,
        contractType: contractType,
        site: site,
        states: states,
        dateFrom: dateFrom,
        dateTo: dateTo,
        search: search,
      });
    } else {
      const searchModel: AssignmentSearchVM = {
        pageIndex: 1,
        pageSize: 25,
        sortBy: 'appointed_at',
        sortDir: 'asc',
      };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(searchModel));
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

    this.siteService.getSiteLK().subscribe((res) => {
      this.siteLK = res.data
        ? res.data.map((a) => {
            return {
              value: a.id,
              text: a.name + (a.number ? ' | ' + a.number : ''),
              info:
                a.zip +
                ' ' +
                a.city +
                ', ' +
                a.address +
                (a.country ? ', ' + a.country : ''),
            };
          })
        : [];
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

    this.translateService.get('assignments.fields').subscribe((a) => {
      const userType =
        this.isClientUser || this.isFieldUser ? 'client' : 'others';
      if (userType === 'client') {
        this.statesLK = FormConfig.assignments.client.states.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'assignments.fields.states.' + a
            ),
          };
        });
      }

      if (userType === 'others') {
        this.statesLK = FormConfig.assignments.others.states.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'assignments.fields.states.' + a
            ),
          };
        });
      }
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  getListFromSearchModel() {
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        if (
          res.project ||
          res.site ||
          res.job ||
          res.contractType ||
          res.states ||
          res.dateFrom ||
          res.dateTo ||
          (res.search?.length && res.search?.length > 2)
        ) {
          this.hasFilter = true;
          this.store.dispatch(
            new fromAssignmentAction.LoadAssignmentList({
              search: this.searchModel,
              view: 'client'
            })
          );
        } else {
          this.hasFilter = false;
          this.store.dispatch(
            new fromAssignmentAction.LoadAssignmentListFailed(null)
          );
        }
      } else {
        const searchModel: AssignmentSearchVM = {
          pageIndex: 1,
          pageSize: 50,
          sortBy: 'appointed_at',
          sortDir: 'asc',
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(searchModel));
      }
    });
  }

  getUpdatedFormValues() {
    this.searchForm.get('project')?.valueChanges.subscribe((res) => {
      if (res) {
        const update = { ...this.searchModel, pageIndex: 1, project: res };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
        this.getJobsByProject(res);
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          project: undefined,
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('site')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, site: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('job')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, job: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('contractType')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, contractType: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('states')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, states: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('dateFrom')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateFrom: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateFrom: undefined,
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('dateTo')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateTo: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateTo: undefined,
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
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

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
  }

  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.assignmentMappingService.searchRequest(model);
        this.assignmentService
          .getAssignments({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const { list } = this.assignmentMappingService.assignmentMultipleResponseToVM(res);
            // const exportList: AssignmentExportVM[] = [];
            // if (list && list.length > 0) {
            //   list.forEach((assignment) => {
            //     exportList.push({
            //       title: job.title || '',
            //       sitename: job.site?.name || '',
            //       siteaddress: job.site?.address || '',
            //       sitezip: job.site?.zip || '',
            //       sitecity: job.site?.city || '',
            //       clientname: job.project?.client?.name || '',
            //       status: job.state || '',
            //       categoryName: job.category || '',
            //       agentName: job.agent?.fullname || '',
            //       datesNumber: '',
            //       assignmentsNumber: `${job.summary?.assignments?.count}` || '',
            //       bookedAssignmentsNumber: `${assignmentState?.booked}` || '',
            //       finishedAssignmentsNumber:
            //         `${
            //           assignmentState &&
            //           (assignmentState.preparation
            //             ? assignmentState.preparation
            //             : 0) +
            //             (assignmentState.invoiced
            //               ? assignmentState.invoiced
            //               : 0)
            //         }` || '',
            //       openTendersNumber:
            //         `${job.summary?.tenders?.states?.active}` || '',
            //       offersNumber: `${job?.summary?.offers?.states?.valid}` || '',
            //     });
            //   });
            //   const fieldNames = Object.keys(exportList[0]).map((a) =>
            //     this.translateService.instant('jobs.table.' + a)
            //   );
            //   this.fileExportService.downloadCSV({
            //     headerFields: fieldNames,
            //     data: exportList,
            //     filePrefix: 'jobs_table',
            //   });
            // }
          });
      }
    });
  }

}
