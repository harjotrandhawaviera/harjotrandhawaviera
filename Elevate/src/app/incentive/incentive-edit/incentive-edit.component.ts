import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdministrationFacade } from '../../administration/+state/administration.facade';
import { of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-incentive-edit',
  templateUrl: './incentive-edit.component.html',
  styleUrls: ['./incentive-edit.component.scss']
})
export class IncentiveEditComponent implements OnInit {
  incentive = new FormGroup({
    name: new FormControl(),
    checkin: new FormControl(),
    sales_report: new FormControl(),
    picture_documentation: new FormControl()
  });
  id = '';
  paramId: any;
  result: any = of([]);
  value: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private administrationFacade: AdministrationFacade) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.administrationFacade.getIcEditDisplayRecord$.subscribe((res) => {
      if ('data' in res) {
        this.result = res?.data;
        this.id = res?.data.id;
        this.incentive.patchValue({
          name: this.result.name,
          checkin: this.result.checkin,
          sales_report: this.result.sales_report,
          picture_documentation: this.result.picture_documentation
        });
      }
    });
  }

  saveDetail(lists: any) {
    const newObject = {
      name: lists?.name,
      checkin: lists?.checkin,
      sales_report: lists?.sales_report,
      picture_documentation: lists?.picture_documentation
    };
    this.administrationFacade.updateIncentive(Number(this.id), newObject);
    this.router.navigate(['administration', 'incentives', this.paramId]);
  }

  navigateToDetails() {
    this.router.navigate(['/administration/incentives', this.paramId]);
  }
}
