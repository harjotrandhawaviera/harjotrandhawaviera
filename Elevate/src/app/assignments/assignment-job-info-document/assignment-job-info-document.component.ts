import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { AssignmentVM } from '../../model/assignment.model';
import { FileExportService } from '../../services/file-export.service';
import { JobVM } from '../../model/job.model';
import { PreviewDownloadPopupComponent } from '../../admin-freelancer/preview-download-popup/preview-download-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-assignment-job-info-document',
  templateUrl: './assignment-job-info-document.component.html',
  styleUrls: ['./assignment-job-info-document.component.scss'],
})
export class AssignmentJobInfoDocumentComponent implements OnInit {
  @Input() assignment: AssignmentVM | undefined | null;
  @Input() job: JobVM | undefined | null;
  @Input() mode = 'readonly';

  breifingDocs: boolean = false;
  questionnaireDocs: boolean = false;
  reportDocs: boolean = false;

  @Output() documentDeleted = new EventEmitter<number>();
  constructor(private fileExportService: FileExportService,
              private  dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.assignment && this.assignment.documents && this.assignment.documents.length) {
      this.assignment.documents.forEach((doc: any) => {
        if (doc.type === 'briefing') {
          this.breifingDocs = true;
        }
        if (doc.type === 'template-report') {
          this.reportDocs = true;
        }
        if (doc.type === 'template-questionnaire') {
          this.questionnaireDocs = true;
        }
      })
    }
  }

  ngOnInit(): void {}

  // download(document: DocumentVM) {
  //   this.fileExportService.getDownload({
  //     url: document.url || '',
  //     fileName: document.original_filename || '',
  //     mimeType: 'text/csv;charset=UTF-8',
  //   });
  // }

  download(doc: any) {
    if (doc?.mime.includes('pdf')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }
    else if (doc?.mime.includes('image')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          image: doc
        },
        disableClose: true
      });
    }
    else {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }
  }

  removeDocument(id: number) {
    this.documentDeleted.emit(id);
  }
}
