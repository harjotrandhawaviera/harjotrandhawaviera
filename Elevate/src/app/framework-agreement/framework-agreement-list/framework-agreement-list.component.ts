import { Component, OnInit } from '@angular/core';
import { AdministrationFacade } from '../../administration/+state/administration.facade';
import { Router } from '@angular/router';
import { OptionVM } from '../../model/option.model';
import { AdministrationModelSearchVM } from '../../model/administartion.model';
import { Observable, of } from 'rxjs';
import {TranslateService} from '../../services/translate.service';

@Component({
  selector: 'app-framework-agreement-list',
  templateUrl: './framework-agreement-list.component.html',
  styleUrls: ['./framework-agreement-list.component.scss']
})
export class FrameworkAgreementListComponent implements OnInit {
  displayedColumns = [
    'identifier',
    'contractType',
    'publishedAt',
    'validAt',
    'invalidAt',
    'action'
  ];
  paginator: any;
  loading$: Observable<boolean> = of(false);
  FrameworkList: OptionVM | any;
  searchModel: AdministrationModelSearchVM = {};

  constructor(private administrationFacade: AdministrationFacade,
              private router: Router,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.administrationFacade.loadFramework();
    this.translateService.get('contracts.identifier').subscribe(() => {
      this.administrationFacade.getFrameworkList$.subscribe((res: any) => {
        this.FrameworkList = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                id: a?.id,
                identifier: a?.identifier,
                ide: this.translateService.instant('contracts.identifier.' + a?.contract_type?.data?.identifier),
                name: a?.name,
                register: a?.published_at,
                value: a?.valid_at,
                invalid: a?.invalid_at,
              };
            })
            : []
        );
        this.paginator = res?.meta?.pagination;
      });
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.administrationFacade.loadUpdateInsuranceSearchList(update);
  }

}
