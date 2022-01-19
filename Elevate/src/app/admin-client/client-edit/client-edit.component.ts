import * as fromClient from './../state';
import * as fromClientAction from './../state/client.actions';
import * as fromUser from './../../root-state/user-state';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ClientVM, SalesSlotVM } from '../../model/client.model';
import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ClientMappingService } from '../../services/mapping-services/client-mapping.service';
import { ClientResponse } from '../../model/client.response';
import { ClientService } from './../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContactMappingService } from '../../services/mapping-services/contact-mapping.service';
import { ContactVM } from '../../model/contact.model';
import { FileExportService } from './../../services/file-export.service';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from './../../services/translate.service';
import { phoneValidator } from '../../utility/phone.validator';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {
  id?: string | null;
  componentActive = true;
  @Output() savedetail = new EventEmitter<string>();
  loading$: Observable<boolean> = of(false);
  clientDetail: ClientVM | undefined = undefined;
  // salesSlots$: Observable<SalesSlotVM[] | undefined> = of(undefined);
  contacts$: Observable<ContactVM[] | undefined> = of(undefined);
  contactDetail$: Observable<ContactVM | undefined> = of(undefined);
  contactMode$: Observable<string | undefined> = of(undefined);

  detailForm?: FormGroup;
  validationMessages: any;
  displayMessage: any = {};
  parentLK: ClientResponse[] | null = [];
  mode?: string;
  get freelancer_ratings() {
    return this.detailForm ? this.detailForm.get('freelancer_ratings') as FormArray : undefined;
  }

  get custom_properties() {
    return this.detailForm ? this.detailForm.get('custom_properties') as FormArray : undefined;
  }

  get salesSlots(): FormArray | undefined {
    return this.detailForm ? this.detailForm.get('salesSlots') as FormArray : undefined;
  }
  manageContactPermission$: Observable<boolean> = of(false);
  backToProject: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private userStore: Store<fromUser.State>,
    private genericValidatorService: GenericValidatorService,
    private clientMappingService: ClientMappingService,
    private contactMappingService: ContactMappingService,
    private clientService: ClientService,
    private fileExportService: FileExportService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private store: Store<fromClient.State>,
    private el: ElementRef) { }

  ngOnInit(): void {
    this.store.dispatch(new fromClientAction.ClearClient());
    this.manageContactPermission$ = this.userStore.pipe(select(fromUser.isAllowed, { permissions: AllowedActions['manage-contacts'] }), takeWhile(() => this.componentActive));
    this.loadLookUps();
    this.initForm();
    this.retrieveIdFromParameters();
    this.backToProject = this.route.snapshot.paramMap.get('backToProject');
    this.loading$ = this.store.pipe(select(fromClient.getLoading), takeWhile(() => this.componentActive));
    this.store.pipe(select(fromClient.getClientDetail), takeWhile(() => this.componentActive)).subscribe(res => {
      this.clientDetail = res;
      this.patchClientDetail();
    });
    // this.salesSlots$ = this.store.pipe(select(fromClient.getClientDetailSalesSlots), takeWhile(() => this.componentActive));
    this.contacts$ = this.store.pipe(select(fromClient.getClientContacts), takeWhile(() => this.componentActive));
    this.contactDetail$ = this.store.pipe(select(fromClient.getContact), takeWhile(() => this.componentActive));
    this.contactMode$ = this.store.pipe(select(fromClient.getContactMode), takeWhile(() => this.componentActive));
  }
  patchClientDetail() {
    if (this.clientDetail && this.detailForm) {
      this.detailForm.reset();
      if( this.validationMessages){
        this.validationMessages.custom_properties = [];
        this.validationMessages.saleSlots = [];
      }

      const obj = {
        name: this.clientDetail.name,
        parent_id: this.clientDetail.parent_id,
        debitorid: this.clientDetail.debitorid,
        address: this.clientDetail.address,
        addressaddition: this.clientDetail.addressaddition,
        zip: this.clientDetail.zip,
        city: this.clientDetail.city,
        country: this.clientDetail.country,
        phone: this.clientDetail.phone,
        email: this.clientDetail.email,
      };
      this.custom_properties?.clear();
      this.salesSlots?.clear();
      this.freelancer_ratings?.clear();
      this.displayMessage = {};
      if (this.clientDetail.custom_properties) {
        this.clientDetail.custom_properties.forEach(a => {
          this.addProperty(a);
        });
      }
      if (this.clientDetail.freelancer_ratings) {
        this.clientDetail.freelancer_ratings.forEach(a => {
          this.addCriteria(a);
        });
      }
      if (this.clientDetail.saleslots) {
        this.clientDetail.saleslots.forEach(a => {
          this.addSlot({ ...a });
        });
      }
      // custom_properties: this.clientDetail.custom_properties ? this.clientDetail.custom_properties : [],
      //   freelancer_ratings: this.clientDetail.freelancer_ratings ? this.clientDetail.freelancer_ratings : [],
      //   saleSlots: this.clientDetail.saleslots ? this.clientDetail.saleslots.map(a => {
      //     return { ...a };
      //   }) : [],
      this.detailForm.patchValue(obj);
    }
  }
  loadLookUps() {
    this.clientService.getClients({ limit: 100000, filters: [{ key: 'orphan', value: true }] }).subscribe(res => {
      this.parentLK = res.data && res.data.length ? res.data : null;
    });
  }
  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe(res => {
      this.mode = res.mode;
      if (res.mode === 'edit') {
        this.route.paramMap.pipe(take(1)).subscribe(params => {
          this.loadDetail(params);
        });
      } else {
        this.store.dispatch(new fromClientAction.NewClientDetail());
      }
    });

  }
  initForm() {
    this.detailForm = this.fb.group({
      name: ['', [Validators.required]],
      parent_id: ['', []],
      debitorid: ['', []],
      address: ['', [Validators.required]],
      addressaddition: ['', []],
      zip: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phone: ['', [phoneValidator()]],
      email: ['', [Validators.email, Validators.minLength(6)]],
      freelancer_ratings: this.fb.array([]),
      custom_properties: this.fb.array([]),
      salesSlots: new FormArray([]),
    });

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        name: {
          required: this.translateService.instant('form.errors.required'),
        },
        address: {
          required: this.translateService.instant('form.errors.required'),
        },
        zip: {
          required: this.translateService.instant('form.errors.required'),
        },
        city: {
          required: this.translateService.instant('form.errors.required'),
        },
        country: {
          required: this.translateService.instant('form.errors.required'),
        },
        email: {
          email: this.translateService.instant('form.errors.email'),
          minlength: this.translateService.instant('form.errors.minLengthEmail', { minlength: 6 }),
        },
        phone: {
          phone: this.translateService.instant('form.errors.phonenumberformat')
        },
        freelancer_ratings: [],
        custom_properties: [],
        salesSlots: []
      };
      if (this.detailForm) {
        this.detailForm.valueChanges.subscribe((value) => {
          if (this.detailForm) {
            this.displayMessage = this.genericValidatorService.processMessages(
              this.detailForm,
              this.validationMessages
            );
          }
        });
      }
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
  addProperty(value?: string) {
    if (this.custom_properties) {
      this.custom_properties.push(this.getNewProperty(value));
      this.validationMessages.custom_properties.push({ required: this.translateService.instant('form.errors.required') });
    }
  }
  getNewProperty(value?: string) {
    return new FormControl(value, [Validators.required]);
  }
  removeProperty(i: number) {
    if (this.custom_properties) {
      this.custom_properties.removeAt(i);
      this.validationMessages.custom_properties.slice(i, 1);
      this.validationMessages.custom_properties = this.validationMessages.custom_properties;
    }
  }
  addCriteria(value?: string) {
    if (this.freelancer_ratings) {
      this.freelancer_ratings.push(this.getNewCriteria(value));
      this.validationMessages.freelancer_ratings.push({ required: this.translateService.instant('form.errors.required') });
    }
  }
  getNewCriteria(value?: string) {
    return new FormControl(value, [Validators.required]);
  }
  removeCriteria(i: number) {
    if (this.freelancer_ratings) {
      this.freelancer_ratings.removeAt(i);
      this.validationMessages.freelancer_ratings.slice(i, 1);
      this.validationMessages.freelancer_ratings = this.validationMessages.freelancer_ratings;
    }
  }

  addSlot(values?: SalesSlotVM) {
    if (this.salesSlots) {
      this.salesSlots.push(this.getNewSlot(values));
      this.validationMessages.salesSlots.push({
        name: { required: this.translateService.instant('form.errors.required') }
      });
    }
  }
  getNewSlot(values?: SalesSlotVM) {
    if (values) {
      return this.fb.group({
        name: new FormControl(values.name, [Validators.required]),
        price: new FormControl(values.price, []),
        description: new FormControl(values.description, [])
      });
    } else {
      return this.fb.group({
        name: new FormControl('', [Validators.required]),
        price: new FormControl('', []),
        description: new FormControl('', [])
      });
    }

  }
  removeSlot(i: number) {
    if (this.salesSlots) {
      this.salesSlots.removeAt(i);
      this.validationMessages.salesSlots.slice(i, 1);
      this.validationMessages.salesSlots = this.validationMessages.salesSlots;
    }
  }
  cancelEdit() {
    if (this.id) {
      this.router.navigate(['/administration/clients', this.id]);
    } else {
      this.router.navigate(['/administration/clients']);
    }
  }
  saveDetail() {
    if (this.detailForm) {
      this.detailForm.markAllAsTouched();
      this.detailForm.markAsDirty();
      if (this.detailForm.valid) {
        const formValue = this.detailForm.getRawValue();
        const obj: ClientVM = {
          name: formValue.name,
          parent_id: formValue.parent_id,
          debitorid: formValue.debitorid,
          address: formValue.address,
          addressaddition: formValue.addressaddition,
          zip: formValue.zip,
          city: formValue.city,
          country: formValue.country,
          phone: formValue.phone,
          email: formValue.email,
        }
        if (formValue.custom_properties) {
          obj.custom_properties = [];
          formValue.custom_properties.forEach((a: string) => {
            if (obj.custom_properties) {
              obj.custom_properties.push(a);
            }
          });
        }
        if (formValue.freelancer_ratings) {
          obj.freelancer_ratings = [];
          formValue.freelancer_ratings.forEach((a: string) => {
            if (obj.freelancer_ratings) {
              obj.freelancer_ratings.push(a);
            }
          });
        }
        if (formValue.salesSlots) {
          obj.saleslots = [];

          formValue.salesSlots.forEach((a: SalesSlotVM) => {
            if (obj.saleslots) {
              obj.saleslots.push({ ...a });
            }
          });
        }
        if (this.id) {
          obj.id = this.id;
          this.store.dispatch(new fromClientAction.UpdateClient({ client: obj }));
        } else {
          this.store.dispatch(new fromClientAction.CreateClient({ client: obj, backToProject: this.backToProject }));
        }
      } else {
        this.displayMessage = this.genericValidatorService.processMessages(
          this.detailForm,
          this.validationMessages
        );
        for (const key of Object.keys(this.detailForm.controls)) {
          if (this.detailForm.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            if (invalidControl) {
              invalidControl.focus();
            }
            break;
          }
        }
      }

    }
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
