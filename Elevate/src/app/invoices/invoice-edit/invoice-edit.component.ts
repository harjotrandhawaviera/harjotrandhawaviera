import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ConfirmBoxComponent } from './../../core/confirm-box/confirm-box.component';
import { FormatService } from './../../services/format.service';
import { FreelancerService } from '../../services/freelancer.service';
import { GenericValidatorService } from '../../services/generic-validator.service';
import { HintComponent } from '../../core/hint/hint.component';
import { InvoiceMappingService } from './../../services/mapping-services/invoice-mapping.service';
import { InvoiceService } from './../../services/invoice.service';
import { InvoiceVM } from './../../model/invoice.model';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { PrepareService } from '../../services/prepare.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit {
  mode = '';
  form: FormGroup | undefined;
  displayMessage: any = {};
  validationMessages: any;
  invoiceId: any;
  isOnBehalf = false;
  freelancerId: number | string | undefined;
  prevJobId: number | string | undefined;
  jobId: number | string | undefined;
  invoice: InvoiceVM | undefined;
  freelancerList: OptionVM[] = [];
  jobList: OptionVM[] = [];
  onBehalf: { freelancer: any; user: any; } | undefined;
  assignments: any[] = [];
  assignmentColumns: string[] = [];
  selection = new SelectionModel<any>(true, []);
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private invoiceService: InvoiceService,
    private invoiceMappingService: InvoiceMappingService,
    private toastrService: ToastrService,
    private userService: UserService,
    private genericValidatorService: GenericValidatorService,
    private freelancerService: FreelancerService,
    private formatService: FormatService,
    private prepareService: PrepareService,
    public dialog: MatDialog,
    private el: ElementRef
  ) {
    this.isOnBehalf = this.userService.user().isAllowed('manage-invoices') && this.userService.user().role() !== 'freelancer';
    this.assignmentColumns = this.isOnBehalf ? ['select', 'appointedAt', 'checkinStart', 'checkinEnd', 'checkinPerformer', 'wage', 'additionalCosts', 'incentiveModel', 'maxEstimatedCosts', 'freelancerCostsNet', 'taxRate', 'plannedCosts', 'assignmentBudgetCorrection', 'comment'] : ['select', 'appointedAt', 'jobname', 'sitename', 'taxRate'];
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      if (res.id) {
        this.mode = 'edit';
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
                this.initForm();
                // this.onJobChanged();
                // this.onFreelancerChanged();
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
                this.initForm();
                // this.onJobChanged();
                // this.onFreelancerChanged();
              }
            })
          });
        }
        // this.budgetService.getBudgetById({
        //   id: res.id,
        //   include: ['client,contacts,order.budget,creator'],
        // }).subscribe(budgetResponse => {
        //   if (budgetResponse.data) {
        //     this.budget = this.budgetMappingService.budgetResponseToVM(budgetResponse.data);
        //     this.initForm();
        //   }
        // });
      } else {
        this.mode = 'create';
        this.initForm();
      }
    });
  }
  initAssignment() {
    if (this.invoice) {
      if ((!this.invoiceId || (this.invoice && this.invoice.state !== 'rejected'))) {
        this.invoice.issued_at = moment(this.invoice.issued_at).toDate();
      } else {
        this.invoice.issued_at = new Date();
      }
      this.invoice.assignmentIds = this.invoice.assignmentIds || [];
      // filter out included assignments which are not in current documents
      this.assignments = (this.invoice.assignments || []).filter((assignment: any) => {
        return this.invoice && this.invoice.assignmentIds && this.invoice.assignmentIds.indexOf(assignment.id) > -1;
      });
    }
  }
  initForm() {
    this.loadLookup();
    if (this.invoice) {
      this.selection.clear();
      this.invoice.assignmentIds?.forEach(x => {
        this.selection.select(x);
      });
      this.form = new FormGroup({
        freelancerId: new FormControl(this.invoice.freelancer_id, [Validators.required]),
        jobId: new FormControl(this.invoice.jobId, [Validators.required]),
        number: new FormControl(this.invoice.number, [Validators.required]),
        issued_at: new FormControl(this.invoice.issued_at, [Validators.required]),
        total: new FormControl(this.invoice.total, [Validators.required]),
        includes_taxes: new FormControl(this.invoice.includes_taxes ? 'included' : 'not-included', [Validators.required]),
        with_discount: new FormControl(this.invoice.with_discount, []),
        comment: new FormControl(this.invoice.comment, []),
        document: new FormControl(this.invoice.document, [Validators.required]),
        assignment_ids: new FormControl(this.invoice.assignmentIds, []),
      });
    } else {
      this.form = new FormGroup({
        freelancerId: new FormControl(this.freelancerId || '', [Validators.required]),
        jobId: new FormControl('', [Validators.required]),
        number: new FormControl('', [Validators.required]),
        issued_at: new FormControl('', [Validators.required]),
        total: new FormControl('', [Validators.required]),
        includes_taxes: new FormControl('', [Validators.required]),
        with_discount: new FormControl(false, []),
        comment: new FormControl('', []),
        document: new FormControl('', [Validators.required]),
        assignment_ids: new FormControl([], []),
      });
    }

    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        freelancerId: {
          required: this.translateService.instant('form.errors.required')
        },
        jobId: {
          required: this.translateService.instant('form.errors.required')
        },
        number: {
          required: this.translateService.instant('form.errors.required')
        },
        issued_at: {
          required: this.translateService.instant('form.errors.required')
        },
        includes_taxes: {
          required: this.translateService.instant('form.errors.required')
        },
        document: {
          required: this.translateService.instant('form.errors.required')
        },
        total: {
          required: this.translateService.instant('form.errors.required'),
          currency: this.translateService.instant('form.errors.currencyformat')
        },
        assignment_ids: {
          required: this.translateService.instant('form.errors.required')
        }
      };
    });
    this.selection.changed.subscribe(res => {
      this.form?.get('assignment_ids')?.patchValue(res.source.selected);
    });
    this.form.get('freelancerId')?.valueChanges.subscribe(res => {
      console.log('Hiiii')
      this.freelancerId = res;
      this.onFreelancerChanged();
    });
    this.form.get('jobId')?.valueChanges.subscribe(res => {
      this.prevJobId = this.jobId;
      this.jobId = res;
      this.onJobChanged();
    });
    if (this.form) {
      this.form.valueChanges.subscribe((value) => {
        if (this.form) {
          this.displayMessage = this.genericValidatorService.processMessages(
            this.form,
            this.validationMessages
          );
        }
      });
    }
  }
  onJobChanged() {
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
            if (this.jobId !== this.prevJobId && this.form) {
              const val = this.form.getRawValue();
              this.form.patchValue({
                ...val, assignment_ids: [],
                issued_at: new Date(),
                with_discount: false
              }, { emitEvent: false });
              // if (vm.form && vm.form.$resetForm) {
              //   vm.form.$resetForm();
              // }
            }
          }
        });
      }
    } else if (this.form) {
      const val = this.form.getRawValue();
      this.form.patchValue({
        ...val, assignment_ids: [],
        issued_at: new Date(),
        with_discount: false
      }, { emitEvent: false });
    }
  }
  onFreelancerChanged() {
    if (this.freelancerId) {
      this.invoiceService.getFreelancerJobsAssignments(this.freelancerId).subscribe(res => {
        this.jobList = (res.data || []).map(a => this.invoiceMappingService.transformJob(a)).map(a => {
          return {
            text: this.isOnBehalf ? a.title : a.shortTitle,
            value: a.id
          }
        });
      });
      if (this.isOnBehalf) {
        this.invoiceService.getFreelancerMasterData(this.freelancerId).subscribe((res) => {
          this.onBehalf = { freelancer: res.data.id, user: res.data };
          // data.id = data.user.data.id; // assign user id as id
        });
      }
    }
  }
  loadLookup() {
    if (this.userService.user().role() === 'freelancer') {
      this.freelancerId = this.userService.user().roleId();
      this.onFreelancerChanged();
    } else if (this.invoice && this.invoice.id) {
      this.freelancerId = this.invoice.freelancer_id;
    } else {
      // new invoice
      // get list of freelancers
      this.freelancerService
        .getFreelancers({
          limit: 1000000,
          only_fields: ['freelancer.id,freelancer.lastname,freelancer.firstname,freelancer.zip,freelancer.city,user.id,user.status'],
          filters: [{ key: 'only_approved', value: true }]
        })
        .subscribe((res) => {
          this.freelancerList = this.sortOption(res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.lastname + ' ' + a.firstname,
                info: a.zip + ' ' + a.city,
              };
            })
            : []);
        });
    }
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text.toString().toUpperCase() > b.text.toString().toUpperCase() ? 1 : b.text.toString().toUpperCase() > a.text.toString().toUpperCase() ? -1 : 0) : 0
    );
  }
  openHint(template: string) {
    this.dialog.open(HintComponent, {
      data: {
        template: template
      }
    })
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
  cancelEdit() {
    if (this.mode === 'edit') {
      this.router.navigate(['/invoices', this.invoiceId])
    } else {
      this.router.navigate(['/invoices/list'])
    }
  }
  saveInvoice() {
    this.form?.markAllAsTouched();
    if (this.form && this.form.valid) {
      this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'invoices.submit.title'
          ),
          message: this.translateService.instant(
            'invoices.submit.message'
          ),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-submit',
        },
      }).afterClosed().subscribe(res => {
        if (res && this.form) {
          const formValue = this.form.getRawValue();
          if (this.freelancerId) {
            const preparedObj = {
              id: this.invoiceId ? this.invoiceId : undefined,
              freelancerId: formValue.freelancerId,
              number: formValue.number,
              comment: formValue.comment,
              total: formValue.total,
              includes_taxes: formValue.includes_taxes === 'included',
              assignment_ids: formValue.assignment_ids,
              document_id: formValue.document?.id,
              with_discount: formValue.with_discount,
              issued_at: formValue.issued_at ? this.prepareService.datetime(formValue.issued_at) : undefined
            }
            if (this.userService.user().role() === 'freelancer') {
              preparedObj.issued_at = undefined;
            }
            if (this.invoiceId) {
              this.invoiceService.updateFreelancerInvoice(this.invoiceId, this.freelancerId, preparedObj).subscribe((res => {
                if (res.body?.data?.id) {
                  this.toastrService.success(this.translateService.instant('notification.post.freelancers-invoices.success'));
                  this.invoiceService.updateInvoiceApproval(res.body.data.id, this.invoice?.approval.id, 'pending', preparedObj.comment).subscribe(resp => {
                    if (resp.body && resp.body.data && resp.body.data.invoice && resp.body.data.invoice.data.state === 'issued' && this.isOnBehalf) {
                      this.router.navigate(['invoices/check', res.body?.data?.id]);
                    } else {
                      this.router.navigate(['invoices', res.body?.data?.id]);
                    }
                  }, error => {
                    this.router.navigate(['invoices', res.body?.data?.id]);
                  });
                }
              }))
            } else {
              this.invoiceService.createFreelancerInvoice(this.freelancerId, preparedObj).subscribe((res => {
                if (res.body?.data?.id) {
                  this.toastrService.success(this.translateService.instant('notification.post.freelancers-invoices.success'));
                  this.invoiceService.createInvoiceApproval(res.body.data.id, 'pending', preparedObj.comment).subscribe(resp => {
                    if (resp.body && resp.body.data && resp.body.data.invoice && resp.body.data.invoice.data.state === 'issued' && this.isOnBehalf) {
                      this.router.navigate(['invoices/check', res.body?.data?.id]);
                    } else {
                      this.router.navigate(['invoices', res.body?.data?.id]);
                    }
                  }, error => {
                    this.router.navigate(['invoices', res.body?.data?.id]);
                  });
                }
              }))
            }
          }
        }
      })

    } else if (this.form) {
      this.displayMessage = this.genericValidatorService.processMessages(
        this.form,
        this.validationMessages
      );
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]'
          );
          if (invalidControl) {
            invalidControl.focus();
          }
          break;
        }
      }
    }
  }
}
