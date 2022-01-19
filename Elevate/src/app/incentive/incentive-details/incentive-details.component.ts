import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AdministrationFacade } from '../../administration/+state/administration.facade';
import { OptionVM } from '../../model/option.model';

@Component({
  selector: 'app-incentive-details',
  templateUrl: './incentive-details.component.html',
  styleUrls: ['./incentive-details.component.scss']
})
export class IncentiveDetailsComponent implements OnInit {
  paramId: any;
  IncentiveDetails: OptionVM | any;

  constructor(private route: ActivatedRoute,
              private administrationFacade: AdministrationFacade) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.administrationFacade.IncentiveDetail(this.paramId);
    this.administrationFacade.getIncentiveDetails$.subscribe((res: any) => {
      if (res?.data) {
        this.IncentiveDetails = {
          name: res?.data?.name,
          register: res?.data?.checkin,
          value: res?.data?.picture_documentation,
          sales: res?.data?.sales_report,
        };
      }
    });
  }

  Edata(id: any) {
    this.administrationFacade.loadEditIncentiveData(id);
  }
}
