import * as fromContact from './../state';
import * as fromContactAction from './../state/contact.actions';

import { Component, HostListener, OnInit } from '@angular/core';
import { ContactSearchVM, ContactVM } from '../../model/contact.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { ClientService } from './../../services/client.service';
import { ContactMappingService } from './../../services/mapping-services/contact-mapping.service';
import { ContactService } from './../../services/contact.service';
import { FileExportService } from '../../services/file-export.service';
import { OptionVM } from './../../model/option.model';
import { Router } from '@angular/router';
import { SiteService } from './../../services/site.service';
import { TranslateService } from './../../services/translate.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  result$: Observable<ContactVM[]> = of([]);
  searchModel$: Observable<ContactSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: ContactSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  searchForm = new FormGroup({
    search: new FormControl(''),
    clientId: new FormControl(''),
    siteId: new FormControl(''),
  });
  loading$: Observable<boolean> = of(false);
  clientList: OptionVM[] = [];
  siteList: OptionVM[] = [];
  noRecords$: Observable<boolean> = of(false);

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('contact.search');
  }

  constructor(
    private store: Store<fromContact.State>,
    private router: Router,
    private clientService: ClientService,
    private contactService: ContactService,
    private translateService: TranslateService,
    private contactMappingService: ContactMappingService,
    private siteService: SiteService,
    private storageService: StorageService,
    private fileExportService: FileExportService
  ) {}

  ngOnInit(): void {
    const previous = this.storageService.get('contact.search');
    if (previous !== null) {
      const { search, clientId, siteId } = JSON.parse(
        previous
      ) as ContactSearchVM;
      this.searchForm.patchValue({
        search: search,
        clientId: clientId,
        siteId: siteId
      });
    } else {
      const searchModel: ContactSearchVM = {
        pageIndex: 1,
        pageSize: 6,
      };
      this.store.dispatch(new fromContactAction.UpdateSearch(searchModel));
    }
    this.loadClientList();
    this.loadSiteList();
    this.loading$ = this.store.pipe(
      select(fromContact.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromContact.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromContact.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromContact.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromContact.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromContact.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromContact.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromContactAction.LoadContactList(this.searchModel)
        );
      } else {
        const searchModel: ContactSearchVM = {
          pageIndex: 1,
          pageSize: 6,
        };
        this.store.dispatch(new fromContactAction.UpdateSearch(searchModel));
      }
    });
    this.searchForm.get('clientId')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, clientId: res };
      this.store.dispatch(new fromContactAction.UpdateSearch(update));
    });
    this.searchForm.get('siteId')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, siteId: res };
      this.store.dispatch(new fromContactAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromContactAction.UpdateSearch(update));
      }
    });
  }
  loadSiteList() {
    this.siteService
      .getSites({
        limit: 1000000,
        order_by: 'name',
        order_dir: 'asc',
        only_fields: [
          'site.id',
          'site.name',
          'site.zip',
          'site.city',
          'site.address',
          'site.number',
        ],
      })
      .subscribe((res) => {
        this.siteList = res.data
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
  }
  loadClientList() {
    this.clientService
      .getClients({
        limit: 1000000,
        order_by: 'name',
        order_dir: 'asc',
        only_fields: ['client.id', 'client.name'],
      })
      .subscribe((res) => {
        this.clientList = res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.name,
              };
            })
          : [];
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
    this.store.dispatch(new fromContactAction.UpdateSearch(update));
  }
  searchChange() {
    const formValues = this.searchForm.getRawValue();
    const update = {
      ...this.searchModel,
      pageIndex: 1,
      parent: formValues.parent,
      search: formValues.search,
    };
    this.store.dispatch(new fromContactAction.UpdateSearch(update));
  }
  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.contactMappingService.searchRequest(model);
        this.contactService
          .getContacts({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const {
              list,
            } = this.contactMappingService.contactSearchResponseToVM(res);
            const exportList: {
              fullname: any;
              position: any;
              department: any;
              email: any;
              phone: any;
            }[] = [];
            if (list && list.length > 0) {
              list.forEach((contact) => {
                exportList.push({
                  fullname:
                    (contact.salutation
                      ? this.translateService.instant(
                          'administration.contact.fields.salutation.' +
                            contact.salutation
                        ) + ' '
                      : '') + contact.fullname || '',
                  position: contact.position || '',
                  department: contact.department || '',
                  email: contact.email || '',
                  phone: contact.phone || '',
                });
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('administration.contacts.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'administration_contact_table',
              });
            }
          });
      }
    });
  }
}
