import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserMappingService } from '../admin-user/services/user-mapping.service';
import { UserPersonalComponent } from './user-personal/user-personal.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [UserProfileComponent, UserPersonalComponent],
  imports: [
    CommonModule,
    CoreModule,
    UserRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [UserMappingService]
})
export class UserModule { }
