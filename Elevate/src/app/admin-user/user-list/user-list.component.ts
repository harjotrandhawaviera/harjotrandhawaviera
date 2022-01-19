import * as fromCurrentUser from './../../root-state/user-state';
import * as fromUser from './../state';
import * as fromUserAction from './../state/user.actions';

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { UserSearchVM, UserVM } from '../models/user.model';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { FileExportService } from '../../services/file-export.service';
import { MatDialog } from '@angular/material/dialog';
import { RoleVM } from '../../model/role.model';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from './../../services/translate.service';
import { UserMappingService } from '../services/user-mapping.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean> = of(false);
  result$: Observable<UserVM[]> = of([]);
  resultList: UserVM[] = [];
  createPermission$: Observable<boolean> = of(false);
  deletePermission$: Observable<boolean> = of(false);
  currentUserInfo$: Observable<UserVM | null> = of(null);
  currentUserId: number | undefined = undefined;
  currentPage$: Observable<number | undefined> = of(undefined);
  totalRecords$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  searchModel$: Observable<UserSearchVM | undefined> = of({});
  searchModel: UserSearchVM = {};

  componentActive = true;
  hasFilter = false;
  rolesList: RoleVM[] = [];
  displayedColumns = [
    'user',
    'createdBy',
    'lastAction',
    'roleName',
    'stateName',
    'action',
  ];
  searchForm = new FormGroup({
    role: new FormControl(''),
    search: new FormControl(''),
  });

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('user.search');
  }

  constructor(
    private store: Store<fromUser.State>,
    private userStore: Store<fromCurrentUser.State>,
    private usersService: UsersService,
    private storageService: StorageService,
    private userMappingService: UserMappingService,
    private translateService: TranslateService,
    private router: Router,
    public dialog: MatDialog,
    private fileExportService: FileExportService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new fromUserAction.ClearUserList());
    const previous = this.storageService.get('user.search');
    if (previous !== null) {
      let { role, search } = JSON.parse(previous) as UserSearchVM;
      if (role) {
        role = role.charAt(0).toUpperCase() + role.slice(1);
      }
      this.searchForm.patchValue({
        role: role,
        search: search,
      });
    } else {
      const searchModel: UserSearchVM = {
        pageIndex: 1,
        pageSize: 10,
      };
      this.store.dispatch(new fromUserAction.UpdateSearch(searchModel));
    }
    this.getRoleLookup();
    this.loading$ = this.store.pipe(
      select(fromUser.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.createPermission$ = this.userStore.pipe(
      select(fromCurrentUser.isAllowed, {
        permissions: AllowedActions['create-users'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.deletePermission$ = this.userStore.pipe(
      select(fromCurrentUser.isAllowed, {
        permissions: AllowedActions['delete-users'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromUser.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.currentUserInfo$ = this.userStore.pipe(
      select(fromCurrentUser.getCurrentUserInfo),
      takeWhile(() => this.componentActive)
    );
    this.currentPage$ = this.store.pipe(
      select(fromUser.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromUser.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromUser.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromUser.getSearchModel),
      takeWhile(() => this.componentActive)
    );

    this.result$.subscribe((res) => {
      this.resultList = res;
    });

    this.currentUserInfo$.subscribe((res) => {
      this.currentUserId = res?.id;
    });

    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        if (
          res.role?.length ||
          (res.search?.length && res.search?.length > 2)
        ) {
          this.hasFilter = true;
          this.store.dispatch(
            new fromUserAction.LoadUserList(this.searchModel)
          );
        } else {
          this.hasFilter = false;
          this.store.dispatch(new fromUserAction.LoadUserListFailed(null));
        }
      } else {
        this.hasFilter = false;
        const searchModel: UserSearchVM = {
          pageIndex: 1,
          pageSize: 10,
        };
        this.store.dispatch(new fromUserAction.UpdateSearch(searchModel));
      }
    });

    this.searchForm.get('role')?.valueChanges.subscribe((res) => {
      const update = {
        ...this.searchModel,
        pageIndex: 1,
        pageSize: 10,
        role: res ? res.toLowerCase() : undefined,
      };

      this.store.dispatch(new fromUserAction.UpdateSearch(update));
    });

    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      const update = {
        ...this.searchModel,
        pageIndex: 1,
        pageSize: 10,
        search: res,
      };
      if (update.search.length > 2 || update.search.length === 0) {
        this.store.dispatch(new fromUserAction.UpdateSearch(update));
      }
    });
  }

  getRoleLookup() {
    this.usersService
      .getRolesLK({ order_by: 'identifier' })
      .subscribe((res) => {
        this.rolesList = this.userMappingService.RoleResponseToVM(res);
        this.rolesList.forEach((x) => {
          if (x.identifier) {
            // make first letter capital
            x.identifier =
              x.identifier.charAt(0).toUpperCase() + x.identifier.slice(1);
          }
        });
      });
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromUserAction.UpdateSearch(update));
  }

  navigateToDetail(data: UserVM) {
    this.router.navigate(['/administration/users', data.id]);
  }

  deleteRecord(data: UserVM) {
    if (data.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant('administration.users.table.remove.title'),
          message: this.translateService.instant('administration.users.table.remove.message', {
            name: data.name,
          }),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && data.id) {
          this.store.dispatch(new fromUserAction.DeleteUser(data.id));
        }
      });
    }
  }

  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.userMappingService.searchRequest(model);
        this.usersService
          .getUsers({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const { list } = this.userMappingService.searchResponseToVM(res);
            const exportList: {
              fullname: any;
              email: any;
              lastAction: any;
              roleName: any;
              stateName: any;
            }[] = [];
            if (list && list.length > 0) {
              list.forEach((user) => {
                exportList.push({
                  fullname: user.fullname || '',
                  email: user.email || '',
                  lastAction: user.created_at || '',
                  roleName: user.role || '',
                  stateName: user.status || '',
                });
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('administration.users.table.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'administration_users_table',
              });
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }
}
