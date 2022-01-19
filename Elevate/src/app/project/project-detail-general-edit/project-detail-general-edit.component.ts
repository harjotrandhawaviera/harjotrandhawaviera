import * as fromClient from '../../admin-client/state';
import * as moment from 'moment';

import {ClientVM, SalesSlotVM} from './../../model/client.model';
import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {Observable, Subscription, of} from 'rxjs';
import {Store, select} from '@ngrx/store';
import {map, startWith, takeWhile, tap} from 'rxjs/operators';

import { AgentService } from './../../services/agent.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BudgetService } from './../../services/budget.service';
import { CertificateMappingService } from './../../services/mapping-services/certificate-mapping.service';
import { CertificateService } from './../../services/certificate.service';
import {ClientDetailComponent} from '../../admin-client/client-detail/client-detail.component';
import {ClientEditComponent} from '../../admin-client/client-edit/client-edit.component';
import { ClientMappingService } from './../../services/mapping-services/client-mapping.service';
import { ClientService } from './../../services/client.service';
import { ContractTypesService } from '../../services/contract-types.service';
import { CountryMaster } from '../../constant/countrymaster.constant';
import { DocumentVM } from './../../model/document.model';
import { EditorConfig } from '../../constant/editor.constant';
import { FormConfig } from './../../constant/forms.constant';
import { LocationsService } from '../../services/locations.service';
import { MY_FORMATS } from '../../model/date-format.model';
import { Moment } from 'moment';
import { OptionVM } from './../../model/option.model';
import { ProjectDocumentVM } from '../../model/project.model';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';
import { SkillService } from '../../services/skill.service';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-project-detail-general-edit',
  templateUrl: './project-detail-general-edit.component.html',
  styleUrls: ['./project-detail-general-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ProjectDetailGeneralEditComponent implements OnInit, OnChanges {
  @Input()
  id: string | null | undefined = undefined;
  @Input()
  displayMessage: any = {};
  @Input()
  templateDocuments: ProjectDocumentVM[] | undefined | null = undefined;
  @Input()
  group: FormGroup | any;
  @Input()
  customProperties: any;
  agentLK: OptionVM[] = [];
  filteredOptions: Observable<ClientVM[]> | any;
  currencySymbol = '';
  poCurrencySymbol = '';
  clientLK1: OptionVM[] = [];
  result: any;
  name: any;
  editData: any = of([]);
  @ViewChild(ClientEditComponent)  child: any;
  @Output() clientSalesSlot = new EventEmitter<SalesSlotVM[]>();
  @Output() clientFreelancerRatings = new EventEmitter<string[]>();
  @Output() addAdditionalCost = new EventEmitter<void>();
  @Output() documentUploaded = new EventEmitter<ProjectDocumentVM>();
  @Output() documentDeleted = new EventEmitter<number>();
  @Output() removeAdditionalCost = new EventEmitter<number>();
  @Output() addAdditionalTargetBudget = new EventEmitter<void>();
  @Output() removeTargetBudget = new EventEmitter<number>();
  clientLK: OptionVM[] = [];
  certificateLK: OptionVM[] = [];
  componentActive = true;
  contractTypeLK: any;
  stateLK: OptionVM[] = [];
  roleLK: OptionVM[] = [];
  categoryLK: OptionVM[] = [];
  orderLK: OptionVM[] = [];
  contactLK: OptionVM[] = [];
  budgetLK: OptionVM[] = [];
  noContactExist = false;
  selectedOrderId: any;
  currencyOpt: any[] = [];
  brandOpt: any[] = [];
  countryMaster: any;
  primaryStates: any;
  primaryCities: any;
  siteStates: any;
  siteCities: any;
  selectedValue: []| any;
   option: any;

  get additional_costs(): FormArray | undefined {
    return this.group
      ? (this.group.get('additional_costs') as FormArray)
      : undefined;
  }
  get target_budget(): FormArray | undefined {
    return this.group
      ? (this.group.get('target_budget') as FormArray)
      : undefined;
  }
  get custom_properties(): FormGroup | undefined {
    return this.group
      ? (this.group.get('custom_properties') as FormGroup)
      : undefined;
  }
  get custom_propertiesKey(): string[] {
    return this.custom_properties
      ? Object.keys(this.custom_properties.controls)
      : [];
  }
  skillsRequired: any;
  editorConfig = EditorConfig;
  durationValue = 0;
  today = new Date();
  skills: any;
  startDate: any;

  constructor(
    private clientService: ClientService,
    private agentService: AgentService,
    private certificateService: CertificateService,
    private contractTypesService: ContractTypesService,
    private translateService: TranslateService,
    private budgetService: BudgetService,
    private fb: FormBuilder,
    private store: Store<fromClient.State>,
    private clientMappingService: ClientMappingService,
    private certificateMappingService: CertificateMappingService,
    private router: Router,
    private locationService: LocationsService,
    private skillsService: SkillService,
    private roleService: RoleService,

  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.group) {
      if (this.group) {
        this.onClientChanges();
        this.onContractTypeChange();
        this.onOrderChange();
        this.group?.get('skills_required')?.valueChanges.subscribe((res: any) => {
          this.skillsRequired = res;
          this.currencySymbol = this.group?.get('currency')?.value;
          this.poCurrencySymbol = this.group?.get('po_currency')?.value;
          this.onDateChange(null);
        });
        this.group?.get('started_at')?.valueChanges.subscribe((res: any) => {
          this.startDate= res;
          this.onDateChange(null);
        });
      }
    }
  }

  private onOrderChange() {
    if (this.group) {
      const orderIdControl = this.group.get('order_id');
      if (orderIdControl) {
        orderIdControl.valueChanges.subscribe((res: any) => {
          if (res && !this.id) {
            const selectedOrder = this.orderLK.find((a) => a.value === res);
            if (selectedOrder && selectedOrder.data.assignment_budget) {
              if (!this.selectedOrderId) {
                this.selectedOrderId = res;
                this.group
                  ?.get('assignment_budget')
                  ?.patchValue(selectedOrder.data.assignment_budget);
              } else if (res !== this.selectedOrderId) {
                this.group
                  ?.get('assignment_budget')
                  ?.patchValue(selectedOrder.data.assignment_budget);
              }
            }
          }
        });
      }
    }
  }

  private onContractTypeChange() {
    if (this.group) {
      const contractTypeControl = this.group.get('contract_type_id');
      if (contractTypeControl) {
        contractTypeControl.valueChanges.subscribe((res : any) => {
          if (res && !this.id) {
            this.contractTypesService
              .getContractType({ id: res })
              // tslint:disable-next-line:no-shadowed-variable
              .subscribe((res) => {
                if (res && res.data && res.data.identifier) {
                  const iden = res.data.identifier;
                  this.translateService
                    .get('projects.fields.briefing.value.' + iden, {})
                    .subscribe((tran) => {
                      if (this.group) {
                        this.group.get('briefing')?.patchValue(tran);
                        this.group
                          .get('information')
                          ?.patchValue(
                            this.translateService.instant(
                              'projects.fields.information.value.' + iden
                            )
                          );
                        this.group
                          .get('description')
                          ?.patchValue(
                            this.translateService.instant(
                              'projects.fields.description.value.' + iden
                            )
                          );
                      }
                    });
                }
              });
          }
        });
      }
    }
  }

  private onClientChanges() {
    if (this.group) {
      const customPropertiesGroup = this.group.get(
        'custom_properties'
      ) as FormGroup;
      const clientIDControl = this.group.get('client_id');
      if (clientIDControl) {
        clientIDControl.valueChanges.subscribe((res: any) => {
          if (res) {
            if (customPropertiesGroup) {
              this.clientService
                .getClientById({ id: res })
                .subscribe((clientRes) => {
                  if (clientRes.data) {
                    const client = this.clientMappingService.clientResponseToVM(
                      clientRes.data
                    );
                    if (client.custom_properties) {
                      if (!this.id) {
                        if (client.freelancer_ratings) {
                          this.clientFreelancerRatings.emit(client.freelancer_ratings);
                        }
                        if (client.saleslots) {
                          this.clientSalesSlot.emit(client.saleslots);
                        }
                        for (const controlKey in customPropertiesGroup.controls) {
                          if (
                            customPropertiesGroup.controls.hasOwnProperty(
                              controlKey
                            )
                          ) {
                            customPropertiesGroup.removeControl(controlKey);
                          }
                        }
                        client.custom_properties.forEach((a) => {
                          customPropertiesGroup.addControl(
                            a,
                            this.fb.control('', [])
                          );
                        });
                      } else {
                        client.custom_properties.forEach((a) => {
                          if (!customPropertiesGroup.get('a')) {
                            customPropertiesGroup.addControl(
                              a,
                              this.fb.control('', [])
                            );
                          }
                        });
                      }
                    }
                  }
                });
            }
            this.clientService
              .getClientOrders(res, { include: ['budget'] })
              .subscribe((orders) => {
                if (orders.data) {
                  this.orderLK = this.sortOption(
                    orders.data.map((a) => {
                      return {
                        value: a.id,
                        text: a.name,
                        data: a,
                      };
                    })
                  );
                } else {
                  this.orderLK = [];
                }
                this.updateOrderIfNotExists();
              });
            this.clientService
              .getClientContactByClientId(res, {
                include: ['contact', 'user'],
              })
              .subscribe((contact) => {
                if (contact.data) {
                  this.contactLK = this.sortOption(
                    contact.data.map((a) => {
                      return {
                        value: a.id,
                        text: [a.lastname, a.firstname].join(' '),
                      };
                    })
                  );
                } else {
                  this.contactLK = [];
                }
                this.updateContactIfNotExists();
                this.noContactExist = !(this.contactLK.length > 0);
              });
            this.budgetService
              .getBudgets({
                limit: 100000,
                order_by: 'name',
                order_dir: 'asc',
                include: ['contacts'],
                only_fields: [
                  'budget.id',
                  'budget.available',
                  'budget.name',
                  'contact.id',
                  'contact.lastname',
                  'contact.firstname',
                  'client.id',
                  'client.name',
                ],
                filters: [{ key: 'client_id', value: res }],
              })
              .subscribe((budgets) => {
                this.budgetLK = this.sortOption(
                  budgets.data
                    ? budgets.data.map((a) => {
                      return {
                        value: a.id,
                        text: a.name,
                      };
                    })
                    : []
                );
                this.updateBudgetIfNotExists();
              });
          }
        });
      }
    }
  }

  updateBudgetIfNotExists() {
    if (this.group) {
      const budgetControl = this.group.get('budget_id');
      if (budgetControl) {
        if (!this.budgetLK.find((a) => a.value === budgetControl.value)) {
          budgetControl.patchValue(null);
        }
      }
    }
  }
  updateOrderIfNotExists() {
    if (this.group) {
      const orderControl = this.group.get('order_id');
      if (orderControl) {
        if (!this.orderLK.find((a) => a.value === orderControl.value)) {
          orderControl.patchValue(null);
        }
      }
    }
  }
  updateContactIfNotExists() {
    if (this.group) {
      const contactControl = this.group.get('contact_id');
      if (contactControl) {
        if (!this.contactLK.find((a) => a.value === contactControl.value)) {
          contactControl.patchValue(null);
        }
      }
    }
  }

  ngOnInit(): void {
    this.customClientPatch();
    this.clientService.getClientLK().subscribe((response: any) => {
      this.editData = response;
      // this.group.patchValue({
      //
      //    client_id: response?.result?.id,
      //    text: response?.result?.name ,
      //
      // });
      this.id = response?.result?.id;
      this.clientLK1 = response?.result?.name;
      this.clientLK1 && this.clientLK1.forEach((res: any) => this.group.push(new FormControl(res)));
    });

    this.clientService.getClientLK().subscribe((res: any) => {
      this.clientLK = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              value: a.id,
              text: a.name,
              info: [a.zip, a.city, a.address].filter((a) => a).join(' '),
            };
          })
          : []
      );
    });
    //
    this.clientService.getClientLK().subscribe((res) => {
      this.clientLK1 = this.sortOption(
        res.data
          ? res.data.map((a) => {
            return {
              value: a.id,
              text: a.name,
              info: [a.zip, a.city, a.address].filter((a) => a).join(' '),
            };
          })
          : []
      );
    });

    this.agentService
      .getAgents({
        limit: 10000,
        only_fields: ['agent.id', 'agent.fullname', 'user.id', 'user.rights'],
        filters: [
          { key: 'include', value: 'user' },
          { key: 'only_active', value: true },
        ],
      })
      .subscribe((res) => {
        this.agentLK = this.sortOption(
          res.data
            ? res.data
              .filter(
                (a) =>
                  a.user &&
                  a.user.data &&
                  a.user.data.rights &&
                  a.user.data.rights.includes('MANAGE_PROJECTS')
              )
              .map((a) => {
                return {
                  value: a.id,
                  text: a.fullname,
                };
              })
            : []
        );
      });

    this.certificateService
      .getCertificate({
        limit: 100000,
        order_by: 'name',
        only_fields: [
          'certificate.id',
          'certificate.name',
          'certificate.is_exclusive',
          'certificate.description',
          'certificate.teaser',
        ],
        filters: [{ key: 'only_enabled', value: true }],
      })
      .subscribe((res) => {
        const certificate = this.certificateMappingService.certificateMultipleResponseToVM(
          res
        );
        this.certificateLK = this.sortOption(
          (certificate && certificate.list ? certificate.list : []).map((a) => {
            return {
              value: a.id,
              text: a.name,
            };
          })
        );
      });

    this.contractTypesService
      .getContractTypes({})
      .pipe(takeWhile(() => this.componentActive))
      .subscribe((res) => {
        this.contractTypeLK = this.sortOption(
          res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.name,
              };
            })
            : []
        );
      });

    this.stateLK = [...FormConfig.projects.state].map((a) => {
      return {
        value: a,
        text: '',
      };
    });

    this.categoryLK = [...FormConfig.projects.category].map((a) => {
      return {
        value: a,
        text: '',
      };
    });

    this.currencyOpt = [...FormConfig.currency].map((a) => {
      return {
        value: a,
        text: '',
      };
    });

    this.brandOpt = [...FormConfig.projects.brands].map((a) => {
      return {
        value: a,
        text: '',
      };
    });

    if (this.group?.get('primary_country')) {
      this.group?.get('primary_country')?.valueChanges.subscribe((id: any) => {
        this.primaryStates = [];
        this.setState(id, 'primary');
        this.primaryCities = [];
      });
    }
    if (this.group?.get('primary_state')) {
      this.group?.get('primary_state')?.valueChanges.subscribe((id: any) => {
        this.primaryCities = [];
        this.setCity(id, 'primary');
      });
    }
    if (this.group?.get('site_country')) {
      this.group?.get('site_country')?.valueChanges.subscribe((id: any) => {
        this.siteStates = [];
        this.setState(id, 'site');
        this.siteCities = [];
      });
    }
    if (this.group?.get('site_state')) {
      this.group?.get('site_state')?.valueChanges.subscribe((id: any) => {
        this.siteCities = [];
        this.setCity(id, 'site');
      });
    }
    this.setCountry();
    this.skillsService.getSkillsTree().subscribe(data => {
      this.skills = data;
    });
    this.roleService.getRoles({}).subscribe(data => {
      this.roleLK = [...data.data].map((a) => {
        return {
          value: `${a.id}`,
          text: a.label,
        };
      });
    });
  }
  customClientPatch() {
    this.store.select(fromClient.newSavedClient).subscribe((res) => {
      if (res) {
        this.group.patchValue({
          client_id: res?.id
        });
      }
    });
  }

  setCountry() {
    this.locationService.getLocation({
      filters: [
        { key: 'type', value: 'country' },
      ],
    }).subscribe((res) => {
      this.countryMaster = res.data ? res.data : [];
    });
  }
  setState(id: number, type: string) {
    id && this.locationService.getLocation({
      filters: [
        { key: 'type', value: 'state' },
        { key: 'master_country_id', value: id}
      ],
    }).subscribe((res) => {
      if (type === 'primary') {
        this.primaryStates = res.data ? res.data : [];
      } else {
        this.siteStates = res.data ? res.data : [];
      }
    });
  }
  setCity(id: number, type: string) {
    id && this.locationService.getLocation({
      filters: [
        { key: 'type', value: 'city' },
        { key: 'master_state_id', value: id}
      ],
    }).subscribe((res) => {
      if (type === 'primary') {
        this.primaryCities = res.data ? res.data : [];
      } else {
        this.siteCities = res.data ? res.data : [];
      }
    });
  }
  addAdditionalCostClick() {
    this.addAdditionalCost.emit();
  }
  removeAdditionalCostClick(i: number) {
    this.removeAdditionalCost.emit(i);
  }
  addAdditionalTargetBudgetClick() {
    this.addAdditionalTargetBudget.emit();
  }
  removeTargetBudgetClick(i: number) {
    this.removeTargetBudget.emit(i);
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  documentUploadedCallback(document: DocumentVM) {
    if (this.id) {
      this.documentUploaded.emit({ ...document, project_id: Number(this.id) });
    } else {
      this.documentUploaded.emit({ ...document });
    }
  }
  documentDeletedCallback(docId: number) {
    this.documentDeleted.emit(docId);
  }
  addClient() {
    this.router.navigate(['/administration/clients/create', {backToProject: true}]);
  }

  onDateChange(date: any) {
    this.durationValue = 0;
    if (this.group && this.group.get('started_at')?.value && this.group.get('finished_at')?.value) {
      this.durationValue = moment(this.group.get('finished_at')?.value).diff(moment(this.group.get('started_at')?.value), 'days') + 1;
      if (this.durationValue < 0) {
        this.group.get('finished_at')?.reset();
        this.durationValue = 0;
      }
    }
  }

  copyPrimaryAddress(checked: boolean) {
    this.siteCities = this.primaryCities;
    this.siteStates = this.primaryStates;
    this.group?.get('site_address')?.patchValue(checked ? this.group?.get('primary_address')?.value : '');
    this.group?.get('site_country')?.patchValue(checked ? this.group?.get('primary_country')?.value : '');
    this.group?.get('site_state')?.patchValue(checked ? this.group?.get('primary_state')?.value : '');
    this.group?.get('site_city')?.patchValue(checked ? this.group?.get('primary_city')?.value : '');
    this.group?.get('site_zip')?.patchValue(checked ? this.group?.get('primary_zip')?.value : '');
  }

  checkboxTreeOutput(event: []) {
    this.group?.get('skills_required')?.patchValue(event);
  }

  onCurrencyChange(event: any, isPo = false) {
    const currency = this.currencyOpt.filter(curr => curr.value === event.value);
    if (isPo) {
      this.poCurrencySymbol = currency[0].value;
    } else {
      this.currencySymbol = currency[0].value;
    }
  }

  copyTargetBudget(checked: boolean) {
    this.group?.get('po_currency')?.patchValue(checked ? this.group?.get('currency')?.value : '');
    this.poCurrencySymbol = checked ? this.currencySymbol : '';
  }
}
