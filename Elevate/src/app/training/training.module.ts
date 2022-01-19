import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrainingComponent } from './training/training.component';
import { TrainingContentComponent } from './training-content/training-content.component';

@NgModule({
  declarations: [TrainingComponent, TrainingContentComponent],
  imports: [
    CommonModule
  ],
  exports: [TrainingContentComponent]
})
export class TrainingModule { }
