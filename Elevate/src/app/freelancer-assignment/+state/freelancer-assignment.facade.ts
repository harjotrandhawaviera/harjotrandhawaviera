import { Injectable } from '@angular/core';
import { FreelancerAssignmentAppState } from './freelancer-assignment.reducer';
import { Store } from '@ngrx/store';
import { FreelancerAction } from './freelancer-assignment.action';
import { fromFreelancerAssignment } from './freelancer-assignment.selector';
import * as fromCurrentUser from '../../root-state/user-state';

@Injectable({
  providedIn: 'root'
})

export class FreelancerAssignmentFacade {
  loggedUser: any;
  constructor(private store: Store<FreelancerAssignmentAppState>) {
  }

  getFreelancerAssignment$ = this.store.select(fromFreelancerAssignment.getCallList);
  getFreelancerAssignmentDetails$ = this.store.select(fromFreelancerAssignment.getFreelancerDetails);
  getLoading$ = this.store.select(fromFreelancerAssignment.getLoading);

  FreelancerAssignmentCallList() {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedUser = res?.role_id;
        if (this.loggedUser) {
          const attend = '/freelancers/' + this.loggedUser + '/assignments?include=date.job.site,date.job.project.client,checkins.creator,checkins.updator,documents.approval,revenues,invoices&limit=12&page=1&order_by=appointed_at&order_dir=asc&only_upcoming=true&only_fields=assignment.id,assignment.category,assignment.state,assignment.start_time,assignment.finish_time,assignment.freelancer_id,assignment.has_missing_docs,assignment.planned_costs,assignment.freelancer_costs_net,assignment.comment,date.appointed_at,job.title,client.name,freelancer.id,freelancer.fullname,freelancer.firstname,freelancer.lastname,freelancer.mobile,user.email';
          this.store.dispatch(FreelancerAction.loadFreelancerAssignment({attend}));
        }
      }
    });
  }

  loadUpdateFreelancerAssignmentSearchList(updateValue: any) {
    // tslint:disable-next-line:variable-name
    const upcoming = updateValue.upcoming;
    const contactType = updateValue.contactType;
    const start = updateValue.start;
    const end = updateValue.end;
    const status = updateValue.status;
    const invoice = updateValue.invoice;
    const searchValue = updateValue.search;
    let attend =  '/freelancers/' + this.loggedUser + '/assignments?include=date.job.site,date.job.project.client,checkins.creator,checkins.updator,documents.approval,revenues,invoices&limit=12&page=1&order_by=appointed_at&order_dir=asc&only_fields=assignment.id,assignment.category,assignment.state,assignment.start_time,assignment.finish_time,assignment.freelancer_id,assignment.has_missing_docs,assignment.planned_costs,assignment.freelancer_costs_net,assignment.comment,date.appointed_at,job.title,client.name,freelancer.id,freelancer.fullname,freelancer.firstname,freelancer.lastname,freelancer.mobile,user.email';
    if (upcoming) {
      attend += '&only_upcoming=' + upcoming;
    }
    if (contactType) {
      attend += '&contract_type_id=' + contactType;
    }
    if (start) {
      attend += '&date_from=' + start;
    }
    if (end) {
      attend += '&date_end=' + end;
    }
    if (status) {
      attend += '&state=' + status;
    }
    if (invoice) {
      attend += '&invoice_state=' + invoice;
    }
    if (searchValue) {
      attend += '&search=' + searchValue;
    }
    this.store.dispatch(FreelancerAction.loadFreelancerAssignment({ attend }));
  }

  FreelancerAssignmentDetail(loggedId: number, paramId: number) {
    const updateFreelancerAssignmentValue = '/freelancers/' + loggedId + '/assignments/' + paramId + '?include=date.job.site,documents.approval.updator,checkins,certificates,revenues.creator,revenues.updator,questionnaire';
    this.store.dispatch(FreelancerAction.freelancerAssignmentDetail({paramId, updateFreelancerAssignmentValue}));
  }
}
