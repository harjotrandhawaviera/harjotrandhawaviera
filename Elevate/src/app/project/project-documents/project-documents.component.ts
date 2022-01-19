import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentVM } from '../../model/document.model';
import { FileExportService } from '../../services/file-export.service';

import { ProjectDocumentVM } from './../../model/project.model';

@Component({
  selector: 'app-project-documents',
  templateUrl: './project-documents.component.html',
  styleUrls: ['./project-documents.component.scss']
})
export class ProjectDocumentsComponent implements OnInit {
  @Input()
  projectDocuments: ProjectDocumentVM[] | null = [];
  @Output()
  documentDeleted = new EventEmitter<number>();
  @Input()
  mode = 'readonly';
  constructor(private fileExportService: FileExportService) { }

  ngOnInit(): void {
  }
  removeDocument(id: number) {
    this.documentDeleted.emit(id);
  }

  download(document: DocumentVM) {
    this.fileExportService.getDownload({
      url: document.url || '',
      fileName: document.original_filename || '',
      mimeType: ''
    });
  }
}
