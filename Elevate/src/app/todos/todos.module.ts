import { featureKey, reducer } from './+state/todos.reducers';

import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatMenuModule
} from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { TodosComponent } from './todos.component';
import { TodosEffects } from './+state/todos.effects';
import { TodosModalComponent } from './todos-modal/todos-modal.component';
import { TodosRoutingModule } from './todos-routing.module';

@NgModule({
  declarations: [TodosComponent, TodosModalComponent],
  imports: [
    CommonModule,
    TodosRoutingModule,
    SearchPanelModule,
    CoreModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([TodosEffects]),
    // _MatMenuDirectivesModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatDialogModule
  ]
})
export class TodosModule { }
