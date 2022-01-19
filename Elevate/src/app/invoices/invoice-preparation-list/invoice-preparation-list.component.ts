import { Component, OnDestroy, OnInit } from '@angular/core';

import { AssignmentMappingService } from './../../services/mapping-services/assignment-mapping.service';
import { FormConfig } from '../../constant/forms.constant';
import { FreelancerService } from './../../services/freelancer.service';
import { InvoiceService } from './../../services/invoice.service';
import { OptionVM } from '../../model/option.model';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-invoice-preparation-list',
  templateUrl: './invoice-preparation-list.component.html',
  styleUrls: ['./invoice-preparation-list.component.scss']
})
export class InvoicePreparationListComponent implements OnInit, OnDestroy {
  isOnBehalf = false;
  freelancerId: any;
  types: any;
  freelancerList: OptionVM[] = [];
  pageSize = 10;
  pageIndex = 1;
  unsubscribeSearchReq: any;
  totalRecords = 0;
  currentPage = 0;
  noRecords = false;
  result: any = [];
  constructor(
    private userService: UserService,
    private freelancerService: FreelancerService,
    private router: Router,
    private invoiceService: InvoiceService,
    private assignmentMappingService: AssignmentMappingService
  ) {

    this.freelancerId = this.userService.user().role() === 'freelancer' && this.userService.user().roleId();
    this.isOnBehalf = this.userService.user().role() !== 'freelancer';
    this.types = FormConfig.invoices.preparation.requiredDocumentTypes[this.isOnBehalf ? 'other' : 'freelancer'] || [];

  }
  ngOnDestroy(): void {
    this.unsubscribeSearch();
  }

  ngOnInit(): void {
    if (this.isOnBehalf) {
      this.freelancerService
        .getFreelancers({
          limit: 1000000,
          only_fields: ['freelancer.id,freelancer.lastname,freelancer.firstname,freelancer.zip,freelancer.city,user.id,user.status'],
          filters: [{ key: 'only_approved', value: true }]
        })
        .subscribe((res) => {
          this.freelancerList = this.sortOption(res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.lastname + ' ' + a.firstname,
                info: a.zip + ' ' + a.city,
              };
            })
            : []);
        });
    }
    this.searchPreparation();
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text.toString().toUpperCase() > b.text.toString().toUpperCase() ? 1 : b.text.toString().toUpperCase() > a.text.toString().toUpperCase() ? -1 : 0) : 0
    );
  }
  unsubscribeSearch() {
    if (this.unsubscribeSearchReq && !this.unsubscribeSearchReq.closed) {
      this.unsubscribeSearchReq.unsubscribe();
    }
  }
  searchPreparation() {
    if (this.freelancerId) {
      this.unsubscribeSearch();
      this.noRecords = false;
      this.unsubscribeSearchReq = this.invoiceService.getFreelancerAssignments(this.freelancerId, this.pageSize, this.pageIndex).subscribe(res => {
        this.result = res.data?.map(a => this.assignmentMappingService.mapAssignmentForPreparation(a));
        this.noRecords = !(res.data?.length);
        this.currentPage = (res.meta?.pagination?.current_page || 1) - 1;
        this.totalRecords = res.meta?.pagination?.total || 0;
      });
    } else {

    }
  }
  pageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex + 1;
    this.searchPreparation();
  }
  goToDetail(item: any) {
    this.router.navigate(['/invoices/preparation', item.id, this.freelancerId]);
  }
}
