import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-invoice-report-revenue, [app-invoice-report-revenue]',
  templateUrl: './invoice-report-revenue.component.html',
  styleUrls: ['./invoice-report-revenue.component.scss']
})
export class InvoiceReportRevenueComponent implements OnInit, OnChanges {
  @Input()
  job: any;
  @Input()
  data: any;
  @Input()
  selected: any;
  @Input()
  assignments: any;
  @Input()
  withCreator = false;
  @Input()
  editable = false;
  @Input()
  onBehalf = ''
  revenuesAvailable: any;
  revenuesEditable = false;
  editing = false;
  showDetails = false;
  saleslots: any;
  origData: any;
  constructor(private userService: UserService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.initRevenues();
    }
    if (changes.editable) {

    }
  }

  ngOnInit(): void {
  }
  edit() {

  }
  add() {
    this.selected.forEach((assignmentId: any) => {
      this.data.push(this.createNewRevenue(assignmentId));
    });

    this.checkRevenuesState();
    // set form to edit
    this.editing = true;
    // expand table for editing
    this.showDetails = true;
  }
  update() {
    // only submit selected assignments
    // invoicesService.saveRevenues(vm.data, user.role() === 'freelancer' && user.roleId()).then(function (data) {
    //   // update orig settings
    //   angular.copy(data, vm.data);
    //   // store orig settings
    //   origData = angular.copy(vm.data);
    //   initRevenues();
    //   vm.editing = false;
    // });
  }
  cancel() {
    this.data = JSON.parse(JSON.stringify(this.origData))
    this.editing = false;
    this.showDetails = false;
  }

  /**
    * init revenues for selected assignment ids
    */
  initRevenues() {
    if (this.data && this.data.length > 0) {
      this.data.forEach((revenue: any) => {
        var assignment = this.assignments.find((a: any) => a.id === revenue.assignment_ids[0]);
        if (assignment) {
          revenue.appointedAt = assignment.appointedAt;
          revenue.assignmentId = assignment.id;
          revenue.total = this.totalSum(revenue);
        }
      });
      this.saleslots = Object.keys(this.data[0].salesVolume);
    }

    this.checkRevenuesState();
  }
  /**
   * generates a new revenue object
   * @param {int} assignmentId
   * @return {{job_id, assignment_ids: *[], freelancer_id, sales_volume: *, salesVolume: {}}}
   */
  createNewRevenue(assignmentId: any) {
    // create new revenue
    const salesVolume: any = {};
    this.job.saleslots.forEach((slot: any) => {
      salesVolume[slot.name] = 0;
    });
    const assignment = this.assignments.find((a: any) => a.id === assignmentId);

    return {
      id: 'create-' + Math.random().toString(36).substr(2, 10),
      job_id: this.job.id,
      assignment_ids: [assignmentId],
      freelancer_id: this.onBehalf,
      appointedAt: assignment.appointedAt,
      sales_volume: this.job.saleslots.find((a: any) => a.saleslot === 'name' && a.value === null),
      salesVolume: salesVolume
    };
  }
  /**
    * check state of revenues, f.e. revenues available, revenues editable
    */
  checkRevenuesState() {
    if (this.data) {
      this.revenuesAvailable = this.data.length > 0;
      this.revenuesEditable = this.selected && this.data.some((revenue: any) => {
        return this.selected.indexOf(revenue.assignment_ids[0]) >= 0;
      });
    }
  }
  /**
   * calculation of sum of sales_volume
   * @param {object} item
   */
  totalSum(item: any) {
    return (item && item.sales_volume && item.sales_volume.reduce((acc: any, val: any) => {
      return acc + (parseFloat(item.salesVolume[val.saleslot]) * 100);
    }, 0)) / 100 || 0;
  }

  /**
   * watch function to enable or disable edit state
   * from outer scope
   * @param editable
   */
  onEditableChanged(editable: any) {
    if (editable) {
      // store orig settings
      this.origData = JSON.parse(JSON.stringify(this.data));
    } else {
      // reset potentially edited data
      if (this.origData) {
        this.data = JSON.parse(JSON.stringify(this.origData))
      }
      this.editing = false;
    }
  }
}
