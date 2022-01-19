import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppCurrency} from './pipe/currency.pipe';
import {AppImageAvatar} from './pipe/img-avatar.pipe';
import {ApprovalStateComponent} from './approval-state/approval-state.component';
import {ArrayFilterPipe} from './pipe/array-filter.pipe';
import {CommonModule} from '@angular/common';
import {ConfirmBoxComponent} from './confirm-box/confirm-box.component';
import {CurrencySymbolDirective} from './directive/currency-symbol.directive';
import {DropdownMenuComponent} from './dropdown-menu/dropdown-menu.component';
import {FileSizePipe} from './pipe/file-size.pipe';
import {FormNotificationComponent} from './form-notification/form-notification.component';
import {HintComponent} from './hint/hint.component';
import {ImageAvatarDirective} from './directive/image-avatar.directive';
import {LoadHtmlComponent} from './load-html/load-html.component';
import {LoadHtmlDirective} from './directive/loadHtml.directive';
import {LogoBrandComponent} from './logo-brand/logo-brand.component';
import {LookupDisplayPipe} from './pipe/lookup-display.pipe';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MultiSelectAutoCompleteComponent} from './multi-select-auto-complete/multi-select-auto-complete.component';
import {NewlinesPipe} from './pipe/newlines.pipe';
import {NgModule} from '@angular/core';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {PaginatorComponent} from './paginator/paginator.component';
import {PasswordStrengthBarComponent} from './password-strength-bar/password-strength-bar.component';
import {ReasonBoxComponent} from './reason-box/reason-box.component';
import {RouterModule} from '@angular/router';
import {ShortMimePipe} from './pipe/short-mime.pipe';
import {SiteInfoComponent} from './site-info/site-info.component';
import {StaticAutoCompleteComponent} from './static-auto-complete/static-auto-complete.component';
import {TableSpinnerComponent} from './table-spinner/table-spinner.component';
import {TelNumberPipe} from './pipe/tel-number.pipe';
import {TranslateDirective} from './directive/translate.directive';
import {TranslatePipe} from './pipe/translate.pipe';
import {AgePipe} from './pipe/age.pipe';
import {CheckboxTreeComponent} from './checkbox-tree/checkbox-tree.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { SurveyLinkConfirmationComponent } from './survey-link-confirmation/survey-link-confirmation.component';

@NgModule({
  declarations: [
    LogoBrandComponent,
    FormNotificationComponent,
    LoadHtmlComponent,
    TableSpinnerComponent,
    DropdownMenuComponent,
    PaginatorComponent,
    ConfirmBoxComponent,
    ReasonBoxComponent,
    PageNotFoundComponent,
    StaticAutoCompleteComponent,
    AppCurrency,
    AppImageAvatar,
    ImageAvatarDirective,
    TelNumberPipe,
    NewlinesPipe,
    FileSizePipe,
    LookupDisplayPipe,
    MultiSelectAutoCompleteComponent,
    CurrencySymbolDirective,
    TranslateDirective,
    TranslatePipe,
    LoadHtmlDirective,
    ShortMimePipe,
    HintComponent,
    ArrayFilterPipe,
    PasswordStrengthBarComponent,
    ApprovalStateComponent,
    SiteInfoComponent,
    AgePipe,
    CheckboxTreeComponent,
    SurveyLinkConfirmationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTableModule,
    MatChipsModule,
    MatRadioModule,
    MatInputModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatExpansionModule,
    PdfViewerModule
  ],
  exports: [
    LogoBrandComponent,
    FormNotificationComponent,
    LoadHtmlComponent,
    TableSpinnerComponent,
    DropdownMenuComponent,
    PaginatorComponent,
    ConfirmBoxComponent,
    ReasonBoxComponent,
    StaticAutoCompleteComponent,
    AppCurrency,
    AppImageAvatar,
    ImageAvatarDirective,
    TelNumberPipe,
    NewlinesPipe,
    FileSizePipe,
    LookupDisplayPipe,
    MultiSelectAutoCompleteComponent,
    CurrencySymbolDirective,
    TranslateDirective,
    TranslatePipe,
    LoadHtmlDirective,
    ShortMimePipe,
    HintComponent,
    ArrayFilterPipe,
    PasswordStrengthBarComponent,
    ApprovalStateComponent,
    SiteInfoComponent,
    AgePipe,
    CheckboxTreeComponent
  ],
})
export class CoreModule {}
