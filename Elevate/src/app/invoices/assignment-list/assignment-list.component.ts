import { Component, Input, OnInit } from '@angular/core';

import { AssignmentService } from './../../services/assignment.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { FormatService } from '../../services/format.service';
import { MatDialog } from '@angular/material/dialog';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: '[app-assignment-list]',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss']
})
export class AssignmentListComponent implements OnInit {
  @Input()
  assignments: any[] = [];
  @Input()
  selection = new SelectionModel<any>(true, []);
  @Input()
  assignmentColumns: string[] = [];
  constructor(
    private dialog: MatDialog,
    private assignmentService: AssignmentService,
    private toastrService: ToastrService,
    private format: FormatService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.assignments && this.assignments.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.assignments.forEach(row => this.selection.select(row.id));
  }
  assignmentBudgetCorrection(assignment: any) {
    this.translateService.get('assignment.update-correction.title').subscribe(res => {
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          title: this.translateService.instant('assignment.update-correction.title'),
          message: this.translateService.instant('assignment.update-correction.message'),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-save',
          inputFieldType: 'assignmentBudget',
          fieldValue: assignment.assignment_budget_correction
        },
      }).afterClosed().subscribe((result) => {
        if (result) {
          this.assignmentService.updateAssignment({ id: assignment.id, assignment: { assignment_budget_correction: result.assignmentBudgetCorrection } }).subscribe(resp => {
            if (resp && resp.body) {
              const data = resp.body;
              assignment.assignment_budget_correction = data.data && data.data.assignment_budget_correction;
              assignment.assignmentBudgetCorrection = this.format.formatCurrency(assignment.assignment_budget_correction) || '';
              assignment.plannedCosts = this.format.formatCurrency(data?.data?.planned_costs) || '';
              this.toastrService.success(this.translateService.instant('notification.post.assignments.success'));
            }
          });
        }
      });
    });
  }
  comment(assignment: any) {
    this.translateService.get('assignment.update-comment.title').subscribe(res => {
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          needReason: true,
          title: this.translateService.instant('assignment.update-comment.title'),
          message: this.translateService.instant('assignment.update-comment.message'),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-save',
          fieldValue: assignment.comment
        },
      }).afterClosed().subscribe((result) => {
        if (result) {
          this.assignmentService.updateAssignment({ id: assignment.id, assignment: { comment: result.reason } }).subscribe(res => {
            assignment.comment = res.body && res.body.data && res.body.data.comment;
            this.toastrService.success(this.translateService.instant('notification.post.assignments.success'));
          });
        }
      });
    });
  }
  freelancerCostsNet(assignment: any) {
    this.translateService.get('assignment.update-freelancer-costs-net.title').subscribe(res => {
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          title: this.translateService.instant('assignment.update-freelancer-costs-net.title'),
          message: this.translateService.instant('assignment.update-freelancer-costs-net.message'),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-save',
          fieldValue: assignment.freelancer_costs_net,
          inputFieldType: 'number'
        },
      }).afterClosed().subscribe((result) => {
        if (result) {
          this.assignmentService.updateAssignment({ id: assignment.id, assignment: { freelancer_costs_net: result.freelancerCostsNet } }).subscribe(resp => {
            assignment.freelancer_costs_net = resp.body && resp.body.data && resp.body.data.freelancer_costs_net;
            assignment.freelancerCostsNet = this.format.formatCurrency(assignment.freelancer_costs_net) || '';
            this.toastrService.success(this.translateService.instant('notification.post.assignments.success'));
          });
        }
      });
    });
  }
}
