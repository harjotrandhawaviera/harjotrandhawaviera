import * as fromProfile from './../state/index';

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import {FreelancerAssignmentVM, FreelancerVM} from '../../model/freelancer.model';

@Component({
  selector: 'app-profile-qualifications',
  templateUrl: './profile-qualifications.component.html',
  styleUrls: ['./profile-qualifications.component.scss']
})
export class ProfileQualificationsComponent implements OnInit {

  profile: FreelancerVM | undefined;
  freelancerAssignment: FreelancerAssignmentVM | undefined;

  constructor(
    private store: Store<fromProfile.State>,
  ) { }

  ngOnInit(): void {
    this.store
      .pipe(select(fromProfile.getProfileDetail))
      .subscribe((profile) => {
        this.profile = profile;
      });
    this.store
      .pipe(select(fromProfile.getFreelancerAssignment))
      .subscribe((freelancerAssignment) => {
        this.freelancerAssignment = freelancerAssignment;
      });
  }

}
