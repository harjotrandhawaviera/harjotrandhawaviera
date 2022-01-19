import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { OptionVM } from './../../model/option.model';
import { FormConfig } from './../../constant/forms.constant';
import {ProjectService} from './../../services/project.service';
import {FormControl, FormGroup} from "@angular/forms";
import { TranslateService } from '../../services/translate.service';
import { ReportAdminSearchModel } from '../../model/report-admin.model';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdvanceSearchComponent implements OnInit{
  searchModel: ReportAdminSearchModel = {};
  filters = new FormGroup({
    status: new FormControl(),
    city: new FormControl(),
    zip: new FormControl(),
    gender: new FormControl(),
    skill: new FormControl(),
    work_condition: new FormControl(),
    project: new FormControl(),
    certificates: new FormControl(),
    age_group: new FormControl(),
    own_car: new FormControl(),
    has_driverslicense: new FormControl(),
    language: new FormControl(),
  });
  stateLK: OptionVM | any;
  cityLK: OptionVM | any;
  certificatesLK: OptionVM | any;
  postcodeLK: OptionVM | any;
  ageLK: OptionVM | any;
  genderLK: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  skillsLk: OptionVM[] = [];
  workConditionLk: OptionVM[] = [];
  driverLicenceLK: OptionVM[] = [];
  driverLicenceTypeLK: any[] = [];
  ownCarLK: OptionVM[] = [];
  languageLK: OptionVM[] = [];
  @Output() emitFilter = new EventEmitter();

  constructor(private projectService: ProjectService,
              private translateService: TranslateService,
              private filterService: FilterService) {
  }
  ngOnInit(): void {
    this.translateService
      .get('administration.freelancers.fields.statuses')
      .subscribe((a) => {
        this.stateLK = FormConfig.freelancers.statuses.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'administration.freelancers.fields.statuses.' + a
            ),
          };
        });
      });

      this.ageLK = FormConfig.report.ageGroup.map((a) => {
        return {
          value: a,
          text: undefined
        };
      });

      this.genderLK = FormConfig.report.gender.map((a) => {
      return {
        value: a,
        text: undefined,
      };
    });

     /* this.skillsLk = FormConfig.skill_list.map((a) => {
      return {
        value: a,
        text: undefined
      };
    });
      this.workConditionLk = FormConfig.work_conditions.map((a) => {
      return {
        value: a,
        text: undefined
      };
    });

    this.driverLicenceLK = FormConfig.report.hasDriversLicense.map((a) => {
      return {
        value: a,
        text: undefined,
      };
    });
    this.ownCarLK = FormConfig.report.hasOwnCar.map((a) => {
      return {
        value: a,
        text: undefined,
      };
    });*/
    this.languageLK = FormConfig.report.languages.map((a) => {
      return {
        text: a,
        value: a,
      };
    });

    this.filterService.getMasterFilters().subscribe((res) => {
      if(res?.data) {
        if(res.data?.cities) {
          this.cityLK = res.data?.cities;
        }
        if(res.data?.postcode) {
          this.postcodeLK = res.data?.postcode;
        }
        if(res.data?.certificates) {
          this.certificatesLK = Object.keys(res.data?.certificates).map((i) => {
            return {
              value: i,
              text: res.data?.certificates[i]
            };
          });
        }
      }
    })

      this.projectService.getProjectsLK().subscribe((res) => {
      this.projectLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
            return {
              value: a.id,
              text: [a.name, a.category].join(' '),
            };
          })
          : []
      );
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  submit() {
    Object.keys(this.filters.value).forEach((k) => (this.filters.value[k] == null || (Array.isArray(this.filters.value[k]) && !this.filters.value[k].length)) && delete this.filters.value[k]);
    const prms = new URLSearchParams(this.filters.value);
    const main = prms.toString().replace(/%2C/g, ',');
    this.emitFilter.emit(main);
  }
}
