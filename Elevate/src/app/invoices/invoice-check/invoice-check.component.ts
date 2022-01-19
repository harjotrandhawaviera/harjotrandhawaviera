import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { InvoiceMappingService } from '../../services/mapping-services';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceVM } from '../../model/invoice.model';
import { MatDialog } from '@angular/material/dialog';
import { PrepareService } from './../../services/prepare.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-invoice-check',
  templateUrl: './invoice-check.component.html',
  styleUrls: ['./invoice-check.component.scss']
})
export class InvoiceCheckComponent implements OnInit {
  invoice: InvoiceVM | undefined | any;
  invoiceId: number | undefined;
  isOnBehalf = false;
  allowReset = false;
  assignmentColumns: string[] = [];
  jobId = '';
  freelancerId = '';
  assignments: any[] = [];
  paymentModels: any;
  paymentModel: any;
  paymentTargetOverdue: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private invoiceService: InvoiceService,
    private router: Router,
    private prepareService: PrepareService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
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
        this.invoiceService.getPaymentModels().subscribe(paymentModelRes => {
          this.paymentModels = {};
          (paymentModelRes.data || []).forEach((paymentModel) => {
            this.paymentModels[paymentModel.type] = {
              id: paymentModel.id,
              days: paymentModel.days,
              discount: paymentModel.discount
            };
          });
          this.invoiceService.getInvoice({
            id: this.invoiceId,
            include: ['freelancer', 'approval.updator', 'document', 'creator', 'payment_model', 'assignments.date.job.site', 'assignments.documents.approval.updator',
              'assignments.revenues.creator', 'assignments.revenues.updator', 'assignments.checkins.creator', 'assignments.incentive_model', 'assignments.questionnaire', 'assignments.questionnaire_instance', 'assignments.feedback_instance.approval']
          }).subscribe(res => {
            this.translateService.get('invoices').subscribe(() => {
              if (res.data) {
                this.invoice = this.invoiceMappingService.invoiceResponseToVM(res.data);
                this.invoice.total = parseFloat(this.invoice.total);
                this.invoice.initialPaymentTotal = this.invoice.total;
                this.onDiscountChange(this.invoice.with_discount);
                this.setPaymentTotal();
                this.jobId = this.invoice.jobId;
                this.freelancerId = this.invoice.freelancer_id;
                this.assignments = this.invoice.assignments;
                // this.initAssignment();
                // this.onJobChange();
              }
            })
          });
        });

      }
    });
  }
  onDiscountChange(curr: any) {
    this.paymentModel = curr === true ? this.paymentModels.discount : this.paymentModels.default;
    var now = new Date();
    var paymentTarget = moment(this.invoice.issued_at).add(this.paymentModel.days, 'days');
    this.paymentTargetOverdue = paymentTarget.isBefore(now);
    this.invoice.payment_target = this.paymentTargetOverdue ? now : paymentTarget.toDate();
    this.setPaymentTotal();
  }
  setPaymentTotal() {
    // var initial = vm.data.initialPaymentTotal;
    // // for taxes net value must be calculated
    // var base = vm.data.includes_taxes ? initial / (1 + (config.invoiceTax / 100)) : initial;
    // var discount = base * vm.paymentModel.discount / 100;
    // var tax = vm.data.includes_taxes ? (base - discount) * config.invoiceTax / 100 : 0;
    // vm.data.payment_total = Math.round((base - discount + tax) * 100) / 100;
    // vm.paymentTotalNet = vm.data.includes_taxes ? Math.round((base - discount) * 100) / 100 : undefined;
    var base = this.invoice.total;
    var discount = base * this.paymentModel.discount / 100;
    this.invoice.payment_total = Math.round((base - discount) * 100) / 100;
  }
  /**
       * Check if all invoice documents are approved
       *
       * @returns {boolean}
       */
  get approvable() {
    if (this.invoice) {
      var questionnaire = this.invoice.additional.questionnaire || [];
      var report = this.invoice.additional.report || [];
      var pictures = this.invoice.additional['picture-documentation'] || [];
      // check questionnaires only if available, check pictures only if available
      const result = (!questionnaire.length || questionnaire.every(this.approved)) &&
        (!pictures.length || pictures.every(this.approved)) &&
        (report.length && report.every(this.approved)) &&
        (this.assignments || []).every(this.feedbackApproved);
      return result;
    } else {
      return false;
    }

  }
  approved(doc: any) {
    return doc && doc.approval && doc.approval.state === 'accepted';
  }
  feedbackApproved(assignment: any) {
    return assignment && (!assignment.feedbackApproval || (assignment.feedbackApproval && assignment.feedbackApproval.approval && assignment.feedbackApproval.approval.state === 'accepted'));
  }
  approve() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'invoices.check.approve.title'
        ),
        message: this.translateService.instant('invoices.check.approve.message', { payment_total: this.invoice.payment_total }),
        cancelCode: 'common.buttons.cancel',
        confirmCode: 'common.buttons.yes-approve',
      },
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.submit('accepted', '')
      }
    });
  }
  reject() {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'invoices.check.reject.title'
        ),
        message: this.translateService.instant(
          'invoices.check.reject.message'
        ),
        label: this.translateService.instant('invoices.check.reject.placeholder'),
        cancelCode: 'common.buttons.cancel',
        confirmCode: 'common.buttons.yes-reject',
        needReason: true
      },
    }).afterClosed().subscribe(res => {
      if (res && res.reason) {
        this.submit('rejected', res.reason);
      }
    });

  }
  approvalChanged(doc: any) {
    return doc && doc.approval && doc.approval.changed;
  }
  submit(state: string, comment: string) {
    var data = { ...this.invoice };
    let req: any = [];
    this.assignments.map((item) => {
      return item.feedbackApproval;
    }).filter(this.approvalChanged).forEach((item) => {
      req.push(this.invoiceService.updateSurveyInstanceApproval(item.approval.survey_instance_id, item.approval.id, item.approval));
    });
    var docApprovals = [];
    var docs = (data.additional.questionnaire || []).concat(data.additional.report || []).concat(data.additional['picture-documentation'] || []);
    docs.filter(this.approvalChanged).forEach((doc: any) => {
      docApprovals.push(doc.approval);
      req.push(this.invoiceService.updateDocumentApproval(doc.approval.document_id, doc.approval.id, doc.approval));
    });
    if (req.length === 0) {
      req.push(of(null));
    }
    forkJoin(req).subscribe(res => {
      var invoice = { ...data, ...{ payment_model_id: this.paymentModel?.id, approvalState: state } };
      if (state === 'accepted') {
        const preparedObj = {
          id: invoice.id,
          freelancerId: this.freelancerId,
          number: invoice.number,
          comment: invoice.comment,
          total: invoice.total,
          includes_taxes: invoice.includes_taxes,
          assignment_ids: invoice.assignment_ids,
          document_id: invoice.document?.id,
          with_discount: invoice.with_discount,
          payment_model_id: invoice.payment_model_id,
          payment_comment: invoice.payment_comment,
          payment_total: invoice.payment_total,
          issued_at: invoice.issued_at ? this.prepareService.datetime(invoice.issued_at) : undefined,
          payment_target: invoice.payment_target && invoice.payment_target.setHours(0, 0, 0) && this.prepareService.datetime(invoice.payment_target)
        }
        console.log(preparedObj, 'preparedObj');
        this.invoiceService.updateInvoice(invoice.id, preparedObj).subscribe(res => {
          this.invoiceApproval(invoice, state, comment);
        });
      } else {
        this.invoiceApproval(invoice, state, comment);
      }
      // return $q.when(state === 'accepted' ? invoicesService.submit(invoice) : invoice)
      //   .then(function () {
      //     return invoicesService.invoiceApproval(invoice, state, comment || null);
      //   })
      //   .then(function () {
      //     // now reject also connected invoices if some report was rejected
      //     return invoicesService.rejectConnectedInvoices(data);
      //   })
      //   .then(function () {
      //     $state.go('^.details', $stateParams, { reload: true });
      //   });
    })
    // return invoicesService.feedbackApprovals(angular.copy(vm.assignments)).then(function () {
    //   return invoicesService.docApprovals(data).then(function () {
    //     var invoice = angular.extend(data, { payment_model_id: vm.paymentModel.id, approvalState: state });
    //     return $q.when(state === 'accepted' ? invoicesService.submit(invoice) : invoice)
    //       .then(function () {
    //         return invoicesService.invoiceApproval(invoice, state, comment || null);
    //       })
    //       .then(function () {
    //         // now reject also connected invoices if some report was rejected
    //         return invoicesService.rejectConnectedInvoices(data);
    //       })
    //       .then(function () {
    //         $state.go('^.details', $stateParams, { reload: true });
    //       });
    //   });
    // });
  }

  private invoiceApproval(invoice: any, state: string, comment: string) {
    if (invoice.approval && invoice.approval.id) {
      this.invoiceService.updateInvoiceApproval(invoice.id, invoice.approval.id, state, comment).subscribe(() => {
        this.toastrService.success(this.translateService.instant('notification.post.invoices-approvals.success'));
        this.router.navigate(['/invoices', this.invoiceId]);
      });
    } else {
      this.invoiceService.createInvoiceApproval(invoice.id, state, comment).subscribe(() => {
        this.toastrService.success(this.translateService.instant('notification.post.invoices-approvals.success'));
        this.router.navigate(['/invoices', this.invoiceId]);
      });
    }
  }
}
