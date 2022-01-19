import { NgModule } from '@angular/core';
import { NewslistComponent } from './newslist/newslist.component';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { NewsRoutingModule } from './news-routing.module';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/news.reducer';
import { EffectsModule } from '@ngrx/effects';
import { NewsEffects } from './state/news.effects';
import { NewsAnswerComponent } from './news-answer/news-answer.component';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    NewslistComponent,
    NewsAnswerComponent
  ],

  imports: [
    SearchPanelModule,
    ReactiveFormsModule,
    CoreModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature(
      [NewsEffects]
    ),
    MatFormFieldModule,
    MatMenuModule,
    NewsRoutingModule,
    CommonModule,
    MatInputModule
  ]
})
export class NewsModule { }
