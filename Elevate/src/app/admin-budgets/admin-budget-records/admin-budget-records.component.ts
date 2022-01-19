import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { BudgetService } from './../../services/budget.service';
import { FileExportService } from './../../services/file-export.service';
import { FormatService } from './../../services/format.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: '[app-admin-budget-records]',
  templateUrl: './admin-budget-records.component.html',
  styleUrls: ['./admin-budget-records.component.scss']
})
export class AdminBudgetRecordsComponent implements OnChanges {
  @Input()
  budgetId: number | undefined;
  pageIndex: number | undefined = 1;
  data: any[] = [];
  loading = false;
  totalRecords = 0;
  currentPage = 1;
  displayedColumns = ['type', 'identifier', 'formattedValue', 'comment', 'creatorName', 'sourceTitle', 'referenceTitle'];
  constructor(
    private budgetService: BudgetService,
    private formatService: FormatService,
    private translateService: TranslateService,
    private fileExportService: FileExportService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.budgetId) {
      this.pageIndex = 1;
      this.loadRecords();
    }
  }
  loadRecords() {
    if (this.budgetId) {
      this.translateService.get('common.users.system').subscribe(() => {
        this.translateService.get('administration.budgets.records.recordReferenceTitle').subscribe(() => {
          if (this.budgetId) {
            this.budgetService.getRecords(this.budgetId, { include: ['creator'], limit: 50, page: this.pageIndex }).subscribe(res => {
              this.data = (res.data || []).map(record => {
                return {
                  ...record,
                  formattedValue: this.formatService.formatCurrency(record.value),
                  creatorName: record.creator?.name || this.translateService.instant('common.users.system'),
                  sourceTitle: (record.source_id && this.translateService.instant('administration.budgets.records.recordReferenceTitle', { id: record.source_id, type: record.source_type })) || '',
                  referenceTitle: (record.reference_id && this.translateService.instant('administration.budgets.records.recordReferenceTitle', { id: record.reference_id, type: record.reference_type })) || ''
                }
              });
              this.totalRecords = res.meta?.pagination?.total || 0;
              this.currentPage = res.meta?.pagination?.current_page ? res.meta.pagination.current_page - 1 : 0;
            });
          }
        });
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
        if (this.budgetId) {
          this.budgetService.getRecords(this.budgetId, { include: ['creator'], limit: 1000000, page: 1 }).subscribe(res => {
            const data = (res.data || []).map(record => {
              return {
                ...record,
                formattedValue: this.formatService.formatCurrency(record.value),
                creatorName: record.creator?.name || this.translateService.instant('common.users.system'),
                sourceTitle: (record.source_id && this.translateService.instant('administration.budgets.records.recordReferenceTitle', { id: record.source_id, type: record.source_type })) || '',
                referenceTitle: (record.reference_id && this.translateService.instant('administration.budgets.records.recordReferenceTitle', { id: record.reference_id, type: record.reference_type })) || ''
              }
            });
            const fieldNames = this.displayedColumns.map((a) =>
              this.translateService.instant('administration.budgets.records.table.' + a)
            );
            const exportList: any = data.map(a => {
              const obj: any = {};
              this.displayedColumns.forEach(x => {
                obj[x] = a[x] || '';
              });
              return obj;
            });
            this.fileExportService.downloadCSV({
              headerFields: fieldNames,
              data: exportList,
              filePrefix: 'budgets_records_table',
            });
          });
        }
      });
    });
  }
}
