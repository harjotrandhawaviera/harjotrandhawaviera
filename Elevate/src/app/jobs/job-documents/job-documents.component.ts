import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DocumentVM } from '../../model/document.model';
import { FileExportService } from '../../services/file-export.service';
import { ProjectDocumentVM } from '../../model/project.model';

@Component({
  selector: 'app-job-documents',
  templateUrl: './job-documents.component.html',
  styleUrls: ['./job-documents.component.scss'],
})
export class JobDocumentsComponent implements OnInit {
  @Input() documents: ProjectDocumentVM[] | null = [];
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
