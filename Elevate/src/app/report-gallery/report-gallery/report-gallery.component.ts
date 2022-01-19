import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { OptionVM } from '../../model/option.model';
import { ReportAdminFacade } from '../state/report-admin.facade';
import {SelectionModel} from '@angular/cdk/collections';
import {FileExportService} from '../../services/file-export.service';
import {TranslateService} from '../../services/translate.service';
import {Observable, of} from 'rxjs';
import {ReportAdminSearchModel} from '../../model/report-admin.model';
import {FormControl, FormGroup} from '@angular/forms';
import {ProjectService} from '../../services/project.service';
import {FormConfig} from "../../constant/forms.constant";
import {FilterService} from "../../services/filter.service";

@Component({
  selector: 'app-report-gallery',
  templateUrl: './report-gallery.component.html',
  styleUrls: ['./report-gallery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportGalleryComponent implements OnInit  {
  startButton = true;
  exportButton = false;
  loader = false;
  process = 0;
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
  cityLK: OptionVM[] = [];
  postcodeLK: OptionVM[] = [];
  freelancerList: OptionVM[] = [];
  userProfileData: OptionVM[] = [];
  userPayrollData: OptionVM[] = [];
  userMailData: OptionVM[] = [];
  userLegalData: OptionVM[] = [];
  workConditionLk: OptionVM[] = [];
  hasFilter = false;
  show = false;
  click = false;
  noRecords$: Observable<boolean> = of(false);
  showSpinner = true;
  loading$: Observable<boolean> = of(false);
  activeButton = 'repo1';
  displayedProfile = [
    'Staff Member ID',
    'Creation Date',
    'Status',
    'First Name',
    'Last Name',
    'Date of Birth',
    'Gender',
    'Place of Birth',
    'Country of Birth',
    'Driving License',
    'Driving License Type',
    'Having Own Car',
    'Telephone (Mobile)',
    'Telephone (Alternative)',
    'E-Mail Address',
    'Address (Street & House No.)',
    'Address (Additional Addess)',
    'Address (Postal Code)',
    'Address (City)',
    'Address (Country)',
    'Address (Nearest major city)',
    'Address2 (Street & House No.)',
    'Address2 (Additional Addess)',
    'Address2 (Postal Code)',
    'Address2 (City)',
    'Address2 (Country)',
    'Address2 (Nearest major city)',
    'Height',
    'Chest',
    'Waist',
    'Hip',
    'T-Shirt',
    'Pant',
    'Shoe Size',
    'Language',
    'Reference-Title',
    'Reference-Client',
    'Reference-Description',
    'Educational Qualification',
    'Completed On',
    'Description',
    'Account Holder Name',
    'IBAN',
    'BIC',
    'Bank Name',
    'Identity/Passport No.',
    'Valid Until',
    'Social Security Number',
    'Inhabitant ID',
    'Nationality',
    'Work via Trade License',
    'Work Condition',
    'Skills & Experience',
  ];
  displayedPayroll = [
    'Staff Member ID',
    'Creation Date',
    'Profile Status',
    'First Name',
    'Last Name',
    'Mobile Number',
    'E-Mail Address',
    'Address (Street & House No.)',
    'Address (Additional Addess)',
    'Address (Postal Code)',
    'Address (City)',
    'Address (Country)',
    'Social Security Number',
    'Date of Birth',
    'Gender',
    'Nationality',
    'IBAN',
    'BIC',
    'Bank Name',
  ];
  displayedLegalData = [
    'Staff Member ID',
    'Creation Date',
    'Status',
    'First Name',
    'Last Name',
    'Account Holder Name',
    'IBAN',
    'BIC',
    'Bank Name',
    'Identity/Passport No.',
    'Valid Until',
    'Social Security Number',
    'Inhabitant ID',
    'Nationality',
  ];
  displayedMailMergeList = [
    'Staff Member ID',
    'Creation Date',
    'Profile Status',
    'First Name',
    'Last Name',
    'Gender',
    'E-Mail Address',
  ];
  selection = new SelectionModel(true);

  constructor(private reportFacade: ReportAdminFacade,
              private projectService: ProjectService,
              private translateService: TranslateService,
              private filterService: FilterService,
              private fileExportService: FileExportService) { }

  ngOnInit(): void {
    this.reportFacade.getFreelancerList$.subscribe((res: any) => {
      if (res?.data) {
        if (this.activeButton === 'repo1') {
          this.userProfileData = this.sortOption(
            res?.data
              ? res?.data.map((a: any) => {
                return {
                  id: a?.id,
                  created_at: a?.created_at,
                  status: a?.user?.data?.status,
                  first_name: a?.firstname,
                  last_name: a?.lastname,
                  dob: a?.birthdate,
                  gender: a?.gender,
                  birth_place: a?.birthplace,
                  country_birth: a?.birthcountry,
                  license: a?.driver_license,
                  license_type: a?.driver_license_id,
                  car: a?.own_car,
                  mobile: a?.mobile,
                  telephone: a?.alternative_phone,
                  email: a?.user?.data?.email,
                  address: a?.address,
                  add_address: a?.addressaddition,
                  zip: a?.zip,
                  city: a?.city,
                  country1: a?.country,
                  major_city: a?.near_to_city,
                  address2: a?.address2,
                  add_address1: a?.address,
                  zip1: a?.zip2,
                  city1: a?.city2,
                  country2: a?.country2,
                  major_city1: a?.near_to_city2,
                  height: a?.height,
                  chest: a?.chest,
                  waist: a?.waist,
                  hip: a?.hip,
                  t_shirt: a?.shirtsize,
                  pant: a?.pants,
                  shoe_size: a?.shoesize,
                  language: a?.languages,
                  reference: a?.reference,
                  r_client: a?.client,
                  description: a?.description,
                  qualification: a?.qualification,
                  complete_at: a?.complete_at,
                  description1: a?.description,
                  Account_name: a?.bankaccount_holder,
                  iban: a?.iban,
                  bic: a?.bic,
                  b_name: a?.bankname,
                  identity_passport: a?.idcard_number,
                  valid_at: a?.idcard_invalid_at,
                  security_number: a?.social_security_number,
                  inhabitantId: a?.identity_card_id,
                  nationality: a?.nationality_name,
                  work: a?.work_permission,
                  work_condition: a?.other_work_condition,
                  skill: a?.skill,
                };
              })
              : []
          );
        }
        if (this.activeButton === 'repo2') {
          this.userPayrollData = this.sortOption(
            res?.data
              ? res?.data.map((a: any) => {
                return {
                  id: a?.id,
                  created_at: a?.user?.data?.created_at,
                  status: a?.user?.data?.status,
                  first_name: a?.firstname,
                  last_name: a?.lastname,
                  mobile: a?.mobile,
                  email: a?.user?.data?.email,
                  address: a?.address,
                  add_address: a?.addressaddition,
                  zip: a?.zip,
                  city: a?.city,
                  country1: a?.country,
                  security_number: a?.social_security_number,
                  dob: a?.birthdate,
                  gender: a?.gender,
                  nationality: a?.nationality_name,
                  iban: a?.iban,
                  bic: a?.bic,
                  b_name: a?.bankname,
                };
              })
              : []
          );
        }
        if (this.activeButton === 'repo3') {
          this.userMailData = this.sortOption(
            res?.data
              ? res?.data.map((a: any) => {
                return {
                  id: a?.id,
                  created_at: a?.user?.data?.created_at,
                  status: a?.user?.data?.status,
                  first_name: a?.firstname,
                  last_name: a?.lastname,
                  gender: a?.gender,
                  email: a?.user?.data?.email
                };
              })
              : []
          );
        }
        if (this.activeButton === 'repo4') {
          this.userLegalData = this.sortOption(
            res?.data
              ? res?.data.map((a: any) => {
                return {
                  id: a?.id,
                  created_at: a?.user?.data?.created_at,
                  status: a?.user?.data?.status,
                  first_name: a?.firstname,
                  last_name: a?.lastname,
                  Account_name: a?.bankaccount_holder,
                  iban: a?.iban,
                  bic: a?.bic,
                  b_name: a?.bankname,
                  identity_passport: a?.idcard_number,
                  valid_at: a?.idcard_invalid_at,
                  security_number: a?.social_security_number,
                  inhabitantId: a?.identity_card_id,
                  nationality: a?.nationality_name
                };
              })
              : []
          );
        }
      }
      this.reportFacade.getLoaderValue$.subscribe((res: boolean) => {
        if (!res) {
          this.showSpinner = false;
        }
        else {
          this.showSpinner = true;
        }
      });
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
    this.stateLK = FormConfig.report.state.map((a: any) => {
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
    this.filterService.getMasterFilters().subscribe((res) => {
      if(res?.data) {
        if(res.data?.cities) {
          this.cityLK = res.data?.cities;
        }
        if(res.data?.postcode) {
          this.postcodeLK = res.data?.postcode;
        }
      }
    })
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

    this.filters.get('status')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, status: res};
        this.OnChanges();
      }
    });
    this.filters.get('city')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel,  city: res};
        this.OnChanges();
      }
    });
    this.filters.get('language')?.valueChanges.subscribe((res) => {
      if (res) {
        // @ts-ignore
        this.searchModel = {...this.searchModel,  language: res};
        this.OnChanges();
      }
    });
    this.filters.get('license')?.valueChanges.subscribe((b) => {
      if (b) {
        // @ts-ignore
        this.searchModel = {...this.searchModel, license: b};
        this.OnChanges();
      }
    });
    this.filters.get('hasOwnCar')?.valueChanges.subscribe((b) => {
      if (b) {
        // @ts-ignore
        this.searchModel = {...this.searchModel, hasOwnCar: b};
        this.OnChanges();
      }
    });
    this.filters.get('zip')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, zip: res};
        this.OnChanges();
      }
    });
    this.filters.get('gender')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, gender: res};
        this.OnChanges();
      }
    });
    this.filters.get('age')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, age: res};
        this.OnChanges();
      }
    });
    this.filters.get('skills')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, skills: res};
        this.OnChanges();
      }
    });
    this.filters.get('work')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, work: res};
        this.OnChanges();
      }
    });
    this.filters.get('project')?.valueChanges.subscribe((res) => {
      if (res) {
        this.searchModel = {...this.searchModel, project: res};
        this.OnChanges();
      }
    });

  }

  OnChanges(){
    this.exportButton = false;
    this.process = 0;
    if (this.searchModel?.status?.length !== 0 || this.searchModel?.city?.length !== 0 || this.searchModel?.language?.length !== 0
      || this.searchModel?.license?.length !== 0 || this.searchModel?.hasOwnCar?.length !== 0 || this.searchModel?.zip?.length !== 0
      // tslint:disable-next-line:max-line-length
      || this.searchModel?.gender?.length !== 0 || this.searchModel?.age?.length !== 0 || this.searchModel?.skills?.length !== 0 || this.searchModel?.work?.length !== 0 || this.searchModel?.project?.length !== 0) {
      this.startButton = false;
    }
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.freelancerList.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.freelancerList.forEach((row: any) => this.selection.select( row ));
  }

  downloadList() {
    const profileFields = this.displayedProfile;
    const legalDataFields = this.displayedLegalData;
    const payrollFields = this.displayedPayroll;
    const mailList = this.displayedMailMergeList;
    if (this.activeButton === 'repo1') {
      this.fileExportService.downloadCSV({data: this.userProfileData, filePrefix: 'Profile Report', headerFields: profileFields});
    }
    if (this.activeButton === 'repo2') {
      this.fileExportService.downloadCSV({data: this.userPayrollData, filePrefix: 'Payroll Report', headerFields: payrollFields});
    }
    if (this.activeButton === 'repo3') {
      this.fileExportService.downloadCSV({data: this.userMailData, filePrefix: 'Mail List Report', headerFields: mailList});
    }
    if (this.activeButton === 'repo4') {
      this.fileExportService.downloadCSV({data: this.userLegalData, filePrefix: 'Legal Data Report', headerFields: legalDataFields});
    }
  }

  setActive(buttonName: string) {
    this.filters.reset();
    this.startButton = true;
    this.exportButton = false;
    this.process = 0;
    this.activeButton = buttonName;
    this.searchModel = {};
  }

  isActive(buttonName: string) {
    return this.activeButton === buttonName;
  }

  call() {
    this.loader = true;
    this.reportFacade.loadUpdateFreelancerList(this.searchModel);
    this.process = 100;
    this.startButton = true;
    this.exportButton = true;
  }
  cancel() {
    this.startButton = true;
    this.process = 0;
    this.exportButton = false;
    this.filters.reset();
  }

}
