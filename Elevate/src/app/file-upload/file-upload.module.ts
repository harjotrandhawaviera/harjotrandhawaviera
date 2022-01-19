import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { PictureUploadComponent } from './picture-upload/picture-upload.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [FileUploadComponent, PictureUploadComponent, DocumentUploadComponent],
  imports: [
    CommonModule,
    CoreModule,
    ToastrModule,
    MatButtonModule
  ],
  exports: [FileUploadComponent, PictureUploadComponent, DocumentUploadComponent],
})
export class FileUploadModule { }
