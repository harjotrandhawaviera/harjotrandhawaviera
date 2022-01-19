import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AssignmentMappingService } from './../../services/mapping-services/assignment-mapping.service';
import { AssignmentService } from './../../services/assignment.service';
import { FormConfig } from '../../constant/forms.constant';
import { InvoiceService } from './../../services/invoice.service';
import { KeyValue } from '@angular/common';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-invoice-preparation-edit',
  templateUrl: './invoice-preparation-edit.component.html',
  styleUrls: ['./invoice-preparation-edit.component.scss']
})
export class InvoicePreparationEditComponent implements OnInit {
  freelancerId: any;
  assignmentId: any;
  onBehalf: { freelancer: any; user: any; } | null | undefined;
  types: string[] = [];
  templateTypes: string[] = [];
  visible = {
    questionnaire: false,
    feedback: false,
    report: false
  };
  // check list model to verify fullfillment of preparation
  checklist: { [key: string]: any } = {};
  data: any;
  incentives: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private assignmentService: AssignmentService,
    private assignmentMappingService: AssignmentMappingService,
    private invoiceService: InvoiceService,
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      if (res.id && res.freelancerId) {
        this.assignmentId = res.id;
        this.freelancerId = res.freelancerId;
        this.invoiceService.getFreelancerMasterData(this.freelancerId).subscribe(res => {
          this.onBehalf = this.userService.user().role() === 'freelancer' ? null : { freelancer: res.data.id, user: res.data };
          this.types = FormConfig.invoices.preparation.requiredDocumentTypes[this.onBehalf ? 'other' : 'freelancer'] || [];
          this.templateTypes = this.types.map((type) => {
            return 'template-' + type;
          });
          if (this.userService.user().role() === 'freelancer') {
            this.assignmentService.getFreelancerAssignment(this.userService.user().roleId(), this.assignmentId).subscribe(res => {
              console.log(res.data, 'res.data');
              this.data = this.assignmentMappingService.mapAssignmentForPreparation(res.data);
              this.init();
              this.onDataChanged();
            });
          } else {
            this.assignmentService.getAssignmentById({
              id: this.assignmentId,
              include: ['date.job.site,date.job.project.client,documents.approval.updator,tenders,freelancers.user,checkins,certificates,agent,revenues.creator,revenues.updator,questionnaire,incentive_model']
            }).subscribe(res => {
              this.data = this.assignmentMappingService.mapAssignmentForPreparation(res.data);
              this.init();
              this.onDataChanged();
            });
          }
        });
      }
    });
  }
  init() {
    // prepare incentive model data for checklist
    if (this.data) {
      this.incentives = this.data.incentive_model;// && collection.currencify(this.data.incentive_model, ['checkin', 'sales_report', 'picture_documentation']);

      this.types.forEach((type) => {
        this.data.documents[type] = this.data.documents[type] || [];
        this.data.documents[type].forEach((doc: any) => {
          doc.trackingId = this.uniqueId();
          // enabled for explicitly rejected or by invoice rejections
          doc.enabled = !doc.approval || (doc.approval.state === 'rejected' || ((!doc.pending_invoices || doc.pending_invoices.length === 0) && doc.approval.state !== 'accepted'));
        });
        if (this.data.documents[type].length === 0) {
          // add empty document on init if there are no documents yet
          this.data.documents[type].push({
            trackingId: this.uniqueId()
          });
        }
      });
      this.templateTypes.forEach((type) => {
        this.data.templates = (this.data.templates || []).concat(this.data.documents[type] || []);
      });
    }

  }
  uniqueId() {
    return Math.random().toString(36).substr(2, 10);
  }
  onDataChanged() {
    if (this.data) {
      // check state of preparation
      this.checklistState();
      // console.log(this.checklist, 'this.checklist')
      // check visibility states
      this.visible.questionnaire = this.checklist.questionnaire.available; // existing or fullfilled
      if (this.onBehalf) {
        // show all sections for agents no matter what state
        this.visible.feedback = this.checklist.feedback.available; // existing or fullfilled
        this.visible.report = true;
      } else {
        this.visible.feedback = (!this.checklist.questionnaire.available || this.checklist.questionnaire.state) && this.checklist.feedback.available; // questionnaire not existing or fullfilled , feedback existing or fullfilled
        this.visible.report = (!this.checklist.questionnaire.available || this.checklist.questionnaire.state) && (!this.checklist.feedback.available || this.data.freelancer_assignment_feedback_instance_id); // questionnaire and feedback not existing or fulfilled
      }
    }
  }
  checklistState() {
    const isValidDoc = (key: any) => {
      // document exists and not in rejected approval state
      return this.data.documents && this.data.documents[key] && this.data.documents[key][0] && this.data.documents[key][0].approval && this.data.documents[key][0].approval.state !== 'rejected';
    };
    this.checklist = {
      questionnaire: {
        available: this.data.questionnaire_id || this.data.freelancer_assignment_questionnaire_instance_id,
        state: Boolean(this.data.freelancer_assignment_questionnaire_instance_id) || isValidDoc('questionnaire')
      },
      feedback: {
        available: (this.data.feedback && this.data.feedback.length) || this.data.freelancer_assignment_feedback_instance_id,
        state: !!this.data.freelancer_assignment_feedback_instance_id && this.data.feedback_instance_approval && this.data.feedback_instance_approval.state !== 'rejected'
      },
      report: {
        available: true, // always required
        state: isValidDoc('report')
      },
      sales_report: {
        available: this.data.job.saleslots && this.data.job.saleslots.length,
        state: Boolean(this.data.revenues.data[0])
      },
      picture_documentation: {
        available: true, // always required
        state: isValidDoc('picture-documentation')
      }
    };
  }
  reload() {
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigated = false;
    this.router.navigate(['/invoices/preparation'], { skipLocationChange: true }).then(() => {
      this.router.navigate(['/invoices/preparation', this.assignmentId, this.freelancerId])
    });
  }
  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0;
  }

}
