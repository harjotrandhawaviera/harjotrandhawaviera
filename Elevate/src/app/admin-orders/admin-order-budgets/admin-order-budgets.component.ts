import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { BudgetService } from '../../services/budget.service';
import { FileExportService } from '../../services/file-export.service';
import { FormatService } from '../../services/format.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: '[app-admin-order-budgets]',
  templateUrl: './admin-order-budgets.component.html',
  styleUrls: ['./admin-order-budgets.component.scss']
})
export class AdminOrderBudgetsComponent implements OnChanges {
  @Input()
  orderId: string = '';
  pageIndex: number | undefined = 1;
  data: any[] = [];
  loading = false;
  totalRecords = 0;
  currentPage = 1;
  displayedColumns = ['name', 'value', 'available', 'planned', 'consumed', 'count_assignments', 'creatorName'];
  constructor(
    private budgetService: BudgetService,
    private formatService: FormatService,
    private translateService: TranslateService,
    private fileExportService: FileExportService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderId) {
      this.pageIndex = 1;
      this.loadRecords();
    }
  }
  loadRecords() {
    if (this.orderId) {
      this.translateService.get('common.users.system').subscribe(() => {
        if (this.orderId) {
          this.budgetService.getBudgets({ include: ['creator'], limit: 50, page: this.pageIndex, filters: [{ key: 'order', value: this.orderId }] }).subscribe(res => {
            this.data = (res.data || []).map(budget => {
              return {
                ...budget,
                creatorName: budget.creator?.data?.name || this.translateService.instant('common.users.system')
              }
            });
            this.totalRecords = res.meta?.pagination?.total || 0;
            this.currentPage = res.meta?.pagination?.current_page ? res.meta.pagination.current_page - 1 : 0;
          });
        }
      });
    }
  }
  pageChange(event: any) {
    this.pageIndex = event.pageIndex + 1;
    this.loadRecords();
  }
  download() {
    this.translateService.get('common.users.system').subscribe(() => {
      this.translateService.get('administration.budgets.records.recordReferenceTitle').subscribe(() => {
        if (this.orderId) {
          this.budgetService.getBudgets({ include: ['creator'], limit: 1000000, page: 1, filters: [{ key: 'order', value: this.orderId }] }).subscribe(res => {
            const data = (res.data || []).map(budget => {
              return {
                ...budget,
                creatorName: budget.creator?.data?.name || this.translateService.instant('common.users.system')
              }
            });
            const fieldNames = this.displayedColumns.map((a) =>
              this.translateService.instant('administration.budgets.table.' + a)
            );
            const exportList: any = data.map((a: any) => {
              const obj: any = {};
              this.displayedColumns.forEach(x => {
                obj[x] = a[x] || '';
              });
              return obj;
            });
            this.fileExportService.downloadCSV({
              headerFields: fieldNames,
              data: exportList,
              filePrefix: 'budgets_table',
            });
          });
        }
      });
    });
  }

}
