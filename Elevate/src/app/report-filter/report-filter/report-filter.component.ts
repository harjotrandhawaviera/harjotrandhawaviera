import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OptionVM } from '../../model/option.model';
import { FormConfig } from '../../constant/forms.constant';
import { ProjectService } from '../../services/project.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '../../services/translate.service';
import {ReportAdminFacade} from '../../report-gallery/state/report-admin.facade';
import {ReportAdminModel, ReportAdminSearchModel} from '../../model/report-admin.model';

@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportFilterComponent implements OnInit{
  searchModel: ReportAdminSearchModel = {};
  filters = new FormGroup({
    status: new FormControl(),
    city: new FormControl(),
    zip: new FormControl(),
    gender: new FormControl(),
    age: new FormControl(),
    skills: new FormControl(),
    work: new FormControl(),
    project: new FormControl(),
    license: new FormControl(),
    language: new FormControl(),
    hasOwnCar: new FormControl()
  });
  stateLK: OptionVM | any;
  ageLK: OptionVM | any;
  genderLK: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  languageLk: OptionVM[] = [];
  licenseLk: OptionVM[] = [];
  hasOwnCar: OptionVM[] = [];
  skillsLk: OptionVM[] = [];
  freelancerList: OptionVM[] = [];
  workConditionLk: OptionVM[] = [];

  constructor(private projectService: ProjectService,
              private translateService: TranslateService,
              private reportFacade: ReportAdminFacade) {
  }
  ngOnInit(): void {
      this.stateLK = FormConfig.report.state.map((a) => {
        return {
          value: a,
           text: undefined
        };
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

      this.languageLk = FormConfig.report.languages.map((a) => {
      return {
        value: a,
        text: undefined
      };
    });

      this.licenseLk = FormConfig.report.hasDriversLicense.map((a) => {
      return {
        value: a,
        text: undefined
      };
    });

      this.hasOwnCar = FormConfig.report.hasOwnCar.map((a) => {
      return {
        value: a,
        text: undefined
      };
    });

      this.skillsLk = FormConfig.skill_list.map((a) => {
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

      this.reportFacade.getFreelancerList$.subscribe((a) => {
          if ('data' in a) {
            this.freelancerList = this.sortOption(
              a.data
                ? a.data.map((res: any) => {
                  return {
                    text: res?.city,
                    value: res?.zip
                };
                })
                : []
            );
          }
        });
      this.projectService.getProjectsLK().subscribe((res) => {
      this.projectLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
            return {
              value: a.id,
              text: a?.name,
            };
          })
          : []
      );
    });
      this.filters.get('status')?.valueChanges.subscribe((b) => {
      if (b) {
        this.searchModel = {...this.searchModel, status: b};
      }
    });
      this.filters.get('city')?.valueChanges.subscribe((res) => {
        if (res) {
          this.searchModel = {...this.searchModel,  city: res};
          // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
        }
      });
      this.filters.get('language')?.valueChanges.subscribe((res) => {
      if (res) {
        // @ts-ignore
        this.searchModel = {...this.searchModel,  language: res};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
      this.filters.get('license')?.valueChanges.subscribe((b) => {
      if (b) {
        // @ts-ignore
        this.searchModel = {...this.searchModel, license: b};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
      this.filters.get('hasOwnCar')?.valueChanges.subscribe((b) => {
      if (b) {
        // @ts-ignore
        this.searchModel = {...this.searchModel, hasOwnCar: b};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
      this.filters.get('zip')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, zip: res};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
      this.filters.get('gender')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, gender: res};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
      this.filters.get('age')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, age: res};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
      this.filters.get('skills')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, skills: res};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
      this.filters.get('work')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, work: res};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
      this.filters.get('project')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, project: res};
        // this.reportFacade.loadUpdateFreelancerList(this.searchModel);
      }
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

}
