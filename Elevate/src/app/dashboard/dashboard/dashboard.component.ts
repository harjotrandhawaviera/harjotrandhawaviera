/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */

import * as fromCurrentUser from './../../root-state/user-state';
import * as fromUser from '../../admin-user/state/index';
import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';

import { DashboardFacade } from '../+state/dashboard.facade';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import {Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { TodosFacade } from '../../todos/+state/todos.facade';
import { TodosModalComponent } from '../../todos/todos-modal/todos-modal.component';
import { TodosSearchVM } from '../../model/todos.model';
import { TranslateService } from '../../services/translate.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  searchModel: TodosSearchVM = {};
  agentList: OptionVM | any;
  attendList: OptionVM | any;
  projectList: OptionVM | any;
  contractList: OptionVM | any;
  certificateList: OptionVM | any;
  offerList: OptionVM | any;
  jobList: OptionVM | any;
  offerListCount: any;
  jobsList: OptionVM | any;
  changeList: OptionVM | any;
  taskList: OptionVM | any;
  consList: OptionVM | any;
  onBoard: OptionVM | any;
  onBoardCount: any;
  unconfirmedAttendance: OptionVM[] | any;
  unsuitableJob: OptionVM | any;
  suitableJob: OptionVM | any;
  invitedJob: OptionVM | any;
  assignmentList: OptionVM | any;
  assignmentTotal: OptionVM | any;
  loggedUser: string | undefined = '';
  loggedRole: string | undefined = '';
  loggedEmail: string | undefined = '';
  message: OptionVM | any;
  displayedColumns: string[] = [
    'name',
    'weight',
    'symbol',
    'startTime',
    'action',
  ];
  displayedChanges: string[] = ['Surname', 'modification', 'date', 'action'];
  displayedConsultants: string[] = ['Surname', 'Postcode', 'date', 'action'];
  displayedTasks: string[] = ['No', 'Task', 'ToBeDoneBy', 'Done', 'action'];
  displayedJobs: string[] = [
    'No',
    'Task',
    'ToBeDoneBy',
    'Done',
    'category',
    'Calls',
    'Open stakes',
    'Booked stakes',
    'Completed missions',
    'Total sales',
    'Average Turnover / day',
    'action',
  ];
  displayedProject: string[] = [
    'No',
    'Task',
    'ToBeDoneBy',
    'Done',
    'Booked stakes',
    'Completed missions',
    'Total sales',
    'Average Turnover / day',
    'action',
  ];
  displayedOffers: string[] = [
    'job',
    'ExpertAdvisory',
    'date',
    'ExpiryDate',
    'action',
  ];
  displayedContract: string[] = ['identifier', 'status', 'action'];
  displayedCertificate: string[] = [
    'name',
    'jobShortTitle',
    'startDateTime',
    'action',
  ];
  displayUnsuitableJob: string[] = [
    'shortTitle',
    'categoryName',
    'sitecity',
    'missingCertificates',
    'missingLocation',
    'missingContractType',
    'numberOfTenders',
  ];
  displaySuitableJob: string[] = [
    'shortTitle',
    'sitecity',
    'contractType',
    'numberOfTenders',
    'action',
  ];
  displayedAssignment: string[] = [
    'shortTitle',
    'sitecity',
    'numberOfTenders',
    'action',
  ];
  displayedTodo: string[] = [
    'taskCategory',
    'taskName',
    'priority',
    'createdBy',
    'assingedTo',
    'deadLine',
    'action',
  ];
  total: any;
  totalTask: any;
  totalContracts: any;
  totalAssignment: any;
  totalUnsuitableJob: any;
  inviteJobsTotal = 0;
  recommendJobsTotal = 0;
  id: any;

  constructor(
    private dashboardFacade: DashboardFacade,
    private store: Store<fromUser.State>,
    private todoFacade: TodosFacade,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private userSvc: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedUser = res?.firstname;
        this.loggedRole = res?.role;
        this.loggedEmail = res?.email;
        const agentId = res?.agent_id;
        if (this.loggedRole === 'agent') {
          this.loadMessage('agent');
          this.todoFacade.getAgentList$.subscribe((lists: any) => {
            this.agentList = this.sortOption(
              lists.data
                ? lists.data.map((a: any) => ({
                    value: a.id,
                    text: a.lastname + ' ' + a.firstname,
                    owner_id: a.user?.data?.id,
                  }))
                : []
            );
          });

          this.dashboardFacade.dashboardCons();
          this.dashboardFacade.gatDashboardCons$.subscribe((lists: any) => {
            this.consList = this.sortOption(
              lists.data
                ? lists.data.map((a: any) => ({}))
                : []
            );
          });
          this.dashboardFacade.dashboardOnBoarding();
          this.dashboardFacade.getOnBoardingList$.subscribe((res: any) => {
            this.onBoardCount = res?.meta?.pagination?.total ? res?.meta?.pagination?.total : 0;
            this.onBoard = this.sortOption(
              res.data
                ? res.data.map((a: any) => ({
                    value: a.id,
                    name: a.user.data.freelancer?.data?.fullname,
                    modification: a.action,
                    create_at: a.created_at,
                    picture_id:
                      environment.api +
                      '/pictures/' +
                      a.user.data?.freelancer?.data?.face_picture_id +
                      '/icon/squared',
                    postcode: a.user.data?.freelancer?.data?.zip,
                  }))
                : []
            );
          });

          this.dashboardFacade.dashboardUnconfirmedAttendance();
          this.dashboardFacade.getDashboardUnconfirmedAttendance$.subscribe(
            (list: any) => {
              if (list.data) {
                this.unconfirmedAttendance = this.sortOption(
                  list.data
                    ? list.data.map((a: any) => ({
                        id: a?.id,
                        title: a?.date?.data?.job?.data?.title,
                        city: a?.date?.data?.job?.data?.site?.data?.city,
                        appointed_at: moment
                          .utc(a?.date?.data?.appointed_at)
                          .startOf('day')
                          .fromNow(),
                        firstName: a?.freelancers?.data[0]?.firstname,
                        lastName: a?.freelancers?.data[0]?.lastname,
                      }))
                    : []
                );
              }
            }
          );

          this.dashboardFacade.dashboardChange();
          this.dashboardFacade.gatDashboardChange$.subscribe((lists: any) => {
            this.changeList = this.sortOption(
              lists.data
                ? lists.data.map((a: any) => ({
                    value: a.id,
                    name: a.user.data.freelancer?.data?.fullname,
                    modification: a.action,
                    create_at: a.created_at,
                    picture_id:
                      environment.api +
                      '/pictures/' +
                      a.user.data?.freelancer?.data?.face_picture_id +
                      '/icon/squared',
                  }))
                : []
            );
          });

          this.dashboardFacade.dashboardTask(agentId);
          this.dashboardFacade.gatDashboardTask$.subscribe((lists: any) => {
            this.taskList = this.sortOption(
              lists.data
                ? lists.data.map((a: any) => ({
                    id: a.id,
                    task: a.subject,
                    date: a.target_at,
                    value: a.id,
                    name: a.owner?.data?.fullname,
                    content: a?.subject,
                    target: a?.target_at,
                    created: a?.created_at,
                    status: a?.state,
                    creator: a?.creator?.data?.name,
                    creator_role: a?.creator?.data?.role,
                    owner_id: a?.owner?.data?.agent?.data?.id,
                    creator_all: a?.creator,
                    owner: a?.owner,
                    important: a?.important,
                    // isCreator: userRole === 'admin' || (!a.id) || (a.creator && a.creator.data.id === userId)
                  }))
                : []
            );
            this.totalTask = lists?.meta?.pagination?.total;
          });
          this.dashboardFacade.dashboardOffer();
          this.dashboardFacade.gatDashboardOffer$.subscribe((lists: any) => {
            if (lists?.data) {
              this.offerListCount = lists?.meta?.pagination?.total ? lists?.meta?.pagination?.total : 0;
              this.offerList = this.sortOption(
                lists.data
                  ? lists.data.map((a: any) => ({
                      id: a?.id,
                      title: a?.tender?.data?.snapshots?.job?.title,
                      name: a?.freelancer?.data?.fullname,
                      date: a?.tender?.data?.invalid_at,
                      expiry: moment
                        .utc(a?.expired_at)
                        .startOf('day')
                        .fromNow(),
                    }))
                  : []
              );
            }
          });
        } else if (this.loggedRole === 'freelancer') {
          this.loadMessage('freelancer'); // loading messages Job Board Questions
          this.dashboardFacade.dashboardCertificate();
          this.dashboardFacade.getDashboardCertificate$.subscribe(
            (lists: any) => {
              this.certificateList = this.sortOption(
                lists.data
                  ? lists.data.map((a: any) => ({
                      value: a.id,
                      type: a.identifier,
                      linkId: a?.id,
                      name: a?.name,
                      jobCount: a?.job_count
                    }))
                  : []
              );
            }
          );
          this.dashboardFacade.dashboardUnsuitableJob();
          this.translateService.get('contracts').subscribe(() => {
            this.dashboardFacade.getDashboardUnsuitableJob$.subscribe(
              (lists: any) => {
                if (lists) {
                  this.unsuitableJob = this.sortOption(
                    lists.data
                      ? lists.data.map((a: any) => ({
                          value: a.id,
                          offer: a?.project?.data?.name,
                          category: a?.category,
                          city: a?.site?.data?.city,
                          certificate:
                            a?.tenders?.data[0]?.certificates?.data.map(
                              (k: any) => ({
                                  name: k?.name,
                                })
                            ),
                          identifier: this.translateService.instant(
                            'contracts.identifier.' +
                            a?.contract_type?.data?.identifier
                          ),
                        }))
                      : []
                  );
                  this.totalUnsuitableJob = lists?.meta?.pagination?.total;
                }
              }
            );
          });

          this.dashboardFacade.dashboardInvitedJob();
          this.translateService.get('contracts').subscribe(() => {
            this.dashboardFacade.getDashboardInvitedJob$.subscribe(
              (lists: any) => {
                this.inviteJobsTotal = lists?.meta?.pagination?.total;
                this.invitedJob = this.sortOption(
                  lists.data
                    ? lists.data.map((a: any) => ({
                        jobName: a?.job_name,
                        category: a?.job_info?.data?.category,
                        location: a?.job_info?.data?.job_location,
                        contractType: a?.contract_type,
                        dates: a?.job_info?.data?.start_date + ' to ' +  a?.job_info?.data?.finish_date,
                        link: '/jobs/adv/' + a?.job_advertisement_id + '/role/' + a?.staff_role_id
                      }))
                    : []
                );
              }
            );
          });

          this.dashboardFacade.dashboardSuitableJob();
          this.translateService.get('contracts').subscribe(() => {
            this.dashboardFacade.getDashboardSuitableJob$.subscribe(
              (lists: any) => {
                this.recommendJobsTotal = lists?.meta?.pagination?.total;
                this.suitableJob = this.sortOption(
                  lists.data
                    ? lists.data.map((a: any) => ({
                        jobName: a?.job_info?.data?.job_name,
                        category: a?.job_info?.data?.category,
                        location: a?.job_info?.data?.job_location,
                        contractType: a?.contract_type,
                        dates: a?.job_advert_start_date + ' - ' +  a?.job_advert_end_date,
                        startdate: a?.job_advert_start_date,
                        finishdate:  a?.job_advert_end_date,
                        link: '/jobs/adv/' + a?.job_advertisement_id + '/role/' + a?.staff_role_id
                      }))
                    : []
                );
              }
            );
          });

          this.dashboardFacade.dashboardAssignment();
          this.dashboardFacade.getDashboardAssignment$.subscribe(
            (lists: any) => {
              this.assignmentList = this.sortOption(
                lists.data
                  ? lists.data.map((a: any) => ({
                      value: a.id,
                      job: a?.date?.data?.job?.data?.project?.data?.name,
                      city: a?.date?.data?.job?.data?.site?.data?.city,
                      type: a.identifier,
                      expired_at: moment
                        .utc(a?.date?.data?.appointed_at)
                        .startOf('day')
                        .fromNow(),
                    }))
                  : []
              );
              this.totalAssignment = lists?.meta?.pagination?.total;
            }
          );
          this.dashboardFacade.dashboardContractOffer();
          this.translateService.get('contracts').subscribe(() => {
            this.dashboardFacade.gatDashboardContract$.subscribe(
              (lists: any) => {
                this.contractList = this.sortOption(
                  lists.data
                    ? lists.data.map((a: any) => ({
                        value: a.id,
                        type: this.translateService.instant(
                          'contracts.identifier.' + a.identifier
                        ),
                      }))
                    : []
                );
                this.totalContracts = lists?.meta?.pagination?.total;
              }
            );
          });
        } else if (this.loggedRole === 'field') {
          this.dashboardFacade.dashboardJobs();
          this.dashboardFacade.gatDashboardJobs$.subscribe((lists: any) => {
            this.jobsList = this.sortOption(
              lists.data
                ? lists.data.map((a: any) => ({
                    value: a.id,
                    name: a.title,
                    pos: a.site.data.name,
                    city: a.site.data.city,
                    cat: a.category,
                    call: a.summary.dates.states.assigned,
                    open: a.summary.assignments.states.open,
                    booked: a.summary.assignments.states.booked,
                  }))
                : []
            );
            this.total = lists?.meta?.pagination.total;
          });
        } else if (this.loggedUser === 'client') {
          this.dashboardFacade.dashboardProject();
          this.dashboardFacade.gatDashboardProject$.subscribe((lists: any) => {
            this.projectList = this.sortOption(
              lists.data
                ? lists.data.map((a: any) => ({
                    value: a.id,
                    name: a.name,
                    job: a.summary.jobs.count,
                    call: a.summary.tenders.count,
                  }))
                : []
            );
          });

          this.dashboardFacade.dashboardJobs();
          this.dashboardFacade.gatDashboardJobs$.subscribe((lists: any) => {
            this.jobsList = this.sortOption(
              lists.data
                ? lists.data.map((a: any) => ({
                    value: a.id,
                    name: a.title,
                    pos: a.site.data.name,
                    city: a.site.data.city,
                    cat: a.category,
                    call: a.summary.dates.states.assigned,
                    open: a.summary.assignments.states.open,
                    booked: a.summary.assignments.states.booked,
                  }))
                : []
            );
          });
        }
      }
    });
  }
  openModal(lists: any) {
    const abc = new Date(lists.target);
    const year = abc.getFullYear();
    const month = abc.getMonth() + 1;
    const date = abc.getDate();
    const finalDate = date + '-' + month + '-' + year;
    const dialogRef = this.dialog.open(TodosModalComponent, {
      data: {
        isEdit: true,
        value: lists,
        agent: this.agentList,
        targetDate: finalDate,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const result = value?.modelValue;
        const newObject = {
          createdAt: lists?.created,
          created_at: lists?.created,
          creatorName: lists?.creator,
          important: result?.important,
          isDone: false,
          creator: lists?.creator_all,
          owner: lists?.owner,
          isOverdued: true,
          ownerFullname: value?.selectedAgent,
          owner_id: lists?.owner?.data?.id,
          state: lists?.status,
          subject: result?.content,
          targetAt: lists?.target,
          target_at: lists?.target,
          updated_at: lists?.target,
          todosId: lists?.value,
        };
        this.todoFacade.updateModal(newObject);
      }
    });
  }

  confirmModal(lists: any) {
    const dialogRef = this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant('todos.set-state.title'),
        message: this.translateService.instant('todos.set-state.message'),
        cancelCode: 'todos.set-state.buttons.cancel',
        confirmCode: 'todos.set-state.buttons.confirm',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newObject = {
          createdAt: lists?.created,
          created_at: lists?.created,
          creatorName: lists?.creator,
          important: lists?.important,
          isDone: true,
          creator: lists?.creator_all,
          owner: lists?.owner,
          isOverdued: false,
          ownerFullname: '',
          owner_id: lists?.owner?.data?.id,
          state: 'done',
          subject: lists?.content,
          targetAt: lists?.target,
          target_at: lists?.target,
          updated_at: lists?.target,
          todosId: lists?.value,
        };
        const update: any = {
          ...this.searchModel,
        };
        this.todoFacade.updateModal(newObject);
        setTimeout(() => {
          this.todoFacade.loadTodoList(update);
        }, 400);
        this.id = lists.id;
      }
    });
  }

  loadMessage(role: string) { // loading messages Job Board Questions
    this.dashboardFacade.newsLoading(role);
    this.dashboardFacade.getNewsList$.subscribe((res: any) => {
      if (res.data) {
        this.message = this.sortOption(
          res.data
            ? res.data.map((a: any) => ({
                q_id: a.id,
                subject: a?.question?.data?.subject,
                name: a?.sender?.data?.fullname,
                response: a?.content,
                value: a?.question?.data?.content,
                created: a?.created_at,
                email: a?.sender?.data?.email,
                receiver: a?.recipient?.data?.fullname,
                senderUserId: a?.sender_user_id,
                tender_date: a?.tenders,
                jobId: a?.reference_id,
                tenders: a?.tenders.map((res1: any) => res1.id)
              }))
            : []
        );
      }
    });
  }

  OpenModal(qId: number) { // remove message
    const dialogRef = this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'messages.jobs.table.remove.title'
        ),
        message: this.translateService.instant(
          'messages.jobs.table.remove.message_freelancer'
        ),
        cancelCode: 'todos.buttons.cancel',
        confirmCode: 'messages.jobs.table.actions.remove',
      },
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.dashboardFacade.removeTender(qId);
        this.dashboardFacade.newsLoading('freelancer');
        this.dashboardFacade.getNewsList$.subscribe((res: any) => {
          if (res.data) {
            this.message = this.sortOption(
              res.data
                ? res.data.map((a: any) => ({
                    q_id: a.id,
                    subject: a?.question?.data?.subject,
                    name: a?.sender?.data?.fullname,
                    response: a?.content,
                    value: a?.question?.data?.content,
                    created: a?.created_at,
                    email: a?.sender?.data?.email,
                    receiver: a?.recipient?.data?.fullname,
                    senderUserId: a?.sender_user_id,
                    tender_date: a?.tenders,
                    jobId: a?.reference_id,
                    tenders: a?.tenders.map((res1: any) => res1.id)
                  }))
                : []
            );
          }
        });
      }
    });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  goToMyBookingDetails(row: any) {
       this.router.navigate(['/my/assignments/', row.value]);
     }

  goToRcommendedJobsDetails(freelanceData: any) {
    this.router.navigate([freelanceData.link] );
  }

  goToInvitedJobsDetails( Data: any) {
    this.router.navigate([Data.link] );
  }

  getDateDifference(completedDate: any) {
    const CurrentDate = new Date();
    const GivenDate = new Date(completedDate);
    return GivenDate < CurrentDate;
  }

  navigateToCertificate(row: any) {
    this.router.navigate(['/certificates/my/', row.id]);
  }

  navigateToJobs(row: any) {
    this.router.navigate(['/jobs/', row.value]);
  }

  navigateToNewConsultance(row: any) {
    this.router.navigate(['/approval/freelancer-onboarding/', row.value]);
  }

  navigateToChanges(row: any) {
    this.router.navigate(['/approval/freelancer-changerequest/', row.value]);
  }

  navigateToUnconfirmedAttendance(row: any) {
    this.router.navigate(['/checkins/', row.id]);
  }

  navigateToJobApplication(row: any) {
    this.router.navigate(['/home/tenders/offers/', row.id]);
  }

  navigateToProject(row: any) {
    this.router.navigate(['/projects/', row.value]);
  }
}
