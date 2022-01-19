import { Component, OnInit } from '@angular/core';
import { OptionVM } from '../../model/option.model';
import { AccountingFacade } from '../+state/accounting.facade';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-sales-report-details',
  templateUrl: './sales-report-details.component.html',
  styleUrls: ['./sales-report-details.component.scss']
})
export class SalesReportDetailsComponent implements OnInit {
  revenuesDetails: OptionVM | any;
  paramId: string = '';

  constructor(private accountingFacade: AccountingFacade,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    // @ts-ignore
    this.accountingFacade.RevenuesDetail(this.paramId);
    this.accountingFacade.getRevenueDetail$.subscribe((res: any) => {
      if (res?.data) {
        this.revenuesDetails = {
          title: res?.data?.job?.data?.title,
          name: res?.data?.freelancer?.data?.fullname,
          c_date: res?.data?.created_at,
          total: res?.data?.total,
          average: res?.data?.average,
          a_date: res?.data?.assignments?.data[0]?.appointed_at,
          sales: res?.data?.sales_volume.map((r: any) => {
            return { saleslot: r?.saleslot, value: r?.value };
          })
        };
      }
      }
    );
  }
}
