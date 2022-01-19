import { BarRatingModule } from 'ngx-bar-rating';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { CreateEmailComponent } from './create-email/create-email.component';
import { EmailsRoutingModule } from './emails-routing.module';
import { FileUploadModule } from './../file-upload/file-upload.module';
import { MailsService } from '../services/mails.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPanelModule } from './../search-panel/search-panel.module';

@NgModule({
  declarations: [CreateEmailComponent],
  imports: [
    CommonModule,
    EmailsRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    SearchPanelModule,
    MatFormFieldModule,
    MatInputModule,
    BarRatingModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    FileUploadModule,
    MatDialogModule
  ],
  providers: [MailsService]
})
export class EmailsModule { }
