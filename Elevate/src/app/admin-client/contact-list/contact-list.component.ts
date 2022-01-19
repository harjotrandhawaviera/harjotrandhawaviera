import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ContactVM } from './../../model/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements AfterViewInit, OnChanges {
  @Input()
  canManage: boolean | null = false;
  @Input()
  contacts: ContactVM[] | undefined | null;
  @Output() contactEdited = new EventEmitter<ContactVM>();
  @Output() contactRemoved = new EventEmitter<ContactVM>();
  @Output() download = new EventEmitter();
  displayedColumns = ['displayName', 'parent', 'position', 'department', 'email', 'phone', 'role', 'action'];
  dataSource = new MatTableDataSource<ContactVM>([]);
  @ViewChild(MatPaginator)
  paginator?: MatPaginator;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contacts) {
      if (this.contacts) {
        this.dataSource = new MatTableDataSource<ContactVM>(this.contacts);
      } else {
        this.dataSource = new MatTableDataSource<ContactVM>([]);
      }
      this.assignPaginator();
    }
  }

  ngAfterViewInit() {
    this.assignPaginator();
  }

  private assignPaginator() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  deleteRecord(contact: ContactVM) {
    this.contactRemoved.emit(contact);
  }
  editRecord(contact: ContactVM) {
    this.contactEdited.emit(contact);
  }

  downloadClick() {
    this.download.emit();
  }
}
