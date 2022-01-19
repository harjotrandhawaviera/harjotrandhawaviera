import * as moment from 'moment';

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AgentService } from '../../services/agent.service';
import { BudgetService } from '../../services/budget.service';
import { CertificateMappingService } from '../../services/mapping-services/certificate-mapping.service';
import { CertificateService } from '../../services/certificate.service';
import { EditorConfig } from '../../constant/editor.constant';
import { FormConfig } from '../../constant/forms.constant';
import { MY_FORMATS } from '../../model/date-format.model';
import { OptionVM } from '../../model/option.model';
import { ProjectVM } from '../../model/project.model';
import { SiteService } from '../../services/site.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-job-detail-general-edit',
  templateUrl: './job-detail-general-edit.component.html',
  styleUrls: ['./job-detail-general-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class JobDetailGeneralEditComponent implements OnInit {
  @Input() id: string | null | undefined = undefined;
  @Input() displayMessage: any = {};
  @Input() group: FormGroup | undefined;
  @Input() overwriteAllowed: boolean | null = false;
  @Input() project: ProjectVM | undefined;
  @Input() budgetLK: OptionVM[] = [];
  @Input() createMode: boolean = true;

  @Output() addAdditionalCost = new EventEmitter<void>();
  @Output() removeAdditionalCost = new EventEmitter<number>();

  siteList: OptionVM[] = [];
  agentLK: OptionVM[] = [];
  stateLK: OptionVM[] = [];
  categoryLK: OptionVM[] = [];
  certificateLK: OptionVM[] = [];
  totalSiteCount?: number;
  selectedSites?: number;
  startTime: string = '';
  startDate: string = '';
  endTime: string = '';

  get additional_costs(): FormArray | undefined {
    return this.group
      ? (this.group.get('additional_costs') as FormArray)
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
  durationValue = 0;
  editorConfig = EditorConfig;

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private agentService: AgentService,
    private certificateService: CertificateService,
    private certificateMappingService: CertificateMappingService,
    private translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.group) {
      this.getSelectedSiteCount();
    }
    if (changes.project) {
      this.getCustomProperties();
    }
  }

  getSelectedSiteCount() {
    if (this.group) {
      this.group.get('site_ids')?.valueChanges.subscribe((res) => {
        if (res) {
          this.selectedSites = res.length;
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadSiteList();
    this.group?.get('start_time')?.valueChanges.subscribe((res) => {
      this.startTime = res;
    });
    this.group?.get('start_date')?.valueChanges.subscribe((res) => {
      this.startDate= res;
      this.onDateChange(null);
    });
  }

  loadLookups() {
    // agent Lookup
    this.agentService
      .getAgents({
        limit: 10000,
        include: ['user'],
        only_fields: ['agent.id', 'agent.fullname', 'user.id', 'user.rights'],
        filters: [{ key: 'only_active', value: true }],
      })
      .subscribe((res) => {
        this.agentLK = this.sortOption(
          res.data
            ? res.data.map((a) => {
                return {
                  value: a.id,
                  text: a.fullname,
                };
              })
            : []
        );
      });

    // State Lookup
    this.stateLK = [...FormConfig.inherited.state].map((a) => {
      return {
        value: a,
        text: this.translateService.instant(
          'projects.inherited.fields.state.' + a
        ),
      };
    });

    // Category Lookup
    this.categoryLK = [...FormConfig.projects.category].map((a) => {
      return {
        value: a,
        text: '',
      };
    });

    // certificate Lookup
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
              data: { is_exclusive: a.is_exclusive },
            };
          })
        );
      });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  loadSiteList() {
    this.siteService
      .getSites({
        limit: 1000000,
        order_by: 'name',
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
        this.totalSiteCount = res.meta?.count;
      });
  }

  getCustomProperties() {
    if (this.group) {
      let customPropertiesGroup = this.group.get(
        'custom_properties'
      ) as FormGroup;
      if (customPropertiesGroup) {
        for (const controlKey in customPropertiesGroup.controls) {
          if (customPropertiesGroup.controls.hasOwnProperty(controlKey)) {
            customPropertiesGroup.removeControl(controlKey);
          }
        }
        if (this.project && this.project.client) {
          this.project.client.custom_properties?.forEach((a) => {
            customPropertiesGroup.addControl(a, this.fb.control('', []));
          });
        }
      }
    }
  }

  addAdditionalCostClick() {
    this.addAdditionalCost.emit();
  }

  removeAdditionalCostClick(i: number) {
    this.removeAdditionalCost.emit(i);
  }

  onDateChange(date: any) {
    this.durationValue = 0;
    if (this.group && this.group.get('start_date')?.value && this.group.get('finish_date')?.value) {
      this.durationValue = moment(this.group.get('finish_date')?.value).diff(moment(this.group.get('start_date')?.value), 'days') + 1;
      if(this.durationValue < 0) {
        this.group.get('finish_date')?.reset();
        this.durationValue = 0;
      }
    }
  }
}
