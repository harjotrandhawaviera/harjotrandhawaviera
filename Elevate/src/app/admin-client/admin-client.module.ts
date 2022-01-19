import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminClientRoutingModule } from './admin-client-routing.module';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientEffect } from './state/client.effects';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientMappingService } from '../services/mapping-services/client-mapping.service';
import { CommonModule } from '@angular/common';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { SalesSlotEditComponent } from './sales-slot-edit/sales-slot-edit.component';
import { SalesSlotsComponent } from './sales-slots/sales-slots.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/client.reducer';

@NgModule({
    declarations: [ClientListComponent, ClientEditComponent, ClientDetailComponent, SalesSlotsComponent, ContactListComponent, ContactDetailComponent, SalesSlotEditComponent],
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forFeature('clients', reducer),
        EffectsModule.forFeature(
            [ClientEffect]
        ),
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressBarModule,
        AdminClientRoutingModule,
        MatRadioModule
    ],
    exports: [
        ClientEditComponent
    ],
    providers: []
})
export class AdminClientModule { }
