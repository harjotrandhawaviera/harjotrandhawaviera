import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FormatService } from './../../services/format.service';
import { MatDialog } from '@angular/material/dialog';
import { SurveyEditModalComponent } from '../survey-edit-modal/survey-edit-modal.component';
import { SurveyService } from '../../services/servey.service';
import { TranslateService } from './../../services/translate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: '[app-survey-details-button]',
  templateUrl: './survey-details-button.component.html',
  styleUrls: ['./survey-details-button.component.scss']
})
export class SurveyDetailsButtonComponent implements OnInit, OnChanges {
  @Output()
  updatedSurveyInstanceApproval = new EventEmitter();
  @Output()
  reload = new EventEmitter();
  @Input()
  assignment: any = undefined;
  @Input()
  isUpdate = false;
  @Input()
  view = '';
  @Input()
  approvalView = ''
  @Input()
  type = ''
  onBehalf = false;
  isClient = false;
  freelancerId = '';
  @Input()
  warning = false;
  surveyData: any;
  @Input()
  surveyInstanceApproval: any;
  constructor(private userService: UserService,
    private surveyService: SurveyService,
    public dialog: MatDialog,
    private format: FormatService,
    private translateService: TranslateService) {
    this.onBehalf = this.userService.user().role() !== 'freelancer';
    this.isClient = this.userService.user().role() === 'client' || this.userService.user().role() === 'field';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.assignment) {
      this.freelancerId = this.userService.user().role() === 'freelancer' && this.userService.user().roleId() || this.assignment?.freelancer_id;
      if (this.assignment && this.type) {
        switch (this.type) {
          case 'questionnaire': {
            if (this.assignment.freelancer_assignment_questionnaire_instance_id) {
              this.isUpdate = true;
            } else {
              this.isUpdate = false;
            }
            break;
          }
          case 'feedback': {
            if (this.assignment.freelancer_assignment_feedback_instance_id) {
              this.isUpdate = true;
              this.loadApproval(this.assignment.freelancer_assignment_feedback_instance_id);
            } else {
              this.isUpdate = false;
            }
            break;
          }
          default: {
            break;
          }
        }
      }
      if (this.isUpdate && this.onBehalf) {
        // preload data
        this.loadData(false);
      }
    }
  }
  /**
         * checks given answers of questionnaires,
         * set warning flag if questionnaire has a faulty answer
         */
  checkGivenAnswers() {
    if (this.onBehalf && this.surveyData && this.surveyData.type === 'questionnaire' && this.surveyData.instance) {
      this.warning = !!this.surveyData.instance.find((a: any) => a.answer === 'false');
    }
  }
  /**
         * initialize data
         * @return {boolean}
         */
  loadData(openModal: boolean) {
    let req: Observable<any> | null = null;
    if (!this.surveyData && this.assignment && this.type) {
      switch (this.type) {
        case 'questionnaire': {
          if (this.assignment.freelancer_assignment_questionnaire_instance_id) {
            if (!this.isClient && this.freelancerId) {
              req = this.surveyService.getFreelancerSurveyInstance(this.freelancerId, this.assignment.id, this.assignment.freelancer_assignment_questionnaire_instance_id);
            } else {
              req = this.surveyService.getSurveyInstance(this.assignment.freelancer_assignment_questionnaire_instance_id);
            }
          } else {
            req = this.surveyService.getQuestionnaire(this.assignment.questionnaire_id);
          }
          break;
        }
        case 'feedback': {
          console.log(this.assignment.freelancer_assignment_feedback_instance_id, 'this.assignment.freelancer_assignment_feedback_instance_id');
          if (this.assignment.freelancer_assignment_feedback_instance_id) {
            if (!this.isClient && this.freelancerId) {
              req = this.surveyService.getFreelancerSurveyInstance(!this.isClient && this.freelancerId, this.assignment.id, this.assignment.freelancer_assignment_feedback_instance_id);
            } else {
              req = this.surveyService.getSurveyInstance(this.assignment.freelancer_assignment_feedback_instance_id);
            }
          } else {
            req = of({ data: { isNew: true, type: 'feedback', feedback: this.assignment.feedback } });
          }
          break;
        }
        default: {
          break;
        }
      }
    }
    if (req) {
      req.subscribe((survey: any) => {
        if (survey && survey.data) {
          this.translateService.get('common.labels.user').subscribe(res => {
            if (survey.data.isNew && survey.data.type === 'feedback') {
              this.surveyData = survey.data;
            } else {
              this.surveyData = this.transformInstance(survey.data);
            }
            this.checkGivenAnswers();
            if (openModal) {
              let dialogRef = this.dialog.open(SurveyEditModalComponent, {
                data: {
                  freelancerId: this.freelancerId,
                  assignmentId: this.assignment.id,
                  data: this.surveyData,
                  type: this.type,
                  view: this.view
                },
                height: '70vh',
                width: '70vw'
              });
              dialogRef.afterClosed().subscribe(data => {
                if (data) {
                  this.reload.emit();
                }
              })
            }
          })
        }
      });
    } else if (this.surveyData) {
      if (openModal) {
        this.dialog.open(SurveyEditModalComponent, {
          data: {
            freelancerId: this.freelancerId,
            assignmentId: this.assignment.id,
            data: this.surveyData,
            type: this.type,
            view: this.view
          },
          height: '70vh',
          width: '70vw'
        }).afterClosed().subscribe(data => {
          if (data) {
            this.reload.emit();
          }
        })
      }
    }
  }
  loadApproval(instanceId: any) {
    if (this.assignment && (!this.surveyInstanceApproval || this.surveyInstanceApproval.survey_instance_id !== instanceId)) {
      this.surveyService.getSurveyInstanceApproval(instanceId).subscribe((approval) => {
        this.surveyInstanceApproval = approval;
        this.updated(this.surveyInstanceApproval);
      });
    }
  }
  ngOnInit(): void {
  }
  transformApproval(approval: any) {
    approval.performed_by = approval.updator && approval.updator.data.name &&
      approval.updator.data.name;
    return approval;
  }
  transformInstance(instance: any) {
    // collection.datify(instance, ['created_at', 'commented_at']);
    instance.commenter = instance.commenter && instance.commenter.data;
    instance.commenterName = instance.commenter ? this.translateService.instant('common.labels.user.' + instance.commenter.role, { name: instance.commenter[instance.commenter.role] && instance.commenter[instance.commenter.role].data.fullname }) : '';
    instance.createdAt = this.format.datetime(instance.created_at);
    instance.commentedAt = this.format.datetime(instance.commented_at);
    instance.comment = instance.comment || '';
    instance.approval = instance.approval && this.transformApproval(instance.approval.data);
    if (instance.assignments && instance.assignments.data.length) {
      // only one assignment can be connected to that instance
      const assignment = instance.assignments.data[0];
      instance.appointed_at = assignment?.date?.appointed_at;
      // collection.datify(instance, ['appointed_at']);
      instance.appointedAt = this.format.date(instance.appointed_at) || '';
      instance.jobTitle = assignment.date?.job?.title || '';
      if (assignment.freelancer_id) {
        const bookedFreelancer = assignment.freelancers && assignment.freelancers.data.find((a: any) => a.id === assignment.freelancer_id);
        instance.freelancerName = (bookedFreelancer && (bookedFreelancer.firstname + ' ' + bookedFreelancer.lastname)) || '';
      } else {
        instance.freelancerName = ''; // to avoid exception in list view
      }
    }
    return instance;
  }
  updated(data: any) {
    this.updatedSurveyInstanceApproval.emit(data);
  }
}
