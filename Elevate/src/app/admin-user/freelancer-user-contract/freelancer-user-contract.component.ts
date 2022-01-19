import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ContractTypesService } from '../../services/contract-types.service';
import { FreelancerService } from './../../services/freelancer.service';

@Component({
  selector: '[app-freelancer-user-contract]',
  templateUrl: './freelancer-user-contract.component.html',
  styleUrls: ['./freelancer-user-contract.component.scss']
})
export class FreelancerUserContractComponent implements OnChanges {
  @Input()
  data: any;
  // expose
  healthInsurance: any = {};
  // enabled contract types
  enabled: any = {};
  // pending contract types (not approved or open requests
  pending: any = {};
  denomination: any = {};
  constructor(private freelancerService: FreelancerService,
    private contractTypesService: ContractTypesService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      if (this.data) {
        this.freelancerService.getHealthInsurances({ limit: 100000, only_fields: ['id', 'name', 'type'] }).subscribe((res) => {
          const list = res && res.data ? res.data.map(a => {
            return {
              text: a.name,
              value: a.id,
              data: {
                type: a.type
              }
            }
          }) : [];
          if (this.data.health_insurance_id) {
            const insurance = list.find(a => a.value === parseInt(this.data.health_insurance_id, 10));
            this.healthInsurance = insurance;
          } else {
            this.healthInsurance = {};
          }
        });

        this.freelancerService.getDenominations().subscribe((res: any) => {
          this.denomination = (res && res.data ? res.data : []).find((a: any) => a.abbreviation === this.data.denomination);
        });

        // load contracttypes
        if (this.data.contract_type_ids && this.data.contract_type_ids.length) {
          this.contractTypesService.getContractTypes({}).subscribe(res => {
            const contractTypes = res.data
              ? res.data.map((a) => {
                return a;
              })
              : [];
            contractTypes.forEach((contractType: any) => {
              this.enabled[contractType.identifier] = this.data.contract_type_ids.includes(contractType.id);
              const flContract = this.data.contract_types.find((a: any) => a.id === contractType.id);
              this.pending[contractType.identifier] = flContract && (!flContract.is_approved || flContract.is_pending);
            })
          });
          // this.contractTypesService.nameList().then(function (resp) {
          //   angular.forEach((resp || []), function (contractType) {
          //     this.enabled[contractType.identifier] = this.data.contract_type_ids.includes(contractType.id);
          //     var flContract = collection.find(this.data.contract_types, { id: contractType.id });
          //     this.pending[contractType.identifier] = flContract && (!flContract.is_approved || flContract.is_pending);
          //   });
          // });
        } else {
          this.enabled = {};
          this.pending = {};
        }
      }
    }
  }

}
