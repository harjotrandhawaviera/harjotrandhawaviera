import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { FormatConfig } from '../../constant/formats.constant';
import { InvoiceService } from './../../services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { RevenueService } from './../../services/revenue.service';
import { TranslateService } from './../../services/translate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-assignment-revenue, [app-assignment-revenue]',
  templateUrl: './assignment-revenue.component.html',
  styleUrls: ['./assignment-revenue.component.scss']
})
export class AssignmentRevenueComponent implements OnInit, OnChanges {
  @Input()
  data: any;
  @Input()
  assignment: any;
  @Input()
  job: any;
  @Input()
  onBehalf: any;
  @Input()
  withCreator: any;
  @Input()
  view: any;
  @Output()
  updated = new EventEmitter();
  roleId: any;
  origData: any;
  editing: boolean = false;
  currencyPattern = FormatConfig.check.numberPattern;
  constructor(
    private userService: UserService,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private revenueService: RevenueService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.roleId = !this.onBehalf && this.userService.user().roleId();
    if (this.data && this.assignment) {
      this.data.appointedAt = this.assignment.appointedAt;
      this.data.assignmentId = this.assignment.id;
      this.data.total = this.totalSum(this.data);
    }
  }
  updateTotal(revenue: any) {
    return this.totalSum(revenue);
  }
  totalSum(item: any) {
    return (item && item.sales_volume && item.sales_volume.reduce((acc: any, val: any) => {
      return acc + (parseFloat(val.value || 0) * 100);
    }, 0)) / 100 || 0;
  }
  ngOnInit(): void {
  }
  createNewRevenue() {
    // create new revenue
    return {
      id: 'create-' + Math.random().toString(36).substr(2, 10),
      job_id: this.job.id,
      assignment_ids: [this.assignment.id],
      freelancer_id: this.onBehalf,
      appointedAt: this.assignment.appointedAt,
      sales_volume: this.job.saleslots.map((a: any) => {
        return { saleslot: a.name, value: null };
      })
    };
  }
  onCancel() {
    this.data = this.origData ? { ...this.origData } : null;
    this.editing = false;
  }
  onAdd() {
    this.origData = this.data ? { ...this.data } : null;
    if (this.assignment) {
      this.data = this.createNewRevenue();
    }
    // set form to edit
    this.editing = true;
  }
  onEdit() {
    this.origData = { ...this.data };
    this.editing = true;
  }
  onRemove() {
    // invoicesService.saveRevenues([{id: vm.data.id, remove: true}], roleId).then(function () {
    //     vm.data = null;
    // });
    this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'revenue.confirm.remove.title'
        ),
        message: this.translateService.instant(
          'revenue.confirm.remove.message'
        ),
        cancelCode: 'common.buttons.cancel',
        confirmCode: 'common.buttons.yes-remove',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        this.onUpdate(true);
      }
    });

  }
  onUpdate(remove: boolean = false) {
    const freelancerId = this.roleId;
    const revenue = this.prepareRevenue({
      id: this.data.id,
      job_id: this.data.job_id,
      comment: this.data.comment,
      sales_volume: this.data.sales_volume,
      assignment_ids: this.data.assignment_ids,
      freelancer_id: this.data.freelancer_id
    }, remove);
    if (remove || (revenue.assignment_ids && revenue.assignment_ids.length > 0)) {
      let req: Observable<any> | null = null;
      if (remove) {
        if (freelancerId) {
          req = this.revenueService.removeFreelancerRevenue(freelancerId, revenue.id);
        } else {
          req = this.revenueService.removeRevenue(revenue.id);
        }
      } else {
        if (revenue.id) {
          if (freelancerId) {
            req = this.revenueService.updateFreelancerRevenue(freelancerId, revenue.id, revenue);
          } else {
            req = this.revenueService.updateRevenue(revenue.id, revenue);
          }
        } else {
          if (freelancerId) {
            req = this.revenueService.createFreelancerRevenue(freelancerId, revenue);
          } else {
            req = this.revenueService.createRevenue(revenue);
          }
        }
      }
      if (req) {
        req.subscribe(res => {
          if (remove) {
            this.data = null;
            this.updated.emit(null);
          } else {
            if (res?.body?.data) {
              const updated = res?.body?.data;
              updated.salesVolume = {};
              updated.sales_volume.forEach((vol: any) => {
                updated.salesVolume[vol.saleslot] = vol.value;
              });
              this.data = updated;
              this.editing = false;
              this.updated.emit(updated);
            }
          }
        });
      }
    }
    // invoicesService.saveRevenues([collection.only(vm.data, ['id', 'job_id', 'comment', 'sales_volume', 'assignment_ids', 'freelancer_id'])], roleId).then(function (data) {
    //     vm.data = data && data[0];
    //     vm.editing = false;
    // });
  }
  prepareRevenue(revenue: any, remove: boolean) {
    if (revenue.id && revenue.id.substring && revenue.id.substring(0, 7) === 'create-') {
      revenue.id = undefined;
    }
    if (revenue.id && remove) {
      return {
        id: revenue.id,
        remove: true
      };
    }

    if (revenue.salesVolume) {
      revenue.sales_volume = [];
      Object.keys(revenue.salesVolume).forEach(function (key) {
        revenue.sales_volume.push({
          saleslot: key,
          value: revenue.salesVolume[key]
        });
      });
    }
    return revenue;
  }
}
