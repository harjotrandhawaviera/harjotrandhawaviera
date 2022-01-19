import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { GenericValidatorService } from '../../services/generic-validator.service';

@Component({
  selector: 'app-profile-contract-type-freelancer',
  templateUrl: './profile-contract-type-freelancer.component.html',
  styleUrls: ['./profile-contract-type-freelancer.component.scss']
})
export class ProfileContractTypeFreelancerComponent implements OnInit {
  @Input()
  freelancerFormGroup: any;
  @Input()
  pending = false;
  @Input()
  readonly = false;
  @Input()
  displayMessage: any = {};
  validationMessages: any;
  @Output() freelancerContract = new EventEmitter();

  constructor(private genericValidatorService: GenericValidatorService) { }

  ngOnInit(): void {
    if (this.freelancerFormGroup) {
      this.freelancerFormGroup.valueChanges.subscribe((value: any) => {
        if (this.freelancerFormGroup) {
          this.displayMessage = this.genericValidatorService.processMessages(
            this.freelancerFormGroup,
            this.validationMessages
          );
        }
        this.freelancerContract.emit(value);
      });
    }
  }

}
