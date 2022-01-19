import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ConfirmBoxComponent } from './../../core/confirm-box/confirm-box.component';
import { InvoiceMappingService } from './../../services/mapping-services/invoice-mapping.service';
import { InvoiceService } from './../../services/invoice.service';
import { InvoiceVM } from './../../model/invoice.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: InvoiceVM | undefined | any;
  invoiceId: number | undefined;
  isOnBehalf = false;
  allowReset = false;
  assignmentColumns: string[] = [];
  jobId = '';
  freelancerId = '';
  assignments: any[] = [];
  disabled: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private invoiceService: InvoiceService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private invoiceMappingService: InvoiceMappingService,
    private dialog: MatDialog
  ) {
    this.isOnBehalf = this.userService.user().isAllowed('manage-invoices') && this.userService.user().role() !== 'freelancer';
    this.allowReset = this.userService.user().isAllowed('reset-invoice')
    this.assignmentColumns = this.isOnBehalf ? ['appointedAt', 'checkinStart', 'checkinEnd', 'checkinPerformer', 'wage', 'additionalCosts', 'incentiveModel', 'maxEstimatedCosts', 'freelancerCostsNet', 'taxRate', 'plannedCosts', 'assignmentBudgetCorrection', 'comment'] : ['appointedAt', 'jobname', 'sitename', 'taxRate'];

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      if (res.id) {
        this.invoiceId = res.id;
        if (this.userService.user().role() === 'freelancer' && this.userService.user().roleId()) {
          this.invoiceService.getFreelancerInvoice(this.userService.user().roleId(), {
            id: this.invoiceId,
            include: ['document,creator,approval.updator,assignments.documents.approval.updator,assignments.date.job.site,assignments.revenues,assignments.checkins.creator,assignments.incentive_model']
          }).subscribe(res => {
            this.translateService.get('invoices').subscribe(() => {
              if (res.data) {
                this.invoice = this.invoiceMappingService.invoiceResponseToVM(res.data);
                this.jobId = this.invoice.jobId;
                this.freelancerId = this.invoice.freelancer_id;
                this.initAssignment();
                this.calcDisable();
                this.onJobChange();
              }
            })
          });
        } else {
          this.invoiceService.getInvoice({
            id: this.invoiceId,
            include: ['freelancer', 'approval.updator', 'document', 'creator', 'payment_model', 'assignments.date.job.site', 'assignments.documents.approval.updator',
              'assignments.revenues.creator', 'assignments.revenues.updator', 'assignments.checkins.creator', 'assignments.incentive_model', 'assignments.questionnaire', 'assignments.questionnaire_instance', 'assignments.feedback_instance.approval']
          }).subscribe(res => {
            this.translateService.get('invoices').subscribe(() => {
              if (res.data) {
                this.invoice = this.invoiceMappingService.invoiceResponseToVM(res.data);
                this.jobId = this.invoice.jobId;
                this.freelancerId = this.invoice.freelancer_id;
                this.initAssignment();
                this.calcDisable();
                this.onJobChange();
              }
            })
          });
        }
      }
    });
  }
  calcDisable() {
    this.disabled.edit = !((this.invoice.state === 'rejected' &&
      !(this.invoice.assignments || []).some((assignment: any) => {
        return assignment.disabled;
      })) || (this.isOnBehalf && this.invoice.state === 'issued'));

    this.disabled.check = this.invoice.state !== 'issued';
    this.disabled.issued = this.userService.user().role() === 'freelancer';
  }
  reset() {
    this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'invoices.reset-state.title'
        ),
        message: this.translateService.instant('invoices.reset-state.message'),
        cancelCode: 'common.buttons.cancel',
        confirmCode: 'common.buttons.yes-reset-state',
      },
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.translateService.get('invoices.reset-state.comment').subscribe(message => {
          this.invoiceService.updateInvoiceApproval(this.invoiceId, this.invoice.approval.id, 'pending', message).subscribe(() => {
            this.router.navigate(['/invoices/check', this.invoiceId]);
            this.toastrService.success(message);
          });
        });
      }
    });

  }
  goToPreparation() { }
  check() {
    this.router.navigate(['/invoices/check', this.invoiceId]);
  }
  edit() {
    this.router.navigate(['/invoices/edit', this.invoiceId], { skipLocationChange: true });
  }
  generate() { }
  initAssignment() {
    this.invoice.assignmentIds = this.invoice.assignmentIds || [];
    // filter out included assignments which are not in current documents
    this.assignments = (this.invoice.assignments || []).filter((assignment: any) => {
      return this.invoice.assignmentIds.indexOf(assignment.id) > -1;
    });
  }
  onJobChange() {
    if (this.jobId) {
      if (this.freelancerId) {

        this.invoiceService.getFreelancerJobWithAssignments(this.freelancerId, this.jobId, true).subscribe(res => {
          const item = this.invoiceMappingService.transformJob(res.data);
          if (this.invoiceId) {
            this.assignments = this.assignments.concat(item.assignments);

            // const assignment_idCnt = this.form?.get('assignment_ids');
            // if (assignment_idCnt) {
            //   assignment_ids = assignment_idCnt.value || ;
            // }
            // vm.data.assignment_ids = vm.data.assignment_ids || vm.data.assignmentIds || [];
          } else {
            this.assignments = item.assignments;

          }
        });
      }
    }
  }
}
