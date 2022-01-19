import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AdministrationFacade} from '../../administration/+state/administration.facade';
import {of} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-insurance-edit',
  templateUrl: './insurance-edit.component.html',
  styleUrls: ['./insurance-edit.component.scss']
})
export class InsuranceEditComponent implements OnInit {
  insurance = new FormGroup({
    name: new FormControl('', Validators.required),
    external_identifier: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl(),
  });
  id: any;
  Nid: any
  paramId: any;
  result: any = of([]);

  constructor(private router: Router,
              private route: ActivatedRoute,
              private administrationFacade: AdministrationFacade) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
        // @ts-ignore
        this.paramId = +params.get('id');
    });
    if(this.paramId) {
      this.administrationFacade.getIEditDisplayRecord$.subscribe((res) => {
        if ('data' in res) {
          this.result = res?.data;
          this.id = res?.data.id;
          if (this.paramId) {
            this.insurance.patchValue({
              name: this.result.name,
              external_identifier: this.result.external_identifier,
              type: this.result.type,
              description: this.result.description
            });
          }
        }
      });
    }
    this.administrationFacade.getNewInsuranceData$.subscribe((res: any) => {
      if (res?.data) {
        this.Nid = res?.data?.id;
        this.router.navigate(['administration', 'insurances', this.Nid]);
      }
    });
  }

  saveDetail(lists: any) {
    const newObject = {
      name: lists?.name,
      description: lists?.description
    };
    this.administrationFacade.updateInsurance(Number(this.id), newObject);
    this.router.navigate(['administration', 'insurances', this.paramId]);
  }

  add(list: any) {
    if (this.insurance.valid) {
      this.administrationFacade.addI(list);
    }
  }
  navigateToDetail() {
    this.router.navigate(['administration', 'insurances', this.paramId ]);
  }
}
