import { AdminBudgetDetailComponent } from './admin-budget-detail/admin-budget-detail.component';
import { AdminBudgetEditComponent } from './admin-budget-edit/admin-budget-edit.component';
import { AdminBudgetEffect } from './state/admin-budget.effect';
import { AdminBudgetListComponent } from './admin-budget-list/admin-budget-list.component';
import { AdminBudgetRecordsComponent } from './admin-budget-records/admin-budget-records.component';
import { AdminBudgetsRoutingModule } from './admin-budgets-routing.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/admin-budget.reducer';
import { AdminBudgetRecordCreateComponent } from './admin-budget-record-create/admin-budget-record-create.component';

@NgModule({
  declarations: [AdminBudgetListComponent, AdminBudgetEditComponent, AdminBudgetDetailComponent, AdminBudgetRecordsComponent, AdminBudgetRecordCreateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminBudgetsRoutingModule,
    StoreModule.forFeature('admin-budgets', reducer),
    EffectsModule.forFeature([AdminBudgetEffect]),
    CoreModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    SearchPanelModule,
    BudgetsModule,
    MatTableModule
  ]
})
export class AdminBudgetsModule { }
