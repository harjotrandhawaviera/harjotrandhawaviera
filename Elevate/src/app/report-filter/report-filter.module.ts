import { ReportFilterComponent } from './report-filter/report-filter.component';
import { ReportFilterListComponent } from './report-filter-list/report-filter-list.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ReportFilterContainerComponent } from './report-filter-container/report-filter-container.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {CoreModule} from '../core/core.module';

@NgModule({
  declarations: [ReportFilterComponent, ReportFilterContainerComponent, ReportFilterListComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        CoreModule
    ],
  exports: [
    ReportFilterContainerComponent,
    ReportFilterComponent,
    ReportFilterListComponent
  ],
  providers: []
})
export class ReportFilterModule {}
