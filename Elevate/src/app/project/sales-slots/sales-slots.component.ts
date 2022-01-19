import { AfterViewInit, Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SalesSlotVM } from '../../model/client.model';

@Component({
  selector: 'app-sales-slots',
  templateUrl: './sales-slots.component.html',
  styleUrls: ['./sales-slots.component.scss']
})
export class SalesSlotsComponent implements AfterViewInit, OnChanges {
  @Input()
  salesSlots: SalesSlotVM[] | undefined | null;
  displayedColumns = ['name', 'price', 'description'];
  dataSource = new MatTableDataSource<SalesSlotVM>([]);
  @ViewChild(MatPaginator)
  paginator?: MatPaginator;


  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.salesSlots) {
      if (this.salesSlots) {
        this.dataSource = new MatTableDataSource<SalesSlotVM>(this.salesSlots);
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
