/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ContractTypesVM, FreelancerVM } from '../../model/freelancer.model';
import { FormArray, FormControl } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ContractTypeResponse } from '../../model/contract-type.response';
import { DocumentResponse } from '../../model/document.response';
import { FileExportService } from './../../services/file-export.service';
import { FreelancerMappingService } from './../../services/mapping-services/freelancer-mapping.service';
import { FreelancerService } from './../../services/freelancer.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileGtcDocumentsModalComponent } from './../profile-gtc-documents-modal/profile-gtc-documents-modal.component';
import { SingleResponse } from '../../model/response';
import { UserService } from './../../services/user.service';
import { environment } from './../../../environments/environment';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-profile-gtc-documents',
  templateUrl: './profile-gtc-documents.component.html',
  styleUrls: ['./profile-gtc-documents.component.scss']
})
export class ProfileGtcDocumentsComponent implements OnInit, OnChanges {
  @Input()
  contractType: ContractTypeResponse | undefined;
  @Input()
  data: any;
  @Input()
  readonly = false;
  @Input()
  displayMessage: any;
  // get freelancer_documents() {
  //   return this.gtcForm ? this.gtcForm.get('freelancer_documents') as FormArray : undefined;
  // }
  @Output() gtcUpdated = new EventEmitter<any>();
  @Output() definitionUpdated = new EventEmitter<any>();
  definition: any;
  currentGtc: any;
  inreview = false;
  isOnboarding = false;
  isAgentReview = false;
  isReconfirmation = false;
  isReconfirmationReview = false;
  profileView = 'set';
  freelancerGtcDocs: any;
  gtcDocs: any;
  constructor(
    private freelancerService: FreelancerService,
    private freelancerMappingService: FreelancerMappingService,
    private userService: UserService,
    public dialog: MatDialog,
    private fileExportService: FileExportService
  ) { }
  ngOnChanges(_changes: SimpleChanges): void {
    if (this.contractType && this.contractType.id && this.data && this.data.id) {
      const flContract = (this.data.contract_types || []).find((a: ContractTypesVM) => this.contractType && a.id === this.contractType.id);
      this.isOnboarding = !flContract || (flContract && !flContract.is_approved);
      const requests = (this.data.requests || []).filter((a: any) => a.type === 'freelancer-changerequest') || [];
      // check if agents wants to review current or upcoming gtc
      const agentReviewCurrent = this.isAgentReview && this.data.user && this.data.user.gtc_blocked;
      const request = [];
      if (this.userService.user().is('freelancer') && !this.userService.user().onboarding()) {
        request.push(this.freelancerService.getFreelancerGtcCurrent({ freelancerId: this.userService.user().roleId(), contractTypeId: this.contractType.id }));
      } else {
        request.push(of({}));
      }
      const current = this.isOnboarding || agentReviewCurrent;
      if (current) {
        request.push(this.freelancerService.getGtcCurrent({ contractTypeId: this.contractType.id }));
      } else {
        request.push(of({}));
      }
      const isUpcoming = !(!current && this.userService.user().is('freelancer') && this.userService.user().isGtcBlocked(this.contractType.identifier));
      if (isUpcoming) {
        request.push(this.freelancerService.getGtcUpcoming({ contractTypeId: this.contractType.id }));
      } else {
        request.push(this.freelancerService.getGtcCurrent({ contractTypeId: this.contractType.id }));
      }
      forkJoin(request.map(a => a.pipe(catchError(_error => of({}))))).subscribe((res: any) => {
        const gtc = {
          approved: this.transformGtc(res[0] && res[0].data),
          current: this.transformGtc(res[1] && res[1].data),
          upcoming: res[2] && res[2].data
        };
        this.definition = (this.isOnboarding || agentReviewCurrent) ? gtc.current :
          (this.isAgentReview || this.userService.user().is('freelancer')) && gtc.upcoming && (gtc.upcoming.id !== (gtc.approved && gtc.approved.id)) && gtc.upcoming;
        this.currentGtc = this.definition;
        this.inreview = this.definition && this.definition.id && requests.find((a: any) => a.params && a.params.gtc_id === this.definition.id);
        this.gtcDocs = JSON.parse(JSON.stringify(this.data.gtcsDoc1 ? { ...this.data.gtcsDoc1 } : {}));
        this.gtcUpdated.emit(this.gtcDocs);
        this.definitionUpdated.emit(this.definition);
        this.initializeFreelancerGtcDocuments();
        // this.patchFreelancerDocument();
      });

    }
  }

  /**
   * initializes freelancer gtc documents according to gtc's documents
   */
  initializeFreelancerGtcDocuments() {
    this.isReconfirmation = false;
    // initialize only if some gtc should be shown
    if (this.data && JSON.stringify(this.data) !== JSON.stringify({})) {
      // initialize only if some gtc should be shown
      if (this.definition) {
        // some gtc needs to be accepted, initial freelancer gtc documents
        if (!this.gtcDocs) {
          this.gtcDocs = {};
          this.gtcUpdated.emit(this.gtcDocs);
        }
        this.definition.documents.forEach((template: any) => {
          if (!this.gtcDocs[template.id]) {
            switch (template.confirmation_type) {
              case 'checked': {
                this.gtcDocs[template.id] = {
                  gtc_document_id: template.id,
                  is_checked: undefined,
                  contract_type_identifier: template.contract_type_identifier
                };
                break;
              }
              case 'upload-signed': {
                this.gtcDocs[template.id] = {
                  gtc_document_id: template.id,
                  is_checked: false,
                  freelancer_documents: new Array(1),
                  contract_type_identifier: template.contract_type_identifier
                };
                break;
              }
              default: {
                // no initial confirmation.... set it to checked, although nothing will be visible for user
                this.gtcDocs[template.id] = {
                  gtc_document_id: template.id,
                  is_checked: true,
                  contract_type_identifier: template.contract_type_identifier
                };
              }
            }
          }
        });
        // hold copy of array, to be passed to gtc table
        this.freelancerGtcDocs = { ...this.gtcDocs };
        this.gtcUpdated.emit(this.gtcDocs);
        // this.patchFreelancerDocument();
        // $anchorScroll($location.hash());
      } else if (!this.isOnboarding) {

        // hold copy of array, to be passed to gtc table
        // gtc already accepted, but
        // check for reconfirmations....
        this.freelancerGtcDocs = { ...this.gtcDocs };
        this.freelancerService.getFreelancerGtcDocuments({ freelancerId: this.data.id, include: 'freelancer_documents' }).subscribe((docs: any) => {
          const docsArr: any[] = [];
          const requests = (this.data.requests || []).filter((a: any) => a.type === 'freelancer-changerequest') || [];

          const reqs: Observable<SingleResponse<DocumentResponse>>[] = [];
          docs.data.forEach((doc: any) => {
            const request = requests.find((a: any) => a.params && a.params.gtc_document_id === doc.id);
            doc.inReview = request;

            if (this.contractType && doc.contract_type_identifier === this.contractType.identifier) {
              if (!doc.inReview) {
                // clear data for reconfirmation
                doc.is_checked = false;
                doc.freelancer_documents = new Array(1);
              } else if (request.params && request.params.document_id) {
                // Save the document (in pending) which already waits for an approval
                reqs.push(this.freelancerService.getDocument(request.params.document_id));
                this.isReconfirmationReview = true;
              }

              // fake gtc document settings, so overwrite initial state for
              // reconfirmation
              docsArr.push({
                name: doc.name,
                description: doc.description,
                confirmation_type: (doc.is_checked === false && doc.is_approved === false) ? doc.confirmation_type : doc.reconfirmation_type,
                type: doc.type,
                id: doc.gtc_document_id,
                order_index: doc.order_index,
                document: {
                  data: { url: doc.url, original_filename: doc.original_filename }
                }
              });
            }
          });
          this.definition = {
            documents: docsArr
          };
          // this.patchFreelancerDocument();
          forkJoin(reqs).subscribe((resp) => {
            docs.data.forEach((doc: any) => {
              doc.pending = resp.find(a => a.data && a.data.id == doc.id);
            });
            this.gtcDocs = docs.data;
            this.gtcUpdated.emit(this.gtcDocs);
          });
          this.definitionUpdated.emit(this.definition);
          this.isReconfirmation = docsArr.length > 0;
          // this.patchFreelancerDocument();
        });

      }
    }
  }
  transformGtc(item: any) {
    return item && {
      ...item,
      // single document not used anymore
      documents: item.documents && item.documents.data.map((doc: any) => ({
          ...doc, url: doc.url || `${environment.api}/documents/${doc.id}`,
          originalFilename: doc.original_filename || null,
          saved: true
        })),
      // gtc will contain a collection of documents
      // documents: item.documents && item.documents.data.map(documents.transform),
      publishedDate: item.published_at,
      validDate: item.valid_at,
      identifier: item.contract_type.data.identifier
    };
  }
  ngOnInit(): void {
  }
  onAction(template: any) {
    switch (template.confirmation_type) {
      case 'upload-signed': {
        if (template.document.data) {
          const doc = template.document.data;
          this.fileExportService.getDownload({ url: doc.url, fileName: doc.original_filename, mimeType: doc.mime });
        }
        break;
      }
      case 'checked': {
        const dialogRef = this.dialog.open(ProfileGtcDocumentsModalComponent, {
          data: {
            gtcDoc: template,
            pdfUrl: template.document.data.url
          },
          height: '80vh',
          width: '80vw'
        });
        dialogRef.afterClosed().subscribe(res => {
          this.gtcDocs[template.id].is_checked = res;
          this.gtcUpdated.emit(this.gtcDocs);
          if (res) {
            if (this.isReconfirmation && res) {
              // instantly submit reconfirmation....
              this.submitReconfirmation(template.id);
            }
          }
        });
        break;
      }
      default:
        break;
    }
  }
  submitReconfirmation(gtcDocumentId: number) {
    const data: any = {};
    // just submit this single document
    data[gtcDocumentId] = { ...this.gtcDocs[gtcDocumentId] };

    if (JSON.stringify(data), JSON.stringify({})) {
      return;
    }
    const multiDocReq: any[] = [];
    const multiDocReqIds: any[] = [];
    // handle multidoc requests
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const gtcDoc = data[key];
        if (gtcDoc.freelancer_documents && gtcDoc.freelancer_documents.length && gtcDoc.freelancer_documents[0]) {
          // should only be one....
          gtcDoc.freelancer_documents.forEach((item: any, index: number) => {
            let req;
            if (!item.id && item.is_collection && item.documents && item.documents.length > 0) {
              req = this.freelancerService.createDocument(item.documents.map((doc: any) => doc.id));
            }
            multiDocReq.push(req);
            multiDocReqIds.push(key + '_' + index);
          });
        }
      }
    }
    forkJoin(multiDocReq).subscribe((res: any) => {
      if (res) {
        multiDocReqIds.forEach((type, idex) => {
          if (res) {
            const gtcDocId = type.split('_')[0];
            const index = type.split('_')[1];
            data[gtcDocId].freelancer_documents[index] = res[idex].data ? this.freelancerMappingService.transformDocument(res[idex].data, false) : res[idex];
          }
        });

      }
      this.freelancerService.updateFreelancerGtcDocuments({ id: gtcDocumentId, documentRequest: this.freelancerMappingService.prepareFreelancerGtcDocuments(data) }).subscribe();
    });
  }
  documentUpdated(data: any, templateId: any, index: number) {
    if (!this.gtcDocs[templateId].freelancer_documents[index]) {
      this.gtcDocs[templateId].freelancer_documents[index] = {};
    }
    if (!this.gtcDocs[templateId].freelancer_documents[index].document) {
      this.gtcDocs[templateId].freelancer_documents[index].document = {};
    }
    if (!this.gtcDocs[templateId].freelancer_documents[index].document.documents) {
      this.gtcDocs[templateId].freelancer_documents[index].document.documents = [];
    }
    this.gtcDocs[templateId].freelancer_documents[index].document.documents = data.documents;
    this.gtcDocs[templateId].freelancer_documents[index].document.document_ids = data.documents.map((a: any) => a.id);
    this.gtcDocs[templateId].freelancer_documents[index].document.id = data.id;
    this.gtcUpdated.emit(this.gtcDocs);
  }
}
