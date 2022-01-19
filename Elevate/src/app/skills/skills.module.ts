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
import { CategoryAddDialogComponent } from './category-add/category-add.component';
import { SkillEditComponent } from './skill-edit/skill-edit.component';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillsRoutingModule } from './skills-routing.module';
import { SkillsEffect } from './state/skills.effect';
import { reducer } from './state/skills.reducer';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SkillDetailComponent } from './skill-detail/skill-detail.component';

@NgModule({
  declarations: [
    SkillListComponent,
    SkillEditComponent,
    CategoryAddDialogComponent,
    SkillDetailComponent,
  ],
  imports: [
    CoreModule,
    MatDialogModule,
    SkillsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('skills', reducer),
    EffectsModule.forFeature([SkillsEffect]),
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
  entryComponents: [CategoryAddDialogComponent],
  providers: [OrderMappingService],
})
export class SkillsModule {}
