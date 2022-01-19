import * as fromAdminOrder from './../state';
import * as fromAdminOrderAction from './../state/admin-order.actions';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  OrderSearchVM,
  OrderVM
} from '../../model/order.model';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { ClientService } from './../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormatService } from '../../services/format.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { OrderMappingService } from './../../services/mapping-services/order-mapping.service';
import { OrderService } from './../../services/order.service';
import { StorageService } from '../../services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-admin-orders-list',
  templateUrl: './admin-orders-list.component.html',
  styleUrls: ['./admin-orders-list.component.scss']
})
export class AdminOrdersListComponent implements OnInit {
  searchForm = new FormGroup({
    search: new FormControl('')
  });
  result$: Observable<OrderVM[]> = of([]);
  searchModel$: Observable<OrderSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: OrderSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  clientList: OptionVM[] = [];
  canDelete = false;
  displayedColumns = ['stateName', 'name', 'clientName', 'orderedAt', 'action'];
  constructor(
    private fileExportService: FileExportService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private orderMappingService: OrderMappingService,
    private orderService: OrderService,
    private toastrService: ToastrService,
    private contractTypesService: ContractTypesService,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private formatService: FormatService,
    private store: Store<fromAdminOrder.State>
  ) { }

  ngOnInit(): void {
    this.canDelete = this.userService.user().isAllowed('manage-orders');
    const previous = this.storageService.get('admin.order.search');
    if (previous !== null) {
      const { search } = JSON.parse(
        previous
      ) as OrderSearchVM;
      this.searchForm.patchValue({
        search: search
      });
    } else {
      const searchModel: OrderSearchVM = {
        pageIndex: 1,
        pageSize: 50
      };
      this.store.dispatch(new fromAdminOrderAction.UpdateSearch(searchModel));
    }
    this.loadLookups();
    this.loading$ = this.store.pipe(
      select(fromAdminOrder.getLoading),
      takeWhile(() => this.componentActive)
    );

    this.result$ = this.store.pipe(
      select(fromAdminOrder.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromAdminOrder.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromAdminOrder.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromAdminOrder.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromAdminOrder.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromAdminOrder.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.subscribeSearch();
  }
  subscribeSearch() {
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromAdminOrderAction.LoadOrderList({ ...this.searchModel })
        );
      }
    });
    this.searchForm.get('clientId')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, clientId: res };
      this.store.dispatch(new fromAdminOrderAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromAdminOrderAction.UpdateSearch(update));
      }
    });
  }
  deleteOrder(data: OrderVM) {
    if (data && data.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant('administration.orders.table.remove.title'),
          message: this.translateService.instant('administration.orders.table.remove.message', { name: data.name }),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && data && data.id) {
          this.orderService.deleteOrder(data.id).subscribe(res => {
            this.toastrService.success(this.translateService.instant('notification.delete.orders.success'));
            this.store.dispatch(
              new fromAdminOrderAction.LoadOrderList({ ...this.searchModel })
            );
          })
        }
      });
    }
  }
  loadLookups() {

  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromAdminOrderAction.UpdateSearch(update));
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text.toString().toUpperCase() > b.text.toString().toUpperCase() ? 1 : b.text.toString().toUpperCase() > a.text.toString().toUpperCase() ? -1 : 0) : 0
    );
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  gotoDetail(data: OrderVM) {
    this.router.navigate(['/administration/orders', data.id]);
  }
  download() {
    this.searchModel$.pipe(take(1)).subscribe(model => {
      if (model) {
        const searchModel = this.orderMappingService.searchRequest(model);
        this.orderService.getOrders({ include: searchModel.include, filters: searchModel.filters, limit: 1000000, page: 1 }).subscribe(res => {

          if (res && res.data && res.data.length > 0) {
            const data = (res.data || []).map(order => {
              return {
                ...order,
                stateName: this.translateService.instant('administration.orders.state.' + order.state),
                clientName: order.client?.data?.name || '',
                orderedAt: order.ordered_at ? this.formatService.date(order.ordered_at) : ''
              }
            });
            const fieldNames = this.displayedColumns.filter(a => a !== 'action').map(a => this.translateService.instant('administration.orders.table.' + a));
            const exportList: any = data.map((a: any) => {
              const obj: any = {};
              this.displayedColumns.filter(a => a !== 'action').forEach(x => {
                obj[x] = a[x] || '';
              });
              return obj;
            });
            this.fileExportService.downloadCSV({
              headerFields: fieldNames,
              data: exportList,
              filePrefix: 'administration_orders_table'
            });
          }
        });
      }
    });
  }
}
