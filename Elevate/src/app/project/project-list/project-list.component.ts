import * as fromProject from './../state';
import * as fromProjectAction from './../state/project.actions';
import * as fromUser from './../../root-state/user-state';

import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import {
  ProjectExportVM,
  ProjectSearchVM,
  ProjectVM,
} from '../../model/project.model';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AgentService } from './../../services/agent.service';
import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ClientMappingService } from './../../services/mapping-services/client-mapping.service';
import { ClientService } from './../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from './../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FormatService } from '../../services/format.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from './../../model/option.model';
import { ProjectMappingService } from './../../services/mapping-services/project-mapping.service';
import { ProjectService } from './../../services/project.service';
import { Router } from '@angular/router';
import { StorageService } from './../../services/storage.service';
import { TranslateService } from './../../services/translate.service';
import { UsersService } from './../../services/users.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  searchForm = new FormGroup({
    agent: new FormControl(''),
    client: new FormControl(''),
    order: new FormControl(''),
    contractType: new FormControl(''),
    state: new FormControl(''),
    search: new FormControl(''),
  });
  displayedColumns = [
    'accountingSummaryState',
    'id',
    'name',
    'customer',
    'jobsNumber',
    'sumPlannedCosts',
    'sumMaxEstimatedCosts',
    'status',
    'createdDate',
    'action',
  ];
  result$: Observable<ProjectVM[]> = of([]);
  searchModel$: Observable<ProjectSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: ProjectSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  agentLK: OptionVM[] = [];
  clientLK: OptionVM[] = [];
  stateLK: OptionVM[] = [];
  orderLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  deletePermission$: Observable<boolean> = of(false);

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('project.search');
  }

  constructor(
    private fileExportService: FileExportService,
    private agentService: AgentService,
    private projectService: ProjectService,
    private clientService: ClientService,
    private storageService: StorageService,
    private clientMappingService: ClientMappingService,
    private contractTypesService: ContractTypesService,
    private translateService: TranslateService,
    private projectMappingService: ProjectMappingService,
    private userStore: Store<fromUser.State>,
    private router: Router,
    public dialog: MatDialog,
    private formatService: FormatService,
    private store: Store<fromProject.State>
  ) { }

  ngOnInit(): void {
    const previous = this.storageService.get('project.search');
    if (previous !== null) {
      const { agent, client, search, contractType, state, order } = JSON.parse(
        previous
      ) as ProjectSearchVM;
      this.searchForm.patchValue({
        agent: agent,
        client: client,
        search: search,
        contractType: contractType,
        state: state,
        order: order,
      });
    } else {
      const searchModel: ProjectSearchVM = {
        pageIndex: 1,
        pageSize: 6,
      };
      this.store.dispatch(new fromProjectAction.UpdateSearch(searchModel));
    }
    this.loadLookUps();
    this.loading$ = this.store.pipe(
      select(fromProject.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.deletePermission$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['delete-projects'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromProject.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromProject.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromProject.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromProject.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromProject.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromProject.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromProjectAction.LoadProjectList(this.searchModel)
        );
      } else {
        const searchModel: ProjectSearchVM = {
          pageIndex: 1,
          pageSize: 6,
        };
        this.store.dispatch(new fromProjectAction.UpdateSearch(searchModel));
      }
    });
    this.searchForm.get('state')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, state: res };
      this.store.dispatch(new fromProjectAction.UpdateSearch(update));
    });
    this.searchForm.get('contractType')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, contractType: res };
      this.store.dispatch(new fromProjectAction.UpdateSearch(update));
    });
    this.searchForm.get('agent')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, agent: res };
      this.store.dispatch(new fromProjectAction.UpdateSearch(update));
    });
    this.updateOrderLookup('');
    this.selectedClientChanged();
    this.searchForm.get('client')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, client: res };
      this.store.dispatch(new fromProjectAction.UpdateSearch(update));
    });
    this.searchForm.get('order')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, order: res };
      this.store.dispatch(new fromProjectAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromProjectAction.UpdateSearch(update));
      }
    });
  }
  loadLookUps() {
    this.translateService.get('projects.state').subscribe((a) => {
      this.stateLK = FormConfig.projects.state.map((a) => {
        return {
          value: a,
          text: this.translateService.instant('projects.state.' + a),
        };
      });
    });

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
    this.clientService.getClientLK().subscribe((res) => {
      this.clientLK = this.clientMappingService.clientLKResponseToVM(res);
    });
    this.translateService.get('contracts').subscribe((p) => {
      this.contractTypesService.getContractTypeLK().subscribe((res) => {
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
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromProjectAction.UpdateSearch(update));
  }
  searchChange() {
    const formValues = this.searchForm.getRawValue();
    const update = {
      ...this.searchModel,
      pageIndex: 1,
      parent: formValues.parent,
      search: formValues.search,
    };
    this.store.dispatch(new fromProjectAction.UpdateSearch(update));
  }
  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.projectMappingService.searchRequest(model);
        this.projectService
          .getProjects({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const { list } =
              this.projectMappingService.projectSearchResponseToVM(res);
            const exportList: ProjectExportVM[] = [];
            if (list && list.length > 0) {
              const getProjectProperty = (data: any) => {
                if (data) {
                  let str = '';
                  for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                      str += key + ': ' + data[key] + ', ';
                    }
                  }
                  return str;
                } else {
                  return '';
                }
              };
              list.forEach((project) => {
                const order = project.order ? project.order : {};
                const budget = project.budget ? project.budget : {};
                exportList.push({
                  id: project.id ? project.id.toString() : '',
                  name: project.name || '',
                  startedAt: this.formatService.date(project.started_at),
                  finishedAt: this.formatService.date(project.finished_at),
                  agentName: project.agent ? project.agent.fullname || '' : '',
                  categoryName: project.category
                    ? this.translateService.instant(
                      'projects.fields.category.' + project.category
                    )
                    : '',
                  status: project.state
                    ? this.translateService.instant(
                      'projects.state.' + project.state
                    )
                    : '',
                  customer: project.client ? project.client.name || '' : '',
                  customerContactName: project.contact
                    ? project.contact.fullname || ''
                    : '',
                  clientProperties: getProjectProperty(project.data),
                  orderName: order.name || '',
                  orderedAt: this.formatService.date(order.ordered_at),
                  budgetName: budget.name || '',
                  budgetValue: budget.value ? budget.value.toString() : '',
                  budgetConsumed: this.formatService.formatCurrency(
                    budget.consumed
                  ),
                  jobsNumber: project.number_of_jobs
                    ? project.number_of_jobs.toString()
                    : '0',
                  revenueTotal: this.formatService.formatCurrency(
                    project.revenues
                      ? project.revenues
                        .map((a) => a.total)
                        .reduce((a, b) => a + b, 0)
                      : '0'
                  ),
                  sumPlannedCosts: this.formatService.formatCurrency(
                    project.sum_planned_costs || '0'
                  ),
                  sumMinEstimatedCosts: this.formatService.formatCurrency(
                    project.sum_min_estimated_costs || '0'
                  ),
                  sumMaxEstimatedCosts: this.formatService.formatCurrency(
                    project.sum_max_estimated_costs || '0'
                  ),
                  sumFreelancerCosts: this.formatService.formatCurrency(
                    project.sum_freelancer_costs || '0'
                  ),
                });
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('projects.list.table.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'projects_list_table',
              });
            }
          });
      }
    });
  }

  // private setFilters() {
  //   this.userStore.pipe(select(fromUser.getCurrentUserInfo)).subscribe(res => {
  //     if (res) {
  //       this.filter = {
  //         // agent: user.is('agent', 'admin') && { options: [], selected: { id: user.is('agent') && user.roleId() } },
  //         agent: (res.role === 'agent' || res.role === 'admin') ? { options: [], selected: { id: res.role === 'agent' ? res.role_id : undefined } } : undefined,
  //         client: { options: [], selected: { id: undefined } },
  //         order: { options: [], selected: { id: undefined } },
  //         contractType: { options: [], selected: { id: undefined } },
  //         state: {
  //           options: FormConfig.projects.state.map((a) => {
  //             return {
  //               id: a,
  //               name: this.translateService.instant('projects.state.' + a)
  //             };
  //           }), selected: { id: 'active' }
  //         }
  //       };
  //       forkJoin([
  //         this.usersService.agentsNameList(false, false),
  //         this.projectService.clients(),
  //         this.contractTypesService.nameList()
  //       ]).subscribe(res => {
  //         const agents = res[0];
  //         const clients = res[1] ? res[1].data : [];
  //         const list = res[2] ? res[2].data : [];
  //         this.filter.client.options = clients; //.sort((a: any, b: any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  //         this.filter.agent.options = agents;
  //         this.filter.contractType.options = list;
  //         this.updateFilter();
  //       });
  //     }
  //   });
  // }

  private selectedClientChanged() {
    this.searchForm
      .get('client')
      ?.valueChanges.subscribe((clientId: string) => {
        this.updateOrderLookup(clientId);
      });
  }
  updateOrderLookup(clientId: string) {
    this.projectService.orders(clientId).subscribe((res) => {
      this.orderLK = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              text: a.name,
              value: a.id,
            };
          })
          : []
      );
      if (
        this.searchForm.get('order')?.value &&
        this.orderLK.findIndex(
          (a: OptionVM) => a.value === this.searchForm.get('order')?.value
        ) === -1
      ) {
        this.searchForm.get('order')?.patchValue(undefined);
      }
    });
  }
  sortOption(options: OptionVM[]) {
    // return options.sort((a: OptionVM, b: OptionVM) =>
    //   a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    // );
    return options.sort((a, b) => a.text && b.text ? a.text.toString().localeCompare(b.text.toString()) : 0)
  }
  deleteRecord(project: ProjectVM) {
    if (project.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'projects.list.table.remove.title'
          ),
          message: this.translateService.instant(
            'projects.list.table.remove.message',
            { name: project.name }
          ),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && project.id) {
          this.store.dispatch(new fromProjectAction.DeleteProject(project.id));
        }
      });
    }
  }
  navigateToDetail(project: ProjectVM) {
    this.router.navigate(['/projects', project.id]);
  }
  navigateToCopy(project: ProjectVM) {
    this.router.navigate(['/projects/copy', project.id]);
  }
  navigateToCreateJobs(project: ProjectVM) {
    this.router.navigateByUrl(`projects/${project.id}/jobs`);
  }
}
