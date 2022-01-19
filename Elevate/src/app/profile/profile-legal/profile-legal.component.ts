import * as fromProfile from './../state/index';

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { FreelancerVM, FreelancerAssignmentVM } from '../../model/freelancer.model';

@Component({
  selector: 'app-profile-legal',
  templateUrl: './profile-legal.component.html',
  styleUrls: ['./profile-legal.component.scss']
})
export class ProfileLegalComponent implements OnInit {
  profile: FreelancerVM | undefined;
  FreelancerAssignment: FreelancerAssignmentVM | undefined

  constructor(
    private store: Store<fromProfile.State>,
  ) { }

  ngOnInit(): void {
    this.store
      .pipe(select(fromProfile.getProfileDetail))
      .subscribe((profile) => {
        this.profile = profile;
      });
    this.store.pipe(select(fromProfile.getFreelancerAssignment))
      .subscribe((freelancerAssignment) => {
        this.FreelancerAssignment = freelancerAssignment;
      });
  }
}
