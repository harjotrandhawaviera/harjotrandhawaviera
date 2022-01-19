import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { OnboardingMenuComponent } from './onboarding-menu/onboarding-menu.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TodosModule } from '../todos/todos.module';

@NgModule({
  declarations: [ MenuComponent, OnboardingMenuComponent ],

  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    CoreModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TodosModule
  ],
  providers: [ MatDatepickerModule ],
  exports: [ MenuComponent, OnboardingMenuComponent ],
})
export class MenuModule {}
