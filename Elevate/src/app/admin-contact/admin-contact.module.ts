import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminContactRoutingModule } from './admin-contact-routing.module';
import { CommonModule } from '@angular/common';
import { ContactEffect } from './state/contact.effect';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactTileComponent } from './contact-tile/contact-tile.component';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { SearchPanelModule } from './../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/contact.reducer';

@NgModule({
  declarations: [ContactListComponent, ContactTileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('contacts', reducer),
    EffectsModule.forFeature(
      [ContactEffect]
    ),
    AdminContactRoutingModule,
    CoreModule,
    SearchPanelModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCardModule
  ]
})
export class AdminContactModule { }
