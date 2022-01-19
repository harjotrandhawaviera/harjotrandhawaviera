import { Injectable } from '@angular/core';
import { DashboardAppState } from './dashboard.reducer';
import { Store } from '@ngrx/store';
import { DashboardAction } from './dashboard.action';
import { fromDashboard } from './dashboard.selector';
import * as fromCurrentUser from '../../root-state/user-state';

@Injectable({
  providedIn: 'root'
})

export class DashboardFacade {
  loggedUser: any;
  loggedRole: any;
  constructor(private store: Store<DashboardAppState>) {
  }

  gatDashboardAttendance$ = this.store.select(fromDashboard.getAttendList);
  gatDashboardOffer$ = this.store.select(fromDashboard.getOfferList);
  gatDashboardJobOffer$ = this.store.select(fromDashboard.getOfferJob);
  gatDashboardChange$ = this.store.select(fromDashboard.getChangeList);
  gatDashboardTask$ = this.store.select(fromDashboard.getTaskList);
  getNewsList$ = this.store.select(fromDashboard.getNewsList);
  gatDashboardCons$ = this.store.select(fromDashboard.getConsList);
  getOnBoardingList$ = this.store.select(fromDashboard.getOnBoardList);
  getOnJobsList$ = this.store.select(fromDashboard.getOnJobsList);
  gatDashboardProject$ = this.store.select(fromDashboard.getProjectList);
  gatDashboardJobs$ = this.store.select(fromDashboard.getJobList);
  gatDashboardContract$ = this.store.select(fromDashboard.getContractList);
  getDashboardCertificate$ = this.store.select(fromDashboard.getCertificateList);
  getDashboardUnsuitableJob$ = this.store.select(fromDashboard.getUnsuitableJobList);
  getDashboardSuitableJob$ = this.store.select(fromDashboard.getSuitableJobList);
  getDashboardInvitedJob$ = this.store.select(fromDashboard.getInvitedJobList);
  getDashboardAssignment$ = this.store.select(fromDashboard.getAssignmentList);
  getDashboardUnconfirmedAttendance$ = this.store.select(fromDashboard.getUnconfirmedAttendance);

  dashboardAttend() {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedUser = res?.role_id;
        if (this.loggedUser) {
          const attend = '/freelancers/' + this.loggedUser + '/assignments?include=date.job.site,freelancers.user&limit=3&without_checkins=true&order_by=appointed_at&order_dir=asc&only_fields=assignment.id,assignment.start_time,assignment.finish_time,assignment.freelancer_id,date.appointed_at,job.title,site.name,site.number,site.address,site.zip,site.city,site.group,freelancer.id,freelancer.fullname,freelancer.firstname,freelancer.lastname,freelancer.mobile,user.id,user.email';
          this.store.dispatch(DashboardAction.loadDashboardAttendance({attend}));
        }
      }
    });
  }

  dashboardOffer() {
    const offer = '/offers?include=tender.contract_type,freelancer&limit=3';
    this.store.dispatch(DashboardAction.loadDashboardOffers({offer}));
  }

  dashboardChange() {
    const change = '/requests?include=user&limit=3&type=freelancer-changerequest';
    this.store.dispatch(DashboardAction.loadDashboardChanges({change}));
  }

  dashboardTask(agentId: number | undefined) {
    const task = `/todos?include=owner,creator&limit=3&page=1&order_by=target_at&order_dir=asc&agent_id=${agentId}&state=open`;
    this.store.dispatch(DashboardAction.loadDashboardTask({task}));
  }

  newsLoading(role: string) { // message loading
    let msg = '';
    if(role === 'agent') {
      msg = '/jobs/messages?limit=1000000&page=1&include=question,sender,recipient&order_by=created_at&order_dir=desc';
    } else {
      msg = '/jobs/messages?limit=24&page=1&include=question,sender,recipient&order_by=created_at&order_dir=desc&with_answer=1';
    }
    this.store.dispatch(DashboardAction.newsList({ msg }));
  }

  removeTender(qId: number) { // removing message
    this.store.dispatch(DashboardAction.removeTender({ questionId: qId }));
  }

  dashboardCons() {
    const cons = '/assignments?limit=1&page=2&order_by=appointed_at&order_dir=asc&only_client_created=true&created_from=2021-07-04%2022:00:00';
    this.store.dispatch(DashboardAction.loadDashboardConsultants({cons}));
  }

  dashboardOnBoarding() {
    const onboard = '/requests?include=user&limit=3&type=freelancer-onboarding';
    this.store.dispatch(DashboardAction.loadDashboardOnBoarding({onboard}));
  }

  dashboardProject() {
    const attend = '/projects?limit=10&page=1&include=budget,order,revenues,agent&add_summary=true&order_by=name&order_dir=asc&only_fields=project.id,project.name,project.number_of_jobs,project.sum_planned_costs,project.sum_max_estimated_costs,project.summary,project.state,revenue.total';
    this.store.dispatch(DashboardAction.loadDashboardProject({attend}));
  }

  dashboardJobs() {
    const attend = '/jobs?limit=10&page=1&add_summary=true&include=site,revenues,contract_type&order_by=title&order_dir=asc&only_fields=job.id,job.title,job.summary,job.category,job.is_creator,site.*,revenue.total,contract_type.identifier';
    this.store.dispatch(DashboardAction.loadDashboardJobs({attend}));
  }

  // dashboardJobOffer() {
  //   const attend = '/jobs?include=site,project.client.contacts,contract_type&limit=3&is_not_matching=true';
  //   this.store.dispatch(DashboardAction.loadDashboardJobOffer({attend}));
  // }

  dashboardContractOffer() {
    const attend = '/contract-types?';
    this.store.dispatch(DashboardAction.loadDashboardContract({attend}));
  }

  dashboardCertificate() {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedUser = res?.role_id;
        if (this.loggedUser) {
          const attend = '/freelancers/' + this.loggedUser + '/certificates?limit=3&page=1&order_by=is_recommended&order_dir=desc&include=assignments.date.job';
          this.store.dispatch(DashboardAction.loadDashboardCertificate({attend}));
        }
      }
    });
  }

    dashboardUnsuitableJob() {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedRole = res?.role;
        this.loggedUser = res?.role_id;
        if (this.loggedUser && this.loggedRole === 'freelancer') {
          const attend = '/freelancers/' + this.loggedUser + '/jobs?include=site,project.client.contacts,contract_type&limit=3&page=1&is_not_matching=true';
          this.store.dispatch(DashboardAction.loadDashboardUnsuitableJob({attend}));
        }
      }
    });
  }

  dashboardSuitableJob() {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedRole = res?.role;
        this.loggedUser = res?.role_id;
        if (this.loggedUser && this.loggedRole === 'freelancer') {

          const attend = '/job-advertisements?include=site,project.client.contacts,contract_type&limit=3&is_match=true&only_recommended=true';
          this.store.dispatch(DashboardAction.loadJDashboardSuitableJob({attend}));
        }
      }
    });
  }

  dashboardInvitedJob() {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedRole = res?.role;
        this.loggedUser = res?.role_id;
        if (this.loggedUser && this.loggedRole === 'freelancer') {

          const attend = '/job-invites?limit=3';
          this.store.dispatch(DashboardAction.loadDashboardInviteJob({attend}));
        }
      }
    });
  }

  dashboardAssignment() {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedUser = res?.role_id;
        if (this.loggedUser) {
          const attend = '/freelancers/' + this.loggedUser + '/assignments?include=date.job.site,freelancers.user,date.job.project.client,checkins.creator,checkins.updator,documents,revenues,invoices&limit=3&page=1&order_by=appointed_at&order_dir=asc&only_upcoming=true';
          this.store.dispatch(DashboardAction.loadDashboardAssignment({attend}));
        }
      }
    });
  }

  dashboardUnconfirmedAttendance() {
    const attends = '/assignments?include=date.job.site,freelancers.user&limit=3&without_checkins=true&order_by=appointed_at&order_dir=asc&only_fields=assignment.id,assignment.start_time,assignment.finish_time,assignment.freelancer_id,date.appointed_at,job.title,site.name,site.number,site.address,site.zip,site.city,site.group,freelancer.id,freelancer.fullname,freelancer.firstname,freelancer.lastname,freelancer.mobile,user.id,user.email';
    this.store.dispatch(DashboardAction.loadDashboardUnconfirmedAttendance({attends}));
  }
}
