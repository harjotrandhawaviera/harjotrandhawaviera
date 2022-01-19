import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FileExportService } from './../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FreelancerMappingService } from '../../services/mapping-services';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { InvoiceMappingService } from './../../services/mapping-services/invoice-mapping.service';
import { InvoiceService } from './../../services/invoice.service';
import { OptionVM } from './../../model/option.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-invoice-generator',
  templateUrl: './invoice-generator.component.html',
  styleUrls: ['./invoice-generator.component.scss']
})
export class InvoiceGeneratorComponent implements OnInit {


  freelancerId: any;
  jobList: OptionVM[] = [];
  freelancer: any;
  data: any = {};
  detailForm: FormGroup | undefined;
  validationMessages: any;
  displayMessage: any = {};
  invoiceId: any;
  invoice: any;
  assignments: any;
  currentTabIndex = 0;
  incentiveTypes: string[] = [];
  total: number = 0;
  gross_total: number = 0;
  document: any;
  get jobDetail(): FormGroup | undefined {
    return this.detailForm
      ? (this.detailForm.get('jobDetail') as FormGroup)
      : undefined;
  }
  get jobDetailDisplayMessage() {
    return this.displayMessage && this.displayMessage.jobDetail
      ? this.displayMessage.jobDetail
      : {};
  }
  get jobData() {
    return this.jobDetail && this.jobDetail.getRawValue() || {};
  }

  get assignmentDetail(): FormGroup | undefined {
    return this.detailForm
      ? this.detailForm.get('assignmentDetail') as FormGroup
      : undefined;
  }
  get assignment_details(): FormArray | undefined {
    return this.assignmentDetail
      ? this.assignmentDetail.get('assignment_details') as FormArray
      : undefined;
  }
  get assignmentDetailDisplayMessage() {
    return this.displayMessage && this.displayMessage.assignmentDetail
      ? this.displayMessage.assignmentDetail
      : {};
  }
  get assignmentDetailData() {
    return this.assignmentDetail && this.assignmentDetail.getRawValue() || {};
  }

  get generalDetail(): FormGroup | undefined {
    return this.detailForm
      ? this.detailForm.get('generalDetail') as FormGroup
      : undefined;
  }
  get generalDetailDisplayMessage() {
    return this.displayMessage && this.displayMessage.generalDetail
      ? this.displayMessage.generalDetail
      : {};
  }
  get generalDetailData() {
    return this.generalDetail && this.generalDetail.getRawValue() || {};
  }

  get formData() {
    return this.detailForm && this.detailForm.getRawValue() || {};
  }
  isGenerated = false;
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private invoiceService: InvoiceService,
    private toastrService: ToastrService,
    private fileExportService: FileExportService,
    private invoiceMappingService: InvoiceMappingService,
    private freelancerMappingService: FreelancerMappingService,
    private genericValidatorService: GenericValidatorService,
    private userService: UserService,
    private router: Router
  ) {
    this.freelancerId = this.userService.user().role() === 'freelancer' && this.userService.user().roleId()
    this.incentiveTypes = FormConfig.tenders.incentiveTypes;
  }

  ngOnInit(): void {
    this.initForm();
    this.invoiceService.getFreelancerJobsAssignments(this.freelancerId).subscribe(res => {
      this.jobList = (res.data || []).map(a => this.invoiceMappingService.transformJob(a)).map(a => {
        return {
          text: a.shortTitle,
          value: a.id
        }
      });
    });
    this.invoiceService.getFreelancerMasterData(this.freelancerId).subscribe(res => {
      this.freelancer = this.freelancerMappingService.freelancerResponseToVM(res.data);
      this.data.freelancer_address_index = 0;
    });
  }
  initForm() {
    const jobIdControl = this.fb.control('', [Validators.required]);
    const assignmentIdsControl = this.fb.control('', [Validators.required]);
    const includes_taxesControl = this.fb.control('', [Validators.required])
    this.detailForm = this.fb.group({
      jobDetail: this.fb.group({
        job_id: jobIdControl,
        assignment_ids: assignmentIdsControl
      }),
      assignmentDetail: this.fb.group({
        assignment_details: this.fb.array([])
      }),
      generalDetail: this.fb.group({
        number: this.fb.control('', [Validators.required]),
        freelancer_address_index: this.fb.control(0, [Validators.required]),
        includes_taxes: includes_taxesControl,
        with_discount: this.fb.control(false, []),
      }),
    });
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        jobDetail: {
          job_id: {
            required: this.translateService.instant('form.errors.required'),
          }
        },
        generalDetail: {
          number: {
            required: this.translateService.instant('form.errors.required'),
          },
          includes_taxes: {
            required: this.translateService.instant('form.errors.required'),
          }
        }
      }
    });
    jobIdControl.valueChanges.subscribe(res => {
      this.onJobChanged();
    });
    assignmentIdsControl.valueChanges.subscribe(res => {
      this.onAssignmentsChanged();
    });
    if (this.detailForm) {
      this.detailForm.valueChanges.subscribe((value) => {
        if (this.detailForm) {
          this.displayMessage = this.genericValidatorService.processMessages(
            this.detailForm,
            this.validationMessages
          );
        }
      });
    }
    includes_taxesControl.valueChanges.subscribe(res=>{
      this.getTotalSum();
    });
  }
  onAssignmentsChanged() {
    if (this.jobData && this.jobData.assignment_ids) {
      this.assignment_details?.clear();
      this.jobData.assignment_ids.forEach((id: any) => {
        const assignment = this.assignments.find((a: any) => a.id === id);
        if (assignment) {
          console.log(assignment, 'assignment');
          const additionals = assignment.additional_costs || [];
          const incentives = assignment.incentive_model?.data || [];
          const incentivesArray = this.fb.array([]);
          const additional_costsArray = this.fb.array([]);
          this.incentiveTypes.forEach((type: string) => {
            if (incentives && incentives[type]) {
              incentivesArray.push(this.fb.group({
                key: this.fb.control(type, []),
                value: this.fb.control(incentives[type], []),
                selected: false
              }));
            }
          });
          additionals.forEach((additional: any) => {
            additional_costsArray.push(this.fb.group({
              key: this.fb.control(additional.name, []),
              value: this.fb.control(additional.value, []),
              selected: false
            }));
          });
          const costs_on_timeValue = Math.round((assignment.min_estimated_costs || 0) * 100) / 100;
          const costs_on_time = this.fb.control(costs_on_timeValue, [])
          if (!assignment.wage || parseFloat(assignment.wage) === 0) {
            costs_on_time.disable();
          }
          const assignment_details = this.fb.group({
            id: this.fb.control(id, []),
            costs_on_time: costs_on_time,
            appointedAt: this.fb.control(assignment.appointedAt, []),
            incentives: incentivesArray,
            additional_costs: additional_costsArray,
            vat: this.fb.control(assignment.vat, []),
            sum: this.fb.control(costs_on_timeValue, []),
            taxes: this.fb.control(0, []),
          });
          assignment_details.valueChanges.subscribe(res => {
            this.getTotalSum();
          })
          this.assignment_details?.controls.push(assignment_details)
        }
      })
    }
    this.getTotalSum();
    console.log(this.assignment_details, 'this.assignmentDetail');
  }
  onJobChanged() {
    if (this.jobData && this.jobData.job_id) {
      if (this.freelancerId) {
        this.invoiceService.getFreelancerJobWithAssignments(this.freelancerId, this.jobData.job_id, true).subscribe(res => {
          const item = this.invoiceMappingService.transformJob(res.data);
          if (this.invoiceId) {
            this.assignments = this.assignments.concat(item.assignments);

            // const assignment_idCnt = this.form?.get('assignment_ids');
            // if (assignment_idCnt) {
            //   assignment_ids = assignment_idCnt.value || ;
            // }
            // vm.data.assignment_ids = vm.data.assignment_ids || vm.data.assignmentIds || [];
            if (this.assignment_details) {
              this.assignment_details.clear();
            }
          } else {
            this.assignments = item.assignments;
            if (this.jobDetail) {
              const val = this.jobDetail.getRawValue();
              this.jobDetail.patchValue({
                ...val,
                assignment_ids: [],
                with_discount: false,
                includes_taxes: undefined
              }, { emitEvent: false });
              if (this.assignment_details) {
                this.assignment_details.clear();
              }
            }
          }
        });
      }
    } else if (this.jobDetail) {
      const val = this.jobDetail.getRawValue();
      this.jobDetail.patchValue({
        ...val,
        assignment_ids: [],
        assignment_details: {},
        with_discount: false,
        includes_taxes: undefined
      }, { emitEvent: false });
    }
  }
  next() {
    this.currentTabIndex = this.currentTabIndex + 1;
  }

  getTotalSum() {
    var total = 0, taxes = 0;
    console.log(this.assignmentDetailData.assignment_details, 'this.assignmentDetailData.assignment_details')
    if (this.assignmentDetailData && this.assignmentDetailData.assignment_details) {
      const reducer = (accumulator: any, curr: any) => Number(accumulator) + Number(curr);
      (this.assignmentDetailData.assignment_details as any[]).forEach((detail: any, i: number) => {
        var ratio = detail.vat / 100;
        // calculate sum per assignment including all parts


        const sum = (detail.costs_on_time || 0) +
          [0, ...(detail.incentives || []).filter((a: any) => !!a.selected && !!a.value).map((a: any) => Number(a.value))].reduce(reducer) +
          [0, ...(detail.additional_costs || []).filter((a: any) => !!a.selected && !!a.value).map((a: any) => Number(a.value))].reduce(reducer);
        this.assignment_details?.at(i).get('sum')?.patchValue(sum, { emitEvent: false, onlySelf: true });
        const taxes = Math.round((sum * 100) * ratio);
        this.assignment_details?.at(i).get('taxes')?.patchValue(taxes, { emitEvent: false, onlySelf: true });
      });
      total = 100 * [0, ...this.assignmentDetailData.assignment_details.filter((a: any) => a.sum).map((a: any) => a.sum)].reduce(reducer);
      taxes = [0, ...this.assignmentDetailData.assignment_details.filter((a: any) => a.taxes).map((a: any) => a.taxes)].reduce(reducer);
      let gross_total = this.formData.generalDetail?.includes_taxes === 'included' ? Math.round(total + taxes) : total;
      this.gross_total = gross_total / 100;
      this.total = total / 100;
      console.log(this.total, 'this.total')
    }

    // calculate on cent base to avoid rounding issues

    // total = 100 * collection.sum(collection.values(vm.data.assignment_details), 'sum');
    // taxes = collection.sum(collection.values(vm.data.assignment_details), 'taxes');

    // var gross_total = vm.data.includes_taxes ? Math.round(total + taxes) : total;
    // vm.data.gross_total = gross_total / 100;
    // vm.data.total = total / 100;
  }
  selectedTabChange($event: any) {
    this.currentTabIndex = $event.index;
  }
  submit() {
    this.invoiceService.generateFreelancerInvoice(this.freelancerId, this.getPrepareData()).subscribe(res => {
      if (res && res.data) {
        this.document = res.data
        this.fileExportService.getDownload({
          url: res.data.url,
          fileName: res.data.original_filename,
          mimeType: res.data.mime
        });
        this.next();
      }
    });
  }
  getPrepareData() {
    const assignment_details: any[] = [];
    (this.assignmentDetailData.assignment_details as any[]).forEach((detail: any, i: number) => {
      let prepared: any = {};
      prepared.id = detail.id;
      if (parseFloat(detail.costs_on_time)) {
        prepared.costs_on_time = detail.costs_on_time;
      }
      prepared.incentives = (detail.incentives && detail.incentives.filter((a: any) => a.selected).length) ? detail.incentives.filter((a: any) => a.selected).map((a: any) => a.key) : undefined;
      prepared.additional_costs = (detail.additional_costs && detail.additional_costs.filter((a: any) => a.selected).length) ? detail.additional_costs.filter((a: any) => a.selected).map((a: any) => a.key) : undefined;
      assignment_details.push(prepared);
    });
    const obj = {
      assignment_ids: this.jobData.assignment_ids,
      job_id: this.jobData.job_id,
      with_discount: !!this.formData.with_discount,
      assignment_details: assignment_details,
      total: this.total,
      freelancer_address_index: this.formData.generalDetail?.freelancer_address_index,
      gross_total: this.gross_total,
      includes_taxes: this.formData.generalDetail?.includes_taxes === 'included',
      number: this.formData.generalDetail?.number
    };
    return obj;
  }
  restart() {
    this.router.navigate(['invoices/list'], { skipLocationChange: true }).then(() => {
      this.router.navigate(['invoices/generate'])
    });
  }
  submitInvoice() {
    // const data = {
    //   job_id: this.jobData.job_id,
    //   assignment_ids: this.jobData.assignment_ids,
    //   number: this.generalDetailData.number,
    //   with_discount: this.generalDetailData.with_discount,
    //   includes_taxes: this.generalDetailData.includes_taxes === 'included',
    //   total: this.gross_total,
    //   document: this.document
    // }
    const preparedObj = {
      id: this.invoiceId ? this.invoiceId : undefined,
      freelancerId: this.freelancerId,
      number: this.generalDetailData.number,
      total: this.gross_total,
      includes_taxes: this.generalDetailData.includes_taxes === 'included',
      assignment_ids: this.jobData.assignment_ids,
      document_id: this.document?.id,
      with_discount: this.generalDetailData.with_discount,
      issued_at: undefined
    }
    if (this.invoiceId) {
      this.invoiceService.updateFreelancerInvoice(this.invoiceId, this.freelancerId, preparedObj).subscribe((res) => {
        if (res.body?.data?.id) {
          this.toastrService.success(this.translateService.instant('notification.post.freelancers-invoices.success'));
          if (this.invoice) {
            this.invoiceService.updateInvoiceApproval(res.body.data.id, this.invoice?.approval.id, 'pending', '').subscribe(resp => {
              this.router.navigate(['invoices', res.body?.data?.id]);
            });
          } else {
            this.router.navigate(['invoices', res.body?.data?.id]);
          }
        }
      })
    } else {
      this.invoiceService.createFreelancerInvoice(this.freelancerId, preparedObj).subscribe((res => {
        if (res.body?.data?.id) {
          this.toastrService.success(this.translateService.instant('notification.post.freelancers-invoices.success'));
          if (this.invoice) {
            this.invoiceService.createInvoiceApproval(res.body.data.id, 'pending', '').subscribe(resp => {
              this.router.navigate(['invoices', res.body?.data?.id]);
            });
          } else {
            this.router.navigate(['invoices', res.body?.data?.id]);
          }
        }
      }))
    }
  }
}
