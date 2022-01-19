import * as fromClient from './../state';
import * as fromClientAction from './../state/client.actions';
import * as fromUser from './../../root-state/user-state';

import { ClientSearchVM, ClientVM } from '../../model/client.model';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from './../../constant/allowed-actions.constant';
import { ClientMappingService } from '../../services/mapping-services/client-mapping.service';
import { ClientResponse } from '../../model/client.response';
import { ClientService } from './../../services/client.service';
import { ConfirmBoxComponent } from './../../core/confirm-box/confirm-box.component';
import { FileExportService } from '../../services/file-export.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from './../../services/storage.service';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, OnDestroy {

  displayedColumns = ['name', 'partner', 'position', 'action'];
  result$: Observable<ClientVM[]> = of([]);
  searchModel$: Observable<ClientSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: ClientSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  searchForm = new FormGroup({
    search: new FormControl(''),
    parent: new FormControl('')
  });
  parentList: ClientResponse[] | undefined;
  loading$: Observable<boolean> = of(false);
  deletePermission$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('client.search');
  }

  constructor(
    private store: Store<fromClient.State>,
    private userStore: Store<fromUser.State>,
    private clientService: ClientService,
    private clientMappingService: ClientMappingService,
    private translateService: TranslateService,
    private router: Router,
    public dialog: MatDialog,
    private fileExportService: FileExportService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    const previous = this.storageService.get('client.search');
    if (previous !== null) {
      const { search, parent } = JSON.parse(
        previous
      ) as ClientSearchVM;
      this.searchForm.patchValue({
        search: search,
        parent: parent
      });
    } else {
      const searchModel: ClientSearchVM = {
        pageIndex: 1,
        pageSize: 5
      };
      this.store.dispatch(new fromClientAction.UpdateSearch(searchModel));
    }
    this.loadParents();
    this.loading$ = this.store.pipe(select(fromClient.getLoading), takeWhile(() => this.componentActive));
    this.deletePermission$ = this.userStore.pipe(select(fromUser.isAllowed, { permissions: AllowedActions['delete-clients'] }), takeWhile(() => this.componentActive));
    this.result$ = this.store.pipe(select(fromClient.getSearchResult), takeWhile(() => this.componentActive));
    this.currentPage$ = this.store.pipe(select(fromClient.getCurrentIndex), takeWhile(() => this.componentActive));
    this.totalRecords$ = this.store.pipe(select(fromClient.getTotalRecord), takeWhile(() => this.componentActive));
    this.noRecords$ = this.store.pipe(select(fromClient.getNoRecords), takeWhile(() => this.componentActive));
    this.pageSize$ = this.store.pipe(select(fromClient.getPageSize), takeWhile(() => this.componentActive));
    this.searchModel$ = this.store.pipe(select(fromClient.getSearchModel), takeWhile(() => this.componentActive));
    this.searchModel$.subscribe(res => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(new fromClientAction.LoadClientList(this.searchModel));
      } else {
        const searchModel: ClientSearchVM = {
          pageIndex: 1,
          pageSize: 5
        };
        this.store.dispatch(new fromClientAction.UpdateSearch(searchModel));
      }
    });
    this.searchForm.get('parent')?.valueChanges.subscribe(res => {
      const update = { ...this.searchModel, pageIndex: 1, parent: res };
      this.store.dispatch(new fromClientAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe(res => {
      if (!res || (res && res.length > 2)) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromClientAction.UpdateSearch(update));
      }
    });
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  loadParents() {
    this.clientService.getClients({ limit: 1000000 }).subscribe(res => {
      this.parentList = res.data?.filter(a => a.children_ids && a.children_ids.length > 0);
    });
  }
  pageChange(event: any) {
    const update = { ...this.searchModel, pageSize: event.pageSize, pageIndex: event.pageIndex + 1 };
    this.store.dispatch(new fromClientAction.UpdateSearch(update));
  }
  searchChange() {
    const formValues = this.searchForm.getRawValue();
    const update = { ...this.searchModel, pageIndex: 1, parent: formValues.parent, search: formValues.search };
    this.store.dispatch(new fromClientAction.UpdateSearch(update));
  }
  navigateToDetail(data: ClientVM) {
    this.router.navigate(['/administration/clients', data.id]);
  }
  deleteRecord(data: ClientVM) {
    if (data.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant('administration.clients.table.remove.title'),
          message: this.translateService.instant('administration.clients.table.remove.message', { name: data.name }),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && data.id) {
          this.store.dispatch(new fromClientAction.DeleteClient(data.id));
        }
      });

    }
  }
  download() {
    this.searchModel$.pipe(take(1)).subscribe(model => {
      if (model) {
        const searchModel = this.clientMappingService.searchRequest(model);
        this.clientService.getClients({ include: searchModel.include, filters: searchModel.filters }).subscribe(res => {
          const { list } = this.clientMappingService.searchResponseToVM(res);
          const exportList: { name: any, partnerName: any, position: any, partnerEmail: any, phone: any }[] = [];
          if (list && list.length > 0) {
            list.forEach(client => {
              if (client.contacts?.length) {
                client.contacts.forEach(contact => {
                  exportList.push({ name: client.name || '', partnerName: contact.displayName || '', position: contact.position || '', partnerEmail: contact.email || '', phone: contact.phone || '' });
                });
              } else {
                exportList.push({ name: client.name || '', partnerName: '', position: '', partnerEmail: '', phone:  '' });
              }
            })
            const fieldNames = Object.keys(exportList[0]).map(a => this.translateService.instant('administration.clients.table.' + a));
            this.fileExportService.downloadCSV({
              headerFields: fieldNames,
              data: exportList,
              filePrefix: 'administration_clients_table'
            });
          }
        });
      }
    });
  }
}
