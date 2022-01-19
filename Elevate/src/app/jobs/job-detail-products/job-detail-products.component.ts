import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SalesSlotVM } from '../../model/client.model';

@Component({
  selector: 'app-job-detail-products',
  templateUrl: './job-detail-products.component.html',
  styleUrls: ['./job-detail-products.component.scss']
})
export class JobDetailProductsComponent implements AfterViewInit, OnChanges {

  @Input() salesSlot: SalesSlotVM[] | undefined | null;
  displayedColumns = ['name', 'price', 'description'];
  dataSource = new MatTableDataSource<SalesSlotVM>([]);
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.salesSlot) {
      if (this.salesSlot) {
        this.dataSource = new MatTableDataSource<SalesSlotVM>(this.salesSlot);
      } else {
        this.dataSource = new MatTableDataSource<SalesSlotVM>([]);
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

}
