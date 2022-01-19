import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GTCSDocVM, GTCSVM } from '../../model/freelancer.model';

import { FileExportService } from './../../services/file-export.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: '[app-profile-gtc-table]',
  templateUrl: './profile-gtc-table.component.html',
  styleUrls: ['./profile-gtc-table.component.scss']
})
export class ProfileGtcTableComponent implements OnInit, OnChanges {
  @Input()
  items: GTCSVM[] = [];
  @Input()
  contractType: any;
  @Input()
  documents: any;
  gtcDocs: GTCSDocVM[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['identifier', 'publishedAt', 'validAt', 'acceptedAt', 'action'];
  currentIdentifier: any = '';
  constructor(private fileExportService: FileExportService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      if (this.items) {
        this.dataSource = new MatTableDataSource<any>(this.items.filter(a => !this.contractType || a.contract_type_id === this.contractType.id));
      } else {
        this.dataSource = new MatTableDataSource<any>([]);
      }
    }
  }

  ngOnInit(): void {
  }
  detailRecord(item: any) {
    this.gtcDocs = item.documents;
    this.currentIdentifier = item.identifier;
  }
  download(item: any) {
    this.fileExportService.getDownload({ url: item.url, fileName: item.original_filename, mimeType: item.mime });
  }
}
