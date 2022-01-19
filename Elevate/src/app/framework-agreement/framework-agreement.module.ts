import { NgModule } from '@angular/core';
import { FrameworkAgreementListComponent } from './framework-agreement-list/framework-agreement-list.component';
import { CoreModule } from '../core/core.module';
import {CommonModule, DatePipe} from '@angular/common';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FrameworkAgreementRoutingModule } from './framework-agreement-routing.module';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from '../administration/+state/administration.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdministrationEffects } from '../administration/+state/administration.effects';
import { ReactiveFormsModule } from '@angular/forms';
import { FrameworkAgreementEditComponent } from './framework-agreement-edit/framework-agreement-edit.component';
import { ProjectModule } from '../project/project.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { MatIconModule } from '@angular/material/icon';
import {ProfileModule} from '../profile/profile.module';

@NgModule({
  declarations: [
    FrameworkAgreementListComponent,
    FrameworkAgreementEditComponent,
  ],
    imports: [
        CoreModule,
        CommonModule,
        SearchPanelModule,
        MatSelectModule,
        MatTableModule,
        MatMenuModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FrameworkAgreementRoutingModule,
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([AdministrationEffects]),
        ReactiveFormsModule,
        ProjectModule,
        FileUploadModule,
        MatIconModule,
        ProfileModule
    ],
  providers: [MatDatepickerModule, DatePipe]
})
export class FrameworkAgreementModule {
}
