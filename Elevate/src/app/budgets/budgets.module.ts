import { BudgetDetailViewComponent } from './budget-detail-view/budget-detail-view.component';
import { BudgetEditComponent } from './budget-edit/budget-edit.component';
import { BudgetEffect } from './state/budget.effect';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetTileComponent } from './budget-tile/budget-tile.component';
import { BudgetsRoutingModule } from './budgets-routing.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/budget.reducer';

@NgModule({
  declarations: [BudgetTileComponent, BudgetEditComponent, BudgetDetailViewComponent, BudgetListComponent],
  imports: [
    CommonModule,
    CoreModule,
    SearchPanelModule,
    ReactiveFormsModule,
    StoreModule.forFeature('budgets', reducer),
    EffectsModule.forFeature([BudgetEffect]),
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    BudgetsRoutingModule
  ],
  exports: [BudgetTileComponent, BudgetEditComponent, BudgetDetailViewComponent],
})
export class BudgetsModule { }
