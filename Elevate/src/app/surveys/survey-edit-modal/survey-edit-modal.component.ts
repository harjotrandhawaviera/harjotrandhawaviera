import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from './../../services/user.service';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SurveyService } from '../../services/servey.service';

@Component({
  selector: 'app-survey-edit-modal',
  templateUrl: './survey-edit-modal.component.html',
  styleUrls: ['./survey-edit-modal.component.scss']
})
export class SurveyEditModalComponent implements OnInit {
  context = '';
  onbehalf = false;
  data: any;
  view = '';
  isApproved = false;
  isClient = false;
  assignmentId: any;
  freelancerId: any;
  constructor(
    @Optional() public dialogRef: MatDialogRef<SurveyEditModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public surveyData: any,
    private userService: UserService,
    private surveyService: SurveyService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {
    this.onbehalf = this.userService.user().role() !== 'freelancer';
    this.isClient = this.userService.user().role() === 'client' || this.userService.user().role() === 'field';
    this.isApproved = surveyData.data.approval && surveyData.data.approval.state === 'accepted';
    this.data = surveyData.data;
    this.freelancerId = surveyData.freelancerId;
    this.assignmentId = surveyData.assignmentId;
    this.view = surveyData.view;
    this.context = 'surveys.' + surveyData.type;
    if (!this.data.instance) {
      // initialize instance from template
      this.data.instance = this.data[surveyData.type];
      this.data.type = surveyData.type;
      // clear template data
      delete this.data.id;
      delete this.data[surveyData.type];
    }
    if (this.isApproved) {
      this.view = 'readonly';
    }
  }

  ngOnInit(): void {

  }
  cancel() {
    if (this.view === 'set') {
      this.translateService.get('surveys.' + this.data.type + '.cancel-saving').subscribe(res => {
        this.toastrService.success(res);
      })
    }
    this.dialogRef.close();
  }
  submit() {
    const obj = { ...this.data, ...{ freelancer_id: this.freelancerId, assignment_id: this.assignmentId } };
    const fields = {
      freelancer_id: obj.freelancer_id,
      assignment_id: obj.assignment_id,
      instance: obj.instance,
      type: obj.type,
      comment: obj.comment,
    }
    fields.instance = (fields.instance || []).map((a: any) => {
      return {
        question: a.question,
        answer: a.answer,
        type: a.type,
        comment: a.comment
      }
    });
    let req: Observable<any> | null = null;
    if (obj.id) {
      req = this.surveyService.updateSurveyInstance(this.freelancerId, this.assignmentId, obj.id, fields)
    } else {
      req = this.surveyService.createSurveyInstance(this.freelancerId, this.assignmentId, fields)
    }
    req.subscribe(res => {
      this.toastrService.success(this.translateService.instant('notification.post.freelancers-assignments-survey_instances.success'));
      this.dialogRef.close(res);
    }, error => {;
      this.dialogRef.close();
    });
  }
}
