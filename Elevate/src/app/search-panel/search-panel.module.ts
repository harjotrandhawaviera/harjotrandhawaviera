import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchContainerComponent } from './search-container/search-container.component';
import { SearchListComponent } from './search-list/search-list.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [SearchContainerComponent, SearchPanelComponent, SearchListComponent, AdvanceSearchComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CoreModule
  ],
  exports: [SearchContainerComponent, SearchPanelComponent, SearchListComponent, AdvanceSearchComponent],
})
export class SearchPanelModule { }
