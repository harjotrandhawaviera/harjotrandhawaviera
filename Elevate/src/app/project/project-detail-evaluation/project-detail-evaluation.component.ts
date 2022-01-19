import * as moment from 'moment';

import { Component, Input, OnInit } from '@angular/core';

import { AssignmentService } from '../../services/assignment.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { FileExportService } from '../../services/file-export.service';
import { FormatConfig } from './../../constant/formats.constant';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-project-detail-evaluation',
  templateUrl: './project-detail-evaluation.component.html',
  styleUrls: ['./project-detail-evaluation.component.scss'],
})
export class ProjectDetailEvaluationComponent implements OnInit {
  @Input()
  id: string | null = null;
  @Input()
  name: string | undefined = undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  constructor(
    private assignmentService: AssignmentService,
    private fileExportService: FileExportService,
    private translateService: TranslateService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}
  downloadReport() {
    // this.translateService
    //   .get('assignments.download.confirm.title')
    //   .subscribe(() => {

    //   });
    this.confirmDownload().subscribe((res) => {
      if (res) {
        const obj: any = {
          project: this.id,
          date_from: this.startDate
            ? moment(this.startDate).format(FormatConfig.prepare.dateformat) +
              ' 00:00:00'
            : undefined,
          date_to: this.endDate
            ? moment(this.endDate).format(FormatConfig.prepare.dateformat) +
              ' 00:00:00'
            : undefined,
          view: 'project',
          with_feedback: true,
          with_revenue: true,
          timestamp: moment().unix(),
        };
        const filters: { key: string; value: string | number | boolean }[] = [];
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (obj[key]) {
              filters.push({ key: key, value: obj[key] });
            }
          }
        }
        this.fileExportService.getDownload({
          url: this.assignmentService.downloadAssignmentsUrl(filters),
          fileName: `${this.name}_assignments`,
          mimeType: 'text/csv;charset=UTF-8'
        });
      }
    });
  }
  downloadFeedback() {
    this.confirmDownload().subscribe((res) => {
      if (res) {
        const obj: any = {
          project: this.id,
          date_from: this.startDate
            ? moment(this.startDate).format(FormatConfig.prepare.dateformat) +
              ' 00:00:00'
            : undefined,
          date_to: this.endDate
            ? moment(this.endDate).format(FormatConfig.prepare.dateformat) +
              ' 00:00:00'
            : undefined,
          view: 'feedback',
          with_feedback: true,
          timestamp: moment().unix(),
        };
        const filters: { key: string; value: string | number | boolean }[] = [];
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (obj[key]) {
              filters.push({ key: key, value: obj[key] });
            }
          }
        }
        this.fileExportService.getDownload({
          url: this.assignmentService.downloadAssignmentsUrl(filters),
          fileName: `${this.name}_feedbacks`,
          mimeType: 'text/csv;charset=UTF-8'
        });
      }
    });
  }

  confirmDownload() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        titleCode: 'assignments.download.confirm.title',
        messageCode: 'assignments.download.confirm.message',
        cancelCode: 'assignments.download.confirm.buttons.cancel',
        confirmCode: 'assignments.download.confirm.buttons.confirm',
      },
    });
    return dialogRef.afterClosed();
  }
}
