import * as fromAssignment from '../state/index';
import * as fromAssignmentAction from '../state/assignment.actions';
import * as moment from 'moment';

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { AgentVM } from '../../model/agent.model';
import { AssignmentVM } from '../../model/assignment.model';
import { CheckinVM } from '../../model/checkin.model';
import { FormatConfig } from '../../constant/formats.constant';
import { MatDialog } from '@angular/material/dialog';
import { PrepareService } from '../../services/prepare.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { Store } from '@ngrx/store';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-assignment-job',
  templateUrl: './assignment-job.component.html',
  styleUrls: ['./assignment-job.component.scss'],
})
export class AssignmentJobComponent implements OnInit, OnChanges {
  @Input() job: any;
  @Input() assignment: AssignmentVM | undefined;
  @Input() hasFullAccess: boolean | null = false;

  startTime: any;
  endTime: any;
  comment: string | undefined;
  freelancerCostsNet: number | undefined;
  assignmentBudgetCorrection: number | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      this.assignment &&
      this.assignment.checkins &&
      this.assignment.checkins[0]
    ) {
      this.startTime = moment
        .utc(this.assignment.checkins[0].performed_at)
        .local()
        .format('HH:mm');
      this.endTime = this.assignment.checkins[0].finished_at
        ? moment
            .utc(this.assignment.checkins[0].finished_at)
            .local()
            .format('HH:mm')
        : '--:--';
      this.comment = this.assignment.comment;
      this.freelancerCostsNet = this.assignment.freelancer_costs_net;
      console.log(this.freelancerCostsNet);
      this.assignmentBudgetCorrection =
        this.assignment.assignment_budget_correction;
    }
  }

  constructor(
    private store: Store<fromAssignment.State>,
    private prepareService: PrepareService,
    private translateService: TranslateService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  modifyTime(assignment: AssignmentVM) {
    if (assignment.id) {
      const timeRange = this.startTime + ' - ' + this.endTime || '';
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'assignments.table.modifytime.title'
          ),
          message: this.translateService.instant(
            'assignments.table.modifytime.message'
          ),
          label: this.translateService.instant(
            'assignments.table.modifytime.placeholder'
          ),
          inputFieldType: 'timeRange',
          fieldValue: timeRange,
          cancelCode: 'assignment.update-hours.buttons.cancel',
          confirmCode: 'assignment.update-hours.buttons.confirm',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && assignment.id) {
          const time = result.timeRange.split(/[ ]*-[ ]*/);
          const start = this.prepareService.datetime(
            this.prepareService.date(assignment.date?.data.appointed_at, true) +
              ' ' +
              time[0]
          );
          const end = this.prepareService.datetime(
            this.prepareService.date(assignment.date?.data.appointed_at, true) +
              ' ' +
              time[1]
          );
          const obj: CheckinVM = { performed_at: start, finished_at: end };
          this.store.dispatch(
            new fromAssignmentAction.UpdateCheckin({
              id: assignment.checkins[0].id,
              checkin: obj,
            })
          );
        }
      });
    }
  }

  updateComment(assignment: AssignmentVM) {
    if (assignment.id) {
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'assignments.table.update-comment.title'
          ),
          message: this.translateService.instant(
            'assignments.table.update-comment.message'
          ),
          label: this.translateService.instant(
            'assignments.table.update-comment.placeholder'
          ),
          needReason: true,
          reasonValue: this.comment ? this.comment : this.assignment?.comment,
          cancelCode: 'assignment.update-comment.buttons.cancel',
          confirmCode: 'assignment.update-comment.buttons.confirm',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && assignment.id) {
          const obj = {
            comment: result.reason,
          };
          this.store.dispatch(
            new fromAssignmentAction.UpdateAssignment({
              id: assignment.id,
              assignment: obj,
            })
          );
          this.comment = obj.comment;
        }
      });
    }
  }

  updateFreelancerCostsNet(assignment: AssignmentVM) {
    if (assignment.id) {
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'assignment.update-freelancer-costs-net.title'
          ),
          message: this.translateService.instant(
            'assignment.update-freelancer-costs-net.message'
          ),
          label: this.translateService.instant(
            'assignment.update-freelancer-costs-net.placeholder'
          ),
          inputFieldType: 'number',
          fieldValue: this.freelancerCostsNet,
          cancelCode: 'assignment.update-freelancer-costs-net.buttons.cancel',
          confirmCode: 'assignment.update-freelancer-costs-net.buttons.confirm',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && assignment.id) {
          const obj = {
            freelancer_costs_net: result.freelancerCostsNet,
          };
          this.store.dispatch(
            new fromAssignmentAction.UpdateAssignment({
              id: assignment.id,
              assignment: obj,
            })
          );
          this.freelancerCostsNet = obj.freelancer_costs_net;
        }
      });
    }
  }

  updateAssignmentBudgetCorrection(assignment: AssignmentVM) {
    if (assignment.id) {
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'assignment.update-correction.title'
          ),
          message: this.translateService.instant(
            'assignment.update-correction.message'
          ),
          label: this.translateService.instant(
            'assignment.update-correction.placeholder'
          ),
          inputFieldType: 'assignmentBudget',
          fieldValue: this.assignmentBudgetCorrection,
          cancelCode: 'assignment.update-correction.buttons.cancel',
          confirmCode: 'assignment.update-correction.buttons.confirm',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && assignment.id) {
          const obj = {
            assignment_budget_correction: result.assignmentBudgetCorrection,
          };
          this.store.dispatch(
            new fromAssignmentAction.UpdateAssignment({
              id: assignment.id,
              assignment: obj,
            })
          );
          this.assignmentBudgetCorrection = obj.assignment_budget_correction;
        }
      });
    }
  }
}
