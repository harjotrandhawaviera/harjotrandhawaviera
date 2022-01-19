import * as fromProfile from './../state/index';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FreelancerAssignmentVM, FreelancerVM} from '../../model/freelancer.model';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-profile-contract-tax-card',
  templateUrl: './profile-contract-tax-card.component.html',
  styleUrls: ['./profile-contract-tax-card.component.scss']
})
export class ProfileContractTaxCardComponent implements OnInit {
  profile: FreelancerVM | undefined;
  FreelancerAssignment: FreelancerAssignmentVM | undefined
  @Input()
  isShowGeneralContract = false;
  @Output() freelancerValue = new EventEmitter();

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
        // this.FreelancerAssignment = freelancerAssignment;
      });
  }

  freelancerContract(value: any) {
    this.freelancerValue.emit(value);
  }
}
