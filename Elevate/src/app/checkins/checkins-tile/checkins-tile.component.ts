import * as fromCheckins from '../state/index';
import * as fromCheckinsAction from '../state/checkins.actions';
import * as moment from 'moment';

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { AssignmentVM } from '../../model/assignment.model';
import { CheckinVM } from '../../model/checkin.model';
import { MatDialog } from '@angular/material/dialog';
import { PrepareService } from '../../services/prepare.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-checkins-tile',
  templateUrl: './checkins-tile.component.html',
  styleUrls: ['./checkins-tile.component.scss'],
})
export class CheckinsTileComponent implements OnInit, OnChanges {
  @Input() checkin?: AssignmentVM;
  bookedFreelancer: any;
  constructor(
    private store: Store<fromCheckins.State>,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private prepareService: PrepareService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.checkin) {
      if (this.checkin.freelancer_id) {
        this.bookedFreelancer =
          this.checkin.freelancers &&
          this.checkin.freelancers.find(
            (x: any) => x.id === this.checkin?.freelancer_id
          );
      }
    }
  }

  ngOnInit(): void {}

  goToDetails(checkin: AssignmentVM) {
    this.router.navigate(['/assignments', checkin.id]);
  }

  modifyTime(checkin: AssignmentVM) {
    if (checkin.id) {
      const timeRange = checkin.start_time + ' - ';
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
        if (result && checkin.id) {
          const time = result.timeRange.split(/[ ]*-[ ]*/);
          const start = this.prepareService.datetime(
            this.prepareService.date(checkin.date?.data.appointed_at, true) +
              ' ' +
              time[0]
          );
          const end = this.prepareService.datetime(
            this.prepareService.date(checkin.date?.data.appointed_at, true) +
              ' ' +
              time[1]
          );
          const obj: CheckinVM = { performed_at: start, finished_at: end,
            assignment_id: checkin?.id, freelancer_id: checkin?.freelancer_id };
          this.store.dispatch(
            new fromCheckinsAction.UpdateCheckin({
              id: checkin.id,
              checkin: obj,
            })
          );
        }
      });
    }
  }
}
