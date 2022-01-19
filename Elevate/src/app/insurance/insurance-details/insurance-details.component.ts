import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdministrationFacade } from '../../administration/+state/administration.facade';
import { OptionVM } from '../../model/option.model';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.scss']
})
export class InsuranceDetailsComponent implements OnInit {
  paramId: any;
  insuranceDetails: OptionVM | any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private administrationFacade: AdministrationFacade) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.administrationFacade.InsuranceDetail(this.paramId);
    this.administrationFacade.getInsuranceDetails$.subscribe((res: any) => {
      if (res?.data) {
        this.insuranceDetails = {
          name: res?.data?.name,
          Eid: res?.data?.external_identifier,
          type: res?.data?.type,
          desc: res?.data?.description
        };
      }
    });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  Edata(id: any) {
    this.administrationFacade.loadEditInsuranceData(id);
  }
}
