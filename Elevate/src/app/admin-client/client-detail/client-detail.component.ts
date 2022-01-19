import * as fromClient from './../state';
import * as fromClientAction from './../state/client.actions';
import * as fromUser from './../../root-state/user-state';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClientVM, SalesSlotVM } from '../../model/client.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ClientMappingService } from '../../services/mapping-services/client-mapping.service';
import { ClientService } from './../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContactMappingService } from '../../services/mapping-services';
import { ContactVM } from '../../model/contact.model';
import { FileExportService } from './../../services/file-export.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit, OnDestroy {
  id?: string | null;
  componentActive = true;
  clientDetail$: Observable<ClientVM | undefined> = of(undefined);
  salesSlots$: Observable<SalesSlotVM[] | undefined> = of(undefined);
  contacts$: Observable<ContactVM[] | undefined> = of(undefined);
  contactDetail$: Observable<ContactVM | undefined> = of(undefined);
  contactMode$: Observable<string | undefined> = of(undefined);
  manageContactPermission$: Observable<boolean> = of(false);
  backToProject: any;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private store: Store<fromClient.State>,
    private userStore: Store<fromUser.State>,
    private clientMappingService: ClientMappingService,
    private contactMappingService: ContactMappingService,
    private clientService: ClientService,
    private fileExportService: FileExportService,) { }


  ngOnInit(): void {
    this.store.dispatch(new fromClientAction.ClearClient());
    this.manageContactPermission$ = this.userStore.pipe(select(fromUser.isAllowed, {permissions: AllowedActions['manage-contacts']}), takeWhile(() => this.componentActive));
    this.retrieveIdFromParameters();
    this.backToProject = this.route.snapshot.paramMap.get('backToProject');
    this.clientDetail$ = this.store.pipe(select(fromClient.getClientDetail), takeWhile(() => this.componentActive));
    this.salesSlots$ = this.store.pipe(select(fromClient.getClientDetailSalesSlots), takeWhile(() => this.componentActive));
    this.contacts$ = this.store.pipe(select(fromClient.getClientContacts), takeWhile(() => this.componentActive));
    this.contactDetail$ = this.store.pipe(select(fromClient.getContact), takeWhile(() => this.componentActive));
    this.contactMode$ = this.store.pipe(select(fromClient.getContactMode), takeWhile(() => this.componentActive));
  }
  retrieveIdFromParameters() {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.loadDetail(params);
    });
  }
  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id');
      if (this.id) {
        this.store.dispatch(new fromClientAction.LoadClientDetail(this.id));
        this.store.dispatch(new fromClientAction.LoadClientContacts(this.id));
      }
    }
  }
  contactEdit(contact: ContactVM) {
    if (contact.id) {
      this.store.dispatch(new fromClientAction.LoadContactDetail(contact.id));
    }
  }
  contactDelete(contact: ContactVM) {
    if (contact.id && this.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant('administration.client.contacts.table.remove.title'),
          message: this.translateService.instant('administration.client.contacts.table.remove.message'),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && contact.id && this.id) {
          this.store.dispatch(new fromClientAction.DeleteContact({ id: contact.id, clientId: this.id }));
        }
      });
    }
  }
  addContact() {
    this.store.dispatch(new fromClientAction.NewContactDetail());
  }
  downloadContacts() {
    if (this.id) {
      this.clientService.getClientContactByClientId(this.id, { include: ['contact', 'user'] }).subscribe(res => {
        const { list } = this.contactMappingService.contactSearchResponseToVM(res);
        const exportList: {
          displayName: string, parent: string, position: string, department: string, email: string, phone: string, role: string
        }[] = [];
        if (list && list.length > 0) {
          list.forEach(contact => {
            exportList.push({
              displayName: contact.displayName || '', parent: contact.parent || '', position: contact.position || '', department: contact.department || '', email: contact.email || '', phone: contact.phone || '', role: contact.role || ''
            });
          })
          const fieldNames = Object.keys(exportList[0]).map(a => this.translateService.instant('administration.client.contacts.table.' + a));
          this.fileExportService.downloadCSV({
            headerFields: fieldNames,
            data: exportList,
            filePrefix: 'administration_client_contact_table'
          });
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }

}
