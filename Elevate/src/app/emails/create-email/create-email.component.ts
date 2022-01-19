import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CertificateMappingService } from './../../services/mapping-services/certificate-mapping.service';
import { CertificateService } from './../../services/certificate.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from './../../services/contract-types.service';
import { FormConfig } from '../../constant/forms.constant';
import { FreelancerService } from '../../services/freelancer.service';
import { GenericValidatorService } from './../../services/generic-validator.service';
import { MailsService } from '../../services/mails.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { ProjectService } from './../../services/project.service';
import { SearchRequestVM } from '../../model/search.model';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-create-email',
  templateUrl: './create-email.component.html',
  styleUrls: ['./create-email.component.scss']
})
export class CreateEmailComponent implements OnInit, OnDestroy {
  searchForm = new FormGroup({
    status: new FormControl([]),
    contractType: new FormControl(''),
    postcodesMin: new FormControl(''),
    postcodesMax: new FormControl(''),
    certificates: new FormControl([]),
    assignment_rating: new FormControl([]),
    project: new FormControl([]),
    assignmentStates: new FormControl(false),
    search: new FormControl(''),
  });
  detailForm?: FormGroup;
  displayMessage: any = {};
  validationMessages: any;
  showFreelancers = false;
  freelancers: any[] = [];
  contractTypeLK: OptionVM[] = [];
  stateLK: OptionVM[] = [];
  certificateLK: OptionVM[] = [];
  componentActive: boolean = true;
  selection = new SelectionModel<any>(true, []);
  projectLK: OptionVM[] = [];
  freelancerSubscribe: any;
  fromAdv: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private certificateService: CertificateService,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private genericValidatorService: GenericValidatorService,
    private certificateMappingService: CertificateMappingService,
    private freelancerService: FreelancerService,
    private toastrService: ToastrService,
    private storageService: StorageService,
    private mailsService: MailsService,
    private contractTypesService: ContractTypesService) { }

  ngOnInit(): void {
    this.loadLookups();
    this.fromAdv = this.route.snapshot.paramMap.get('fromAdv');
    this.initForm();
    if(this.fromAdv) {
      const users = this.storageService.get('usersToEmail');
      this.storageService.clear('usersToEmail');
      if(users) {
        this.freelancers = JSON.parse(users).map((freelancer: any) => {
          return {
            recipient: (freelancer.fullname || freelancer.id) + (freelancer.email ? ('<br>' + freelancer.email) : ''), // just in case, there is no fullname given....
            id: freelancer.id,
            status: freelancer.status,
            postcodes: this.transformAddress(freelancer)
          }
        });
        this.selection.clear();
        this.selection.select(...this.freelancers.map(a => a.id));
      }
    } else {
      this.searchChange();
      this.subscribeSearchChange();
    }
  }

  subscribeSearchChange() {
    ['contractType', 'status', 'postcodesMin', 'postcodesMax', 'certificates', 'assignment_rating', 'project', 'assignmentStates'].forEach(a => {
      this.searchForm.get(a)?.valueChanges.subscribe((res) => {
        this.searchChange();
      });
    })
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchChange();
      }
    });
  }
  initForm() {
    this.detailForm = this.fb.group({
      subject: this.fb.control('', [Validators.required]),
      content: this.fb.control('', [Validators.required]),
      document: this.fb.control({}, []),
    });
    this.displayMessage = {};
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        subject: {
          required: this.translateService.instant('form.errors.required'),
        },
        content: {
          required: this.translateService.instant('form.errors.required'),
        },
      };
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
    });
  }
  loadLookups() {
    this.translateService
      .get('administration.freelancers.fields.statuses')
      .subscribe((a) => {
        this.stateLK = FormConfig.mails.statuses.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'administration.freelancers.fields.statuses.' + a
            ),
          };
        });
      });
    this.contractTypesService.getContractTypeLK().subscribe((res) => {
      this.translateService.get('contracts.identifier.freelancer').subscribe(() => {
        this.contractTypeLK = this.sortOption(
          res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.id === 1 ? this.translateService.instant('contracts.identifier.freelancer') :
                  this.translateService.instant('contracts.identifier.tax_card')
              };
            })
            : []
        );
      });

    });

    this.certificateService
      .getCertificate({
        limit: 100000,
        order_by: 'name',
        only_fields: [
          'certificate.id',
          'certificate.name',
          'certificate.is_exclusive',
          'certificate.description',
          'certificate.teaser',
        ],
        filters: [{ key: 'only_enabled', value: true }],
      })
      .subscribe((res) => {
        const certificate = this.certificateMappingService.certificateMultipleResponseToVM(
          res
        );
        this.certificateLK = this.sortOption(
          (certificate && certificate.list ? certificate.list : []).map((a) => {
            return {
              value: a.id,
              text: a.name,
              info: a.description ? a.description.substring(0, 60) + '...' : '',
            };
          })
        );
      });

    this.projectService.getProjectsLK().subscribe((res) => {
      this.translateService.get('projects').subscribe((p) => {
        this.translateService.get('common').subscribe((c) => {
          this.projectLK = this.sortOption(
            res.data
              ? res.data.map((a) => {
                const info =
                  this.translateService.instant(
                    'projects.fields.category.' + a.category
                  ) +
                  '-' +
                  this.translateService.instant(
                    'projects.fields.state.' + a.state
                  ) +
                  (a.state === 'active'
                    ? ' ' +
                    this.translateService.instant('common.labels.since') +
                    ' ' +
                    a.started_at
                    : '') +
                  (a.state === 'closed'
                    ? ' ' +
                    this.translateService.instant('common.labels.since') +
                    ' ' +
                    a.finished_at
                    : '') +
                  (a.state === 'draft'
                    ? ' ' +
                    this.translateService.instant('common.labels.from') +
                    ' ' +
                    a.started_at
                    : '');
                return {
                  value: a.id,
                  text: a.name,
                  data: { clientId: a.client_id },
                  info: info,
                };
              })
              : []
          );
        });
      });
    });
  }
  searchChange() {
    this.freelancerService.SelectedUserForEmail.subscribe(data => {
      console.log(data, 'free')
    })
    this.freelancers = [];
    // this.data.recipient_ids = [];
    const searchRequestVM: SearchRequestVM = {};
    searchRequestVM.limit = 100000;
    searchRequestVM.filters = [];
    const search = this.searchForm.getRawValue();
    if (search.postcodesMin) {
      searchRequestVM.filters.push({
        key: 'zip_from',
        value: search.postcodesMin,
      });
    }
    if (search.postcodesMax) {
      searchRequestVM.filters.push({ key: 'zip_to', value: search.postcodesMax });
    }
    if (search.status && search.status.length) {
      searchRequestVM.filters.push({
        key: 'status',
        value: search.status.join(','),
      });
    }
    if (search.certificates) {
      searchRequestVM.filters.push({
        key: 'certificates',
        value: search.certificates.join(','),
      });
    }
    if (search.assignment_rating) {
      searchRequestVM.filters.push({
        key: 'assignment_rating',
        value: search.assignment_rating,
      });
    }
    if (search.freelancer_rating) {
      searchRequestVM.filters.push({
        key: 'freelancer_rating',
        value: search.freelancer_rating,
      });
    }
    if (search.contractType) {
      searchRequestVM.filters.push({
        key: 'contract_type_id',
        value: search.contractType,
      });
    }
    if (search.project) {
      searchRequestVM.filters.push({
        key: 'project',
        value: search.project.join(','),
      });
    }
    if (search.freelancer_rating) {
      searchRequestVM.filters.push({
        key: 'freelancer_rating',
        value: search.freelancer_rating,
      });
    }
    if (search.assignmentStates === true) {
      searchRequestVM.filters.push({
        key: 'only_upcoming',
        value: true,
      });
    }
    if (search.search) {
      searchRequestVM.filters.push({ key: 'search', value: search.search });
    }
    if (this.showFreelancers) {
      searchRequestVM.include = ['user'];
      searchRequestVM.only_fields = [
        'freelancer.id',
        'freelancer.fullname',
        'freelancer.zip',
        'freelancer.city',
        'freelancer.zip2',
        'freelancer.city2',
        'user.email', 'user.status'];
    } else {
      searchRequestVM.only_fields = ['freelancer.id'];
    }
    this.unsubscribeSearch();
    this.freelancerSubscribe = this.freelancerService.getFreelancers(searchRequestVM).subscribe(res => {
      this.freelancers = (res && res.data ? res && res  .data : []).map(freelancer => {
        return {
          recipient: (freelancer.fullname || freelancer.id) + (freelancer.user ? ('<br>' + freelancer.user?.data?.email) : ''), // just in case, there is no fullname given....
          id: freelancer.id,
          status: freelancer.user?.data?.status,
          postcodes: this.transformAddress(freelancer)
        }
      });
      this.selection.clear();
      this.selection.select(...this.freelancers.map(a => a.id));
    });
  }
  transformAddress(freelancer: any) {
    var address = '';
    if (freelancer.zip) {
      address += freelancer.zip;
    }
    if (freelancer.city) {
      address += (address.length ? ' ' : '') + freelancer.city;
    }
    if (freelancer.zip2) {
      address += (address.length ? '<br>' : '') + freelancer.zip2;
    }
    if (freelancer.city2) {
      address += (address.length ? (freelancer.zip2 ? ' ' : '<br>') : '') + freelancer.city2;
    }
    return address;
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  clearAssignmentRating() {
    this.searchForm.get('assignment_rating')?.patchValue(null);
  }
  unsubscribeSearch() {
    if (this.freelancerSubscribe && !this.freelancerSubscribe.closed) {
      this.freelancerSubscribe.unsubscribe();
    }
  }
  ngOnDestroy(): void {
    this.componentActive = false;
    this.unsubscribeSearch();
  }
  reset() {
    this.initForm();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.freelancers && this.freelancers.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.freelancers.forEach(row => this.selection.select(row.id));
  }
  toggleFreelancer() {
    this.showFreelancers = !this.showFreelancers;
    if (this.showFreelancers && !this.fromAdv) {
      this.searchChange();
    }
  }
  createEmail() {
    if (this.detailForm) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant('mails.send-mail.title'),
          message: this.translateService.instant('mails.send-mail.message', { count: this.selection.selected.length }),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-send-mail',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.detailForm) {
            const obj = this.detailForm.getRawValue();
            this.mailsService.create(this.selection.selected, obj.subject, obj.content, obj.document && obj.document.id).subscribe(res => {
              this.reset();
              this.toastrService.success(this.translateService.instant(
                'notification.post.mails.success'
              ));
            }, error => {
              this.toastrService.success(this.translateService.instant(
                'notification.post.mails.error'
              ));
            });
          }
        }
      })

    }
  }
}