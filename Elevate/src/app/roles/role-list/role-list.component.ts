import * as fromRole from '../state';
import * as fromRoleAction from './../state/roles.actions';
import * as fromUser from '../../root-state/user-state';

import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ProjectSearchVM, ProjectVM } from '../../model/project.model';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';

import { AgentService } from '../../services/agent.service';
import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ClientMappingService } from '../../services/mapping-services/client-mapping.service';
import { ClientService } from '../../services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { RoleSearchVM } from '../../model/role.model';
import { RoleService } from '../../services/role.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { TranslateService } from '../../services/translate.service';
import { SkillVM } from '../../model/skill.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {
  searchForm = new FormGroup({
    region: new FormControl(''),
    search: new FormControl(''),
  });
  displayedColumns = [
    'identifier',
    'label',
    'region',
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
  deletePermission$: Observable<boolean> = of(false);
  regionsLK: any[] = [];

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('project.search');
  }

  constructor(
    private roleService: RoleService,
    private storageService: StorageService,
    private userStore: Store<fromUser.State>,
    private toastrService: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<fromRole.State>,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const previous = this.storageService.get('role.search');
    if (previous !== null) {
      const { label, identifier, search, region, createdBy, dateFrom, dateTo } =
        JSON.parse(previous) as RoleSearchVM;
      this.searchForm.patchValue({
        label: label,
        identifier: identifier,
        search: search,
        region: region,
        createdBy: createdBy,
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
    } else {
      const searchModel: RoleSearchVM = {
        pageIndex: 1,
        pageSize: 6,
      };
      this.store.dispatch(new fromRoleAction.UpdateSearch(searchModel));
    }
    this.loadLookUps();
    this.loading$ = this.store.pipe(
      select(fromRole.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.deletePermission$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['delete-role'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromRole.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromRole.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromRole.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromRole.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromRole.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromRole.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromRoleAction.LoadRoleList(this.searchModel)
        );
      } else {
        const searchModel: RoleSearchVM = {
          pageIndex: 1,
          pageSize: 6,
        };
        this.store.dispatch(new fromRoleAction.UpdateSearch(searchModel));
      }
    });

    this.searchForm.get('region')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, region: res };
      this.store.dispatch(new fromRoleAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromRoleAction.UpdateSearch(update));
      }
    });
  }

  loadLookUps() {
    this.roleService.getRegions().subscribe((res) => {
      let newReg = [];
      if (res.data && res.data.length) {
        newReg = res.data.map((reg: { id: any; name: any }) => {
          return {
            value: reg.id,
            text: reg.name,
          };
        });
      }
      this.regionsLK = newReg;
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
    this.store.dispatch(new fromRoleAction.UpdateSearch(update));
  }

  open(row: any) {
    this.dialog
      .open(ReasonBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'master.roles.table.remove.title'
          ),
          message: this.translateService.instant(
            'master.roles.table.remove.message'
          ),
          cancelCode: 'administration.client.buttons.cancel',
          confirmCode: 'todos.set-state.buttons.confirm',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const id = row;
          this.roleService.removeRole(id).subscribe((_) => {
            this.toastrService.success(this.translateService.instant('notification.post.roles.delete'));
            this.store.dispatch(
              new fromRoleAction.LoadRoleList(this.searchModel)
            );
          });
          // this.administrationFacade.deleteDeployInvoice(id);
        }
      });
  }

  searchChange() {
    const formValues = this.searchForm.getRawValue();
    const update = {
      ...this.searchModel,
      pageIndex: 1,
      parent: formValues.parent,
      search: formValues.search,
    };
    this.store.dispatch(new fromRoleAction.UpdateSearch(update));
  }

  showValOfList(list: any[]) {
    let listwithname = [];
    if (list && list.length) {
      listwithname = list.map((l) => l.name);
    }
    if (listwithname && listwithname.length) {
      return listwithname.toString();
    } else {
      return '-';
    }
  }

  navigateToDetail(data: SkillVM) {
    this.router.navigate(['/master/roles', data.id, 'detail']);
  }
}
