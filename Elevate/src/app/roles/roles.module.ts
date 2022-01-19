import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoreModule } from '../core/core.module';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { OrderMappingService } from '../services/mapping-services/order-mapping.service';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesEffect } from './state/roles.effect';
import { reducer } from './state/roles.reducer';
import { MatIconModule } from '@angular/material/icon';
import { RoleDetailComponent } from './role-detail/role-detail.component';

@NgModule({
  declarations: [
    RoleListComponent,
    RoleEditComponent,
    RoleDetailComponent
  ],
  imports: [
    CoreModule,
    RolesRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('roles', reducer),
    EffectsModule.forFeature([RolesEffect]),
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
    SearchPanelModule,
    MatIconModule,
  ],
  providers: [OrderMappingService],
})
export class RolesModule {}
