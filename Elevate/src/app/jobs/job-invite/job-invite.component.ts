import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromCurrentUser from '../../root-state/user-state';
import * as fromJob from '../state';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OptionVM} from '../../model/option.model';
import {CertificateService} from '../../services/certificate.service';
import {TranslateService} from '../../services/translate.service';
import {ContractTypesService} from '../../services/contract-types.service';
import {AgentService} from '../../services/agent.service';
import {JobService} from '../../services/job.service';
import {FormConfig} from '../../constant/forms.constant';
import {FilterService} from '../../services/filter.service';
import {SelectionModel} from '@angular/cdk/collections';
import {ClientService} from '../../services/client.service';
import {ProjectService} from '../../services/project.service';
import {SkillService} from '../../services/skill.service';
import {TenderService} from '../../services/tender.service';
import * as fromJobAction from '../../jobs/state/job.actions';
import {Observable, of} from 'rxjs';
import {JobAdvertiseSearchVM, JobAdvertiseVM, JobSearchVM} from '../../model/job.model';
import * as moment from 'moment';
import {StorageService} from '../../services/storage.service';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FreelancerVM} from '../../model/freelancer.model';
import {GenericValidatorService} from '../../services/generic-validator.service';

@Component({
  selector: 'app-job-invite',
  templateUrl: './job-invite.component.html',
  styleUrls: ['./job-invite.component.scss']
})
export class JobInviteComponent implements OnInit {
  inviteJob = new FormGroup({
    client: new FormControl(''),
    city: new FormControl(''),
    postcode: new FormControl(''),
    gender: new FormControl(''),
    age_group: new FormControl(''),
    skill: new FormControl(''),
    certificates: new FormControl(''),
    language: new FormControl(''),
    status: new FormControl(''),
    project: new FormControl(''),
    agent: new FormControl(''),
    state: new FormControl(''),
    contractType: new FormControl(''),
    job: new FormControl(''),
    jobName: new FormControl(''),
    publishJob: new FormControl('', [Validators.required]),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    zipFrom: new FormControl(''),
    zipTo: new FormControl(''),
    search: new FormControl(''),
    inviteContractType: new  FormControl(''),
    inviteStart: new FormControl(''),
    inviteEnd: new FormControl(''),
    inviteZip_from: new FormControl(''),
    inviteZip_to: new FormControl(''),
    inviteCertificate: new FormControl('')
  });
  pageSize = new FormControl();
  viewing = 'Tile';
  displayedColumns = [
    'select',
    'name',
    'gender',
    'age',
    'mobile',
    'email',
    'city',
    'postcode',
    'date',
    'status',
    'action'
  ];

  id: any;
  loggedRole: string | undefined = '';
  displayMessage: any = {};
  validationMessages: any;
  agentLK: OptionVM[] = [];
  stateLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  pageLK: OptionVM | any;
  jobLK: OptionVM[] = [];
  postcodeLK: OptionVM | any;
  ageLK: OptionVM | any;
  cityLK: OptionVM | any;
  genderLK: OptionVM[] = [];
  userList: OptionVM | any = [];
  certificatesLK: OptionVM[] = [];
  certificateLK: OptionVM[] = [];
  languageLK: OptionVM[] = [];
  skillsLk: OptionVM[] = [];
  clientList: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  publishJob: OptionVM[] = [];
  inviteList: OptionVM | any = [];
  jobAdvertise: OptionVM[] = [];
  selection = new SelectionModel<any>(true, []);
  searchModel: any = {};
  result$: Observable<JobAdvertiseVM[]> = of([]);
  pagination: any;
  searchModel$: Observable<JobAdvertiseSearchVM | undefined> = of({});
  searchModelAdmin$: Observable<JobAdvertiseSearchVM | undefined> = of({});
  noRecords$: Observable<boolean> = of(false);
  selectedJob: any[] = [];


  constructor(
    private store: Store<fromJob.State>,
    private translateService: TranslateService,
    private agentService: AgentService,
    private filterService: FilterService,
    private skillService: SkillService,
    private contractTypesService: ContractTypesService,
    private jobService: JobService,
    private projectService: ProjectService,
    private tenderService: TenderService,
    private clientService: ClientService,
    private certificateService: CertificateService,
    private toastrService: ToastrService,
    private storageService: StorageService,
    private genericValidatorService: GenericValidatorService,
    public router: Router,
    private userStore: Store<fromCurrentUser.State>) {
  }

  ngOnInit(): void {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res: any) => {
      if (res) {
        this.loggedRole = res?.role;
        if (this.loggedRole !== 'freelancer') {
          this.translateService.get('form.errors.required').subscribe(() => {
            this.validationMessages = {
              publishJob: {
                required: this.translateService.instant('form.errors.required'),
              }
            };
            this.inviteJob.valueChanges.subscribe(() => {
              if (this.inviteJob) {
                this.displayMessage = this.genericValidatorService.processMessages(
                  this.inviteJob,
                  this.validationMessages
                );
              }
            });
          });
          if (history.state.staff_role_id != null && history.state.job_id != null && history.state.job_advertisement_id != null) {
            this.selectedJob = [];
            this.jobService
              .getJobsByClientId({
                limit: 1000000,
                order_by: 'title',
                order_dir: 'asc',
                only_fields: ['job.id', 'job.title'],
                filters: []
              }, history.state?.client_id)
              .subscribe((r: any) => {
                this.jobLK = r.data
                  ? r.data.map((a: any) => {
                    return {
                      value: a.id,
                      text: a.title,
                    };
                  })
                  : [];
              });
            this.jobService
              .getJobAdvertisementById({}, history.state.job_id).subscribe((res: any) => {
              this.jobAdvertise = res.data
                ? res.data.map((a: any) => {
                  return {
                    value: a?.job_advertisement_id,
                    text: a?.role_name + ' | ' + a?.job_advert_start_date + ' to ' + a?.job_advert_end_date,
                    staff_role_id: a?.staff_role_id,
                    job_id: a?.job_id
                  };
                })
                : [];
            });
            const obj = {
              client: Number(history.state.client_id),
              job: Number(history.state.job_id),
              publishJob: Number(history.state.job_advertisement_id)
            };
            setTimeout(() => {
              this.inviteJob.patchValue(obj);
            }, 0);
          }
          this.searchModelAdmin$ = this.store.pipe(
              select(fromJob.getSearchModel),
            );
          this.searchModelAdmin$.subscribe((res) => {
              if (res) {
                this.searchModel = res;
                if (
                  res.agent ||
                  res.state ||
                  res.client ||
                  res.contractType ||
                  res.job ||
                  res.jobName ||
                  res.date_from ||
                  res.date_to ||
                  res.zip_from ||
                  res.zip_to ||
                  (res.search?.length && res.search?.length > 2)
                ) {
                  // this.hasFilter = true;
                  this.store.dispatch(
                    new fromJobAction.LoadJobAdvertise({ search: this.searchModel })
                  );
                }
              } else {
                const searchModel: any = {
                  page: 1,
                  pageSize: 12,
                  sortBy: 'appointed_at',
                };
                this.store.dispatch(new fromJobAction.UpdateJobAdvertiseSearch(searchModel));
              }
            });
          this.loadClientList();
          this.loadProjectList();
          this.loadJobList();
          this.agentService.getAgentsLK().subscribe((res) => {
              this.agentLK = this.sortOption(
                res.data
                  ? res.data.map((a) => {
                    return {
                      value: a.id,
                      text: [a.lastname, a.firstname].join(' '),
                    };
                  })
                  : []
              );
            });
          this.translateService.get('contracts').subscribe((p) => {
              this.contractTypesService.getContractTypes({}).subscribe((res) => {
                this.contractTypeLK = this.sortOption(
                  res.data
                    ? res.data.map((a) => {
                      return {
                        value: a.id,
                        text: this.translateService.instant(
                          'contracts.identifier.' + a.identifier
                        ),
                      };
                    })
                    : []
                );
              });
            });

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

          this.jobService.getJobsLK().subscribe((res) => {
              this.jobLK = this.sortOption(
                res.data
                  ? res.data.map((a) => {
                    return {
                      value: a.id,
                      text: a.title,
                    };
                  })
                  : []
              );
            });

          this.filterService.getMasterFilters().subscribe((res) => {
              if (res?.data) {
                if (res.data?.cities) {
                  this.cityLK = res.data?.cities;
                }
                if (res.data?.postcode) {
                  this.postcodeLK = res.data?.postcode;
                }
                if (res.data?.certificates) {
                  this.certificatesLK = Object.keys(res.data?.certificates).map((i) => {
                    return {
                      value: i,
                      text: res.data?.certificates[i]
                    };
                  });
                }
              }
            });
          this.genderLK = FormConfig.report.gender.map((a) => {
              return {
                value: a,
                text: undefined,
              };
            });

          this.pageLK = FormConfig.report.pageSize.map((a) => {
              return {
                value: a,
                text: undefined
              };
            });
          this.pageSize.setValue('10');
          this.searchModel = { limit: 10, page: 0 };
          this.ageLK = FormConfig.report.ageGroup.map((a) => {
              return {
                value: a,
                text: undefined
              };
            });
          this.languageLK = FormConfig.report.languages.map((a) => {
              return {
                text: a,
                value: a,
              };
            });

          this.skillService.getSkills({}).subscribe((res) => {
              this.skillsLk = this.sortOption(
                res.data
                  ? res.data.map((a: any) => {
                    return {
                      value: a.id,
                      text: a.title
                    };
                  })
                  : []
              );
            });
          this.store.select(fromJob.getUserList).subscribe((res: any) => {
              if (res) {
                this.userList = this.sortOption(
                  res?.data?.data
                    ? res?.data?.data.map((a: any) => {
                      return {
                        id: a?.id,
                        email: a?.user?.data?.email,
                        fullname: a?.fullname,
                        gender: a?.gender,
                        age: a?.birthdate,
                        mobile: a?.mobile,
                        zip: a?.zip,
                        city: a?.city,
                        created_at: a?.user?.data?.created_at,
                        status: a?.user?.data?.status
                      };
                    })
                    : []
                );
                this.pagination = res?.data?.meta?.pagination;
              }
            });
          this.inviteJob.get('city')?.valueChanges.subscribe((res) => {
              if (res !== null) {
                this.searchModel = {...this.searchModel, page: 0, limit: this.pageSize.value, city: res};
              }
            });
          this.inviteJob.get('postcode')?.valueChanges.subscribe((res) => {
              this.searchModel = { ...this.searchModel, page: 0, limit: this.pageSize.value, postcode: res };
            });
          this.inviteJob.get('gender')?.valueChanges.subscribe((res) => {
              this.searchModel = { ...this.searchModel, page: 0, limit: this.pageSize.value, gender: res };
            });
          this.inviteJob.get('age_group')?.valueChanges.subscribe((res) => {
              this.searchModel = { ...this.searchModel, page: 0, limit: this.pageSize.value, age_group: res };
            });
          this.inviteJob.get('skill')?.valueChanges.subscribe((res) => {
              this.searchModel = { ...this.searchModel, page: 0, limit: this.pageSize.value, skill: res };
            });
          this.inviteJob.get('certificates')?.valueChanges.subscribe((res) => {
              this.searchModel = { ...this.searchModel, page: 0, limit: this.pageSize.value, certificates: res };
            });
          this.inviteJob.get('language')?.valueChanges.subscribe((res) => {
              this.searchModel = { ...this.searchModel, page: 0, limit: this.pageSize.value, language: res };
            });
          this.inviteJob.get('status')?.valueChanges.subscribe((res) => {
              this.searchModel = { ...this.searchModel, page: 0, limit: this.pageSize.value, status: res };
            });
          this.pageSize.valueChanges.subscribe(val => {
              this.searchModel = { ...this.searchModel, page: 0, limit: val };
              this.store.dispatch(new fromJobAction.LoadUserList(this.searchModel));
            });
          }
        if (this.loggedRole === 'freelancer') {
          this.store.dispatch(new fromJobAction.LoadJobInvite(this.searchModel));
          this.store.select(fromJob.getJobInvite).subscribe((res: any) => {
            this.inviteList = this.sortOption(
              res?.data
                ? res?.data.map((a: any) => {
                  return {
                    id: a?.staff_role_id,
                    staff_role_id: a?.staff_role_id,
                    role_name: a?.role_name,
                    job_advertisement_id: a?.job_advertisement_id,
                    job_advert_start_date: a?.job_advert_start_date,
                    days: a?.days,
                    job_code: a?.job_code,
                    contract_type: a?.contract_type,
                    job_location: a?.job_location,
                    staff_manager: a?.staff_manager,
                    client_name: a?.client_name,
                    job_name: a?.job_name,
                    job_advert_end_date: a?.job_advert_end_date,
                    job_advert_end_date_time: a?.job_advert_end_date_time
                  };
                })
                : []
            );
            this.pagination = res?.meta?.pagination;
          });
          this.inviteJob.get('inviteContractType')?.valueChanges.subscribe((res) => {
            this.searchModel = {...this.searchModel, pageIndex: 1, contractType: res};
            this.store.dispatch(new fromJobAction.LoadJobInvite({ search: this.searchModel }));
          });
          this.inviteJob.get('inviteStart')?.valueChanges.subscribe((res) => {
            this.searchModel = { ...this.searchModel, pageIndex: 1, zip_from: res };
            this.store.dispatch(new fromJobAction.LoadJobInvite(this.searchModel));
          });
          this.certificateService.getCertificate({}).subscribe((results) => {
            this.certificateLK = this.sortOption(
              results.data
                ? results.data.map((a) => {
                  return {
                    value: a.id,
                    text: [a.identifier, a.teaser].join(' ')
                  };
                })
                : []
            );
          });
        }
      }
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

  loadProjectList(id?: number) {
    this.inviteJob.get('project')?.patchValue('');
    this.projectService
      .getProjectsByClientId({
        limit: 1000000,
        order_by: 'name',
        order_dir: 'asc',
        only_fields: ['project.id', 'project.name'],
        filters: []
      }, id).subscribe((res) => {
      this.projectLK = res.data
        ? res.data.map((a) => {
          return {
            value: a.id,
            text: a.name,
          };
        })
        : [];
    });
  }

  loadJobList(id?: number) {
    this.inviteJob.get('job')?.patchValue('');
    this.jobService
      .getJobsByClientId({
        limit: 1000000,
        order_by: 'title',
        order_dir: 'asc',
        only_fields: ['job.id', 'job.title'],
        filters: []
      }, id)
      .subscribe((res) => {
        this.jobLK = res.data
          ? res.data.map((a) => {
            return {
              value: a.id,
              text: a.title,
            };
          })
          : [];
      });
  }

  loadPublishJobList(id?: number) {
    this.inviteJob.get('publishJob')?.patchValue('');
    this.jobService
      .getJobAdvertisementById({}, id).subscribe((res: any) => {
      this.jobAdvertise = res.data
        ? res.data.map((a: any) => {
          return {
            value: a?.job_advertisement_id,
            text: a?.role_name + ' | ' + a?.job_advert_start_date + ' to ' + a?.job_advert_end_date,
            staff_role_id: a?.staff_role_id,
            job_id: a?.job_id
          };
        })
        : [];
    });
  }


  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.userList.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.userList);
  }

  sendInvite() {
    this.selectedJob.map((a: any) => a.staff_role_id);
    const invite = this.selectedJob[0]
    const values = {
      staff_role_id: invite || history?.state?.staff_role_id,
      freelancer_ids: this.selection.selected.map((d) => d.id),
      job_id: this?.inviteJob?.value?.job || history?.state?.job_id,
      job_advertisement_id: this?.inviteJob?.value?.publishJob || history?.state?.job_advertisement_id,
    };
    this.store.dispatch(new fromJobAction.SendInvite(values));
    this.toastrService.success(this.translateService.instant('notification.post.invited-jobs.success'));
  }

  submit() {
    if (this.inviteJob.valid) {
      this.store.dispatch(new fromJobAction.LoadUserList(this.searchModel));
    }
    else {
      this.inviteJob.markAllAsTouched();
      this.displayMessage = this.genericValidatorService.processMessages(
        this.inviteJob,
        this.validationMessages
      );
    }
  }

  setid(freelanceData: any){
    this.id = freelanceData.id;
    this.navigateToDetail(freelanceData);
  }

  navigateToDetail(freelanceData: any) {
    this.router.navigate([`/jobs/freelancer/invite/${freelanceData.job_advertisement_id}/role/${freelanceData.staff_role_id}`]);
  }
  navigateTooDetail(data: FreelancerVM) {
    this.router.navigate(['/administration/freelancers/profile', data.id]);
  }
  pageChange(event: any) {
    const pageIndex = event.pageIndex + 1;
    this.searchModel = { ...this.searchModel, page: pageIndex, limit: this.pageSize.value };
    this.store.dispatch(new fromJobAction.LoadUserList(this.searchModel));
  }

  inviteJobpageChange(event: any) {
    const pageIndex = event.pageIndex + 1;
    this.searchModel = {...this.searchModel, page: pageIndex};
    // this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
  }

  selectJob(value: any) {
    this.selectedJob = []
    this.selectedJob.push(value.staff_role_id);
  }
}
