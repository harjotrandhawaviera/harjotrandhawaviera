import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';

@NgModule({
  declarations: [],
  imports: [CoreModule, CommonModule, MasterRoutingModule],
})
export class MasterModule {}
