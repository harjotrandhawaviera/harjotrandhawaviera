import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReportAdminActions } from './report-admin.actions';
import { ReportAdminAppState } from './report-admin.reducer';
import { fromReportAdmin } from './report-admin.selector';

@Injectable({
  providedIn: 'root'
})
export class ReportAdminFacade {
  constructor(private store: Store<ReportAdminAppState>) { }
  getFreelancerList$ = this.store.select(fromReportAdmin.getFreelancerList);
  getLoaderValue$ = this.store.select(fromReportAdmin.getLoaderValue);

  loadFreelancerList() {
    const params = '/admin/adminusers?limit=10&include=user.freelancer&only_fields=freelancer.id,freelancer.firstname,freelancer.lastname,freelancer.fullname,freelancer.zip,freelancer.city,freelancer.mobile,freelancer.avg_assignment_rating,freelancer.country,freelancer.face_picture_id,user.id,user.email,user.has_requested_account_delete,user.has_requested_password_reset,user.status,user.active_at,user.created_at,user.confirmed_at,freelancer.ready_for_active'
    this.store.dispatch(ReportAdminActions.loadAdminFreelancerList({params}));
  }

  loadUpdateFreelancerList(updateValue?: any) {
    // tslint:disable-next-line:variable-name
    const status = updateValue.status;
    const language = updateValue.language;
    const license = updateValue.license;
    const city = updateValue.city;
    const zip = updateValue.zip;
    const gender = updateValue.gender;
    const age = updateValue.age;
    const ownCar = updateValue.hasOwnCar;
    const skills = updateValue.skills;
    const work = updateValue.work;
    const project = updateValue.project;
    const pageValue = updateValue.pageIndex;
    let params = '/admin/adminusers?creator=0&?limit=10000&include=user.freelancer';
    if (status?.length) {
      params += '&status=' + status;
    }
    if (language?.length) {
      params += '&language=' + language;
    }
    if (city?.length) {
      params += '&city=' + city;
    }
    if (license?.length) {
      params += '&has_driverslicense=' + license;
    }
    if (ownCar?.length) {
      params += '&own_car=' + ownCar;
    }
    if (zip?.length) {
      params += '&zip=' + zip;
    }
    if (gender?.length) {
      params += '&gender=' + gender;
    }
    if (age?.length) {
      params += '&age_group=' + age;
    }
    if (skills?.length) {
      params += '&skill=' + skills;
    }
    if (work?.length) {
      params += '&work_condition=' + work;
    }
    if (project?.length) {
      params += '&project=' + project;
    }
    if (pageValue) {
      params += '&page=' + pageValue;
    }
    this.store.dispatch(ReportAdminActions.loadAdminFreelancerList({ params }));
  }
}
