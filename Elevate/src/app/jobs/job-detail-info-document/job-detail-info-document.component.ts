import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DocumentVM } from '../../model/document.model';
import { FileExportService } from '../../services/file-export.service';
import { JobVM } from '../../model/job.model';

@Component({
  selector: 'app-job-detail-info-document',
  templateUrl: './job-detail-info-document.component.html',
  styleUrls: ['./job-detail-info-document.component.scss'],
})
export class JobDetailInfoDocumentComponent implements OnInit {
  @Input() job: JobVM | undefined | null;
  @Input() mode = 'readonly';

  @Output() documentDeleted = new EventEmitter<number>();
  constructor(private fileExportService: FileExportService) {}

  ngOnInit(): void {}

  download(document: DocumentVM) {
    this.fileExportService.getDownload({
      url: document.url || '',
      fileName: document.original_filename || '',
      mimeType: 'text/csv;charset=UTF-8'
    });
  }

  removeDocument(id: number) {
    this.documentDeleted.emit(id);
  }
}
