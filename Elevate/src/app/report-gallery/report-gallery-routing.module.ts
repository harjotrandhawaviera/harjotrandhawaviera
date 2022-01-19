import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportGalleryComponent } from './report-gallery/report-gallery.component';

const routes: Routes = [
  {
    path: '',
    component: ReportGalleryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export  class ReportGalleryRoutingModule {}
