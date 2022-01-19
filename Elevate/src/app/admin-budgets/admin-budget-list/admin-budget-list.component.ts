import * as fromAdminBudget from './../state';
import * as fromAdminBudgetAction from './../state/admin-budget.actions';
import * as fromUser from './../../root-state/user-state';

import { ActivatedRoute, Router } from '@angular/router';
import {
  BudgetSearchVM,
  BudgetVM
} from '../../model/budget.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { BudgetMappingService } from './../../services/mapping-services/budget-mapping.service';
import { BudgetService } from './../../services/budget.service';
import { ClientService } from './../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormatService } from '../../services/format.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { StorageService } from '../../services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-admin-budget-list',
  templateUrl: './admin-budget-list.component.html',
  styleUrls: ['./admin-budget-list.component.scss']
})
export class AdminBudgetListComponent implements OnInit {
  searchForm = new FormGroup({
    search: new FormControl(''),
    clientId: new FormControl('')
  });
  result$: Observable<BudgetVM[]> = of([]);
  searchModel$: Observable<BudgetSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: BudgetSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  clientList: OptionVM[] = [];
  canDelete = false;
  downloadColumns = ['clientName', 'name', 'value', 'available', 'planned', 'consumed', 'count_assignments', 'count_orders'];
  constructor(
    private fileExportService: FileExportService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private budgetMappingService: BudgetMappingService,
    private budgetService: BudgetService,
    private toastrService: ToastrService,
    private contractTypesService: ContractTypesService,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private formatService: FormatService,
    private store: Store<fromAdminBudget.State>
  ) { }

  ngOnInit(): void {
    this.canDelete = this.userService.user().isAllowed('delete-budgets');
    const previous = this.storageService.get('admin.budget.search');
    if (previous !== null) {
      const { search,
        clientId } = JSON.parse(
          previous
        ) as BudgetSearchVM;
      this.searchForm.patchValue({
        search: search,
        clientId: clientId
      });
    } else {
      const searchModel: BudgetSearchVM = {
        pageIndex: 1,
        pageSize: 6
      };
      this.store.dispatch(new fromAdminBudgetAction.UpdateSearch(searchModel));
    }
    this.loadLookups();
    this.loading$ = this.store.pipe(
      select(fromAdminBudget.getLoading),
      takeWhile(() => this.componentActive)
    );

    this.result$ = this.store.pipe(
      select(fromAdminBudget.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromAdminBudget.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromAdminBudget.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromAdminBudget.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromAdminBudget.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromAdminBudget.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.subscribeSearch();
  }
  subscribeSearch() {
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromAdminBudgetAction.LoadBudgetList({ ...this.searchModel })
        );
      }
    });
    this.searchForm.get('clientId')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, clientId: res };
      this.store.dispatch(new fromAdminBudgetAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromAdminBudgetAction.UpdateSearch(update));
      }
    });
  }
  deleteBudget(data: BudgetVM) {
    if (data && data.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant('administration.budgets.table.remove.title'),
          message: this.translateService.instant('administration.budgets.table.remove.message', { name: data.name }),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && data && data.id) {
          this.budgetService.deleteBudget(data.id).subscribe(res => {
            this.toastrService.success(this.translateService.instant('administration.budgets.delete-success'));
            this.store.dispatch(
              new fromAdminBudgetAction.LoadBudgetList({ ...this.searchModel })
            );
          })
        }
      });
      // this.budgetService.deleteBudget(data.id).subscribe(res => {
      //   this.toastrService.success(this.translateService.instant('notification.delete.budget.success'));
      //   this.store.dispatch(
      //     new fromAdminBudgetAction.LoadBudgetList({ ...this.searchModel })
      //   );
      // }, error => {
      //   this.toastrService.error(this.translateService.instant('notification.delete.budget.error'));
      // })
    }
  }
  loadLookups() {
    this.clientService
      .getClients({
        limit: 1000000,
        order_by: 'name',
        order_dir: 'asc',
        only_fields: ['client.id', 'client.name'],
      })
      .subscribe((res) => {
        this.clientList = this.sortOption(res.data
          ? res.data.map((a) => {
            return {
              value: a.id,
              text: a.name,
            };
          })
          : []);
      });
  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromAdminBudgetAction.UpdateSearch(update));
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text.toString().toUpperCase() > b.text.toString().toUpperCase() ? 1 : b.text.toString().toUpperCase() > a.text.toString().toUpperCase() ? -1 : 0) : 0
    );
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  gotoDetail(data: BudgetVM) {
    this.router.navigate(['/administration/budgets', data.id]);
  }
  download() {
    this.searchModel$.pipe(take(1)).subscribe(model => {
      if (model) {
        const searchModel = this.budgetMappingService.searchRequest(model);
        this.budgetService.getBudgets({ include: searchModel.include, filters: searchModel.filters, limit: 1000000, page: 1 }).subscribe(res => {

          if (res && res.data && res.data.length > 0) {
            const data = (res.data || []).map(budget => {
              return {
                ...budget,
                clientName: budget.client && budget.client.data && budget.client.data.name
              }
            });
            const fieldNames = this.downloadColumns.map(a => this.translateService.instant('administration.budgets.table.' + a));
            const exportList: any = data.map((a: any) => {
              const obj: any = {};
              this.downloadColumns.forEach(x => {
                obj[x] = a[x] || '';
              });
              return obj;
            });
            this.fileExportService.downloadCSV({
              headerFields: fieldNames,
              data: exportList,
              filePrefix: 'administration_budgets_table'
            });
          }
        });
      }
    });
  }
}
