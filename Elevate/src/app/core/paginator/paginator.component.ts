import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import {
  MatPaginatorDefaultOptions,
  MatPaginatorIntl,
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  _MatPaginatorBase,
} from '@angular/material/paginator';

/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  inputs: ['disabled'],
  host: {
    class: 'app-paginator',
  },
  encapsulation: ViewEncapsulation.None,
})
export class PaginatorComponent extends _MatPaginatorBase<MatPaginatorDefaultOptions> {
  /** If set, styles the "page size" form field with the designated style. */
  _formFieldAppearance?: MatFormFieldAppearance;
  @Input()
  onlyCount = false;
  @Input()
  totalPageNumberVisible = 3;
  smallDevice: boolean = false;
  constructor(
    intl: MatPaginatorIntl,
    changeDetectorRef: ChangeDetectorRef,
    breakpointObserver: BreakpointObserver,
    @Optional()
    @Inject(MAT_PAGINATOR_DEFAULT_OPTIONS)
    defaults?: MatPaginatorDefaultOptions,

  ) {
    super(intl, changeDetectorRef, defaults);

    if (defaults && defaults.formFieldAppearance != null) {
      this._formFieldAppearance = defaults.formFieldAppearance;
    }
    breakpointObserver.observe([
      Breakpoints.XSmall
    ]).subscribe(result => {
      if (result.matches) {
        this.smallDevice = true;
      } else {
        this.smallDevice = false;
      }
    });
  }
  get lastNumberPage() {
    return this.getNumberOfPages();
  }
  get pageNumbers(): number[] {
    let number: number[] = [];
    const totalPages = this.getNumberOfPages();
    let start = 0;
    let end = 0;
    if (totalPages <= 5) {
      start = 1;
      end = totalPages;
      return this.getNumberSeq(start, end);
    }
    if (this.pageIndex < 4) {
      start = 1;
      end = this.getNumberOfPages() > 5 ? 5 : this.getNumberOfPages();
    } else if (
      this.pageIndex >= 5 &&
      this.pageIndex + 1 > this.getNumberOfPages() - 4
    ) {
      start = this.getNumberOfPages() - 4;
      end = this.getNumberOfPages();
    } else if (this.pageIndex >= 4) {
      start = this.pageIndex;
      end = this.pageIndex + 2;
    }
    if (start < 1) {
      start = 1;
    }
    if (end > this.getNumberOfPages()) {
      end = this.getNumberOfPages();
    }
    // start = this.pageIndex ? this.pageIndex : 1;
    // end = this.pageIndex ? this.pageIndex + 4 : 5;
    return this.getNumberSeq(start, end);
  }

  private getNumberSeq(start: number, end: number): any {
    return Array(end - start + 1)
      .fill(0)
      .map((_, idx) => start + idx);
  }
  goto(index: number): void {
    if (this.pageIndex !== index) {
      const previousPageIndex = this.pageIndex;
      this.pageIndex = index;
      this.page.emit({
        previousPageIndex,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        length: this.length,
      });
    }
  }
}
