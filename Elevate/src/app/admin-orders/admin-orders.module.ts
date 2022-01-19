import { AdminOrderBudgetsComponent } from './admin-order-budgets/admin-order-budgets.component';
import { AdminOrderDetailComponent } from './admin-order-detail/admin-order-detail.component';
import { AdminOrderEditComponent } from './admin-order-edit/admin-order-edit.component';
import { AdminOrderEffect } from './state/admin-order.effect';
import { AdminOrdersListComponent } from './admin-orders-list/admin-orders-list.component';
import { AdminOrdersRoutingModule } from './admin-orders-routing.module';
import { BudgetsModule } from './../budgets/budgets.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { OrderMappingService } from '../services/mapping-services/order-mapping.service';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/admin-order.reducer';

@NgModule({
  declarations: [AdminOrdersListComponent, AdminOrderEditComponent, AdminOrderDetailComponent, AdminOrderBudgetsComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    AdminOrdersRoutingModule,
    StoreModule.forFeature('admin-orders', reducer),
    EffectsModule.forFeature([AdminOrderEffect]),
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
    BudgetsModule
  ],
  providers: [OrderMappingService]
})
export class AdminOrdersModule { }
