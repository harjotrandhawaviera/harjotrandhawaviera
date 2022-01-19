import { NgModule } from '@angular/core';
import { MaillogsComponent } from './maillogs.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { MaillogsRoutingModule } from './maillogs-routing.module';
import {SearchPanelModule} from '../search-panel/search-panel.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTableModule} from '@angular/material/table';
import {StoreModule} from '@ngrx/store';
import { featureKey, reducer } from '../administration/+state/administration.reducer';
import {EffectsModule} from '@ngrx/effects';
import {AdministrationEffects} from '../administration/+state/administration.effects';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    MaillogsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaillogsRoutingModule,
    SearchPanelModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([AdministrationEffects]),
    MatIconModule,
    MatButtonModule,
  ]
})
export class MaillogsModule {}
