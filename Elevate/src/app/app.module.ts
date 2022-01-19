import * as fromUser from './root-state/user-state/user.reducer';

import {
   BudgetMappingService,
   CertificateMappingService,
   ClientMappingService,
   ContactMappingService,
   FreelancerMappingService,
   ProjectMappingService,
   RoleMappingService,
   SiteMappingService,
   SkillMappingService
} from './services/mapping-services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LOADING_BAR_CONFIG, LoadingBarModule } from '@ngx-loading-bar/core';
import { LOCALE_ID, NgModule } from '@angular/core';

import { ApiService } from './services/api.service';
import { AppComponent } from './app.component';
import { AppHttpErrorInterceptor } from './interceptor/http-error.interceptor';
import { AppHttpInterceptor } from './interceptor/http.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AssignmentMappingService } from './services/mapping-services/assignment-mapping.service';
import { AssignmentService } from './services/assignment.service';
import { AuthGuard } from './guard/auth.guard';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './services/auth-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BudgetService } from './services/budget.service';
import { CertificateService } from './services/certificate.service';
import { ClientService } from './services/client.service';
import { ContactService } from './services/contact.service';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatePipe } from '@angular/common';
import { DatesMappingService } from './services/mapping-services/dates-mapping.service';
import { EffectsModule } from '@ngrx/effects';
import { ExamMappingService } from './services/mapping-services/exam-mapping.service';
import { ExamService } from './services/exam.service';
import { FileExportService } from './services/file-export.service';
import { FilterService } from './services/filter.service';
import { FormatService } from './services/format.service';
import { FreelancerService } from './services/freelancer.service';
import { GenericValidatorService } from './services/generic-validator.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { JobMappingService } from './services/mapping-services/job-mapping.service';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoginGuard } from './guard/login.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MapService } from './services/map.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuModule } from './menu/menu.module';
import { NewsModule } from './news/news.module';
import { OfferMappingService } from './services/mapping-services/offer-mapping.service';
import { PrepareService } from './services/prepare.service';
import { ProjectService } from './services/project.service';
import { RevenueService } from './services/revenue.service';
import { RouteReuseStrategy } from '@angular/router';
import { SiteService } from './services/site.service';
import { SmsModule } from './sms/sms.module';
import { StorageGuard } from './guard/storage.guard';
import { StorageService } from './services/storage.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { TenderMappingService } from './services/mapping-services/tender-mapping.service';
import { ToastrModule } from 'ngx-toastr';
import { TrainingService } from './services/training.service';
import { TranslateDefaultParser } from './services/translate.parser';
import { TranslateService } from './services/translate.service';
import { UserApprovalService } from './services/user-approval.service';
import { UserRequestService } from './services/user-request.service';
import { UserService } from './services/user.service';
import { UsersService } from './services/users.service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent, MainLayoutComponent],
  entryComponents: [],
  imports: [
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({
      user: fromUser.reducer,
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'App DevTools',
      maxAge: 25,
      logOnly: environment.production,
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    AuthModule,
    MenuModule,
    DashboardModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      enableHtml: true,
      easeTime: 300,
      preventDuplicates: true,
    }),
    // for HttpClient use:
    LoadingBarHttpClientModule,

    // for Router use:
    LoadingBarRouterModule,

    // for Core use:
    LoadingBarModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatButtonModule,
    NewsModule,
    HttpClientJsonpModule,
    GoogleMapsModule,
    SmsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpErrorInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      deps: [StorageService],
      useFactory: (storageService: StorageService) => {
        const lang = storageService.get('language');
        if (lang) {
          return lang;
        } else {
          return 'de';
        }
      },
    },
    AuthService,
    AuthGuard,
    StorageGuard,
    LoginGuard,
    GenericValidatorService,
    ApiService,
    UserService,
    UsersService,
    ProjectService,
    ClientService,
    FileExportService,
    ContactService,
    SiteService,
    RevenueService,
    CertificateService,
    BudgetService,
    AssignmentService,
    FreelancerService,
    ContactMappingService,
    ClientMappingService,
    SiteMappingService,
    ProjectMappingService,
    JobMappingService,
    DatesMappingService,
    BudgetMappingService,
    AssignmentMappingService,
    CertificateMappingService,
    FreelancerMappingService,
    TenderMappingService,
    SkillMappingService,
    OfferMappingService,
    TranslateService,
    TranslateDefaultParser,
    FormatService,
    PrepareService,
    UserApprovalService,
    UserRequestService,
    ExamService,
    TrainingService,
    ExamMappingService,
    MapService,
    FilterService,
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 100 } },
    RoleMappingService,
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
