import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guard/auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { StorageGuard } from './guard/storage.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'home',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'prefix',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'approval',
        loadChildren: () =>
          import('./approval/approval.module').then((m) => m.ApprovalModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./project/project.module').then((m) => m.ProjectModule),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'jobs',
        loadChildren: () =>
          import('./jobs/jobs.module').then((m) => m.JobsModule),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'dates',
        loadChildren: () =>
          import('./dates/dates.module').then((m) => m.DatesModule),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'assignments',
        loadChildren: () =>
          import('./assignments/assignments.module').then(
            (m) => m.AssignmentsModule
          ),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'accounting',
        loadChildren: () =>
          import('./accounting/accounting.module').then(
            (m) => m.AccountingModule
          ),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'client-created',
        loadChildren: () =>
          import('./customer-assignments/customer-assignments.module').then(
            (m) => m.CustomerAssignmentsModule
          ),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'checkins',
        loadChildren: () =>
          import('./checkins/checkins.module').then((m) => m.CheckinsModule),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'todos',
        loadChildren: () =>
          import('./todos/todos.module').then((m) => m.TodosModule),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./report-gallery/report-gallery.module').then((m) => m.ReportGalleryModule),
      },
      {
        path: 'tenders',
        loadChildren: () =>
          import('./tenders/tenders.module').then((m) => m.TendersModule),
        canActivate: [AuthGuard, StorageGuard],
      },
      {
        path: 'administration',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'clients',
            loadChildren: () =>
              import('./admin-client/admin-client.module').then(
                (m) => m.AdminClientModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'sites',
            loadChildren: () =>
              import('./administration/deployment.module').then(
                (m) => m.DeploymentModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'maillogs',
            loadChildren: () =>
              import('./maillogs/maillogs.module').then(
                (m) => m.MaillogsModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'rights',
            loadChildren: () =>
              import('./Rights/rights.module').then((m) => m.RightsModule),
            canActivate: [StorageGuard],
          },
          {
            path: 'logs',
            loadChildren: () =>
              import('./logs/logs.module').then((m) => m.LogsModule),
            canActivate: [StorageGuard],
          },
          {
            path: 'insurances',
            loadChildren: () =>
              import('./insurance/insurance.module').then(
                (m) => m.InsuranceModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'incentives',
            loadChildren: () =>
              import('./incentive/incentive.module').then(
                (m) => m.IncentiveModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'gtcs',
            loadChildren: () =>
              import('./framework-agreement/framework-agreement.module').then(
                (m) => m.FrameworkAgreementModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'contacts',
            loadChildren: () =>
              import('./admin-contact/admin-contact.module').then(
                (m) => m.AdminContactModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'users',
            loadChildren: () =>
              import('./admin-user/admin-user.module').then(
                (m) => m.AdminUserModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'freelancers',
            loadChildren: () =>
              import('./admin-freelancer/admin-freelancer.module').then(
                (m) => m.AdminFreelancerModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'certificates',
            loadChildren: () =>
              import('./admin-certificates/admin-certificates.module').then(
                (m) => m.AdminCertificatesModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'budgets',
            loadChildren: () =>
              import('./admin-budgets/admin-budgets.module').then(
                (m) => m.AdminBudgetsModule
              ),
            canActivate: [StorageGuard],
          },
          {
            path: 'orders',
            loadChildren: () =>
              import('./admin-orders/admin-orders.module').then(
                (m) => m.AdminOrdersModule
              ),
            canActivate: [StorageGuard],
          },
        ],
      },
      {
        path: 'master',
        loadChildren: () =>
          import('./master/master.module').then((m) => m.MasterModule),
      },
      {
        path: 'mails',
        loadChildren: () =>
          import('./emails/emails.module').then((m) => m.EmailsModule),
      },
      {
        path: 'sms',
        loadChildren: () =>
          import('./sms/sms.module').then((m) => m.SmsModule),
      },
      {
        path: 'certificates',
        loadChildren: () =>
          import('./certificates/certificates.module').then(
            (m) => m.CertificatesModule
          ),
      },
      {
        path: 'exam',
        loadChildren: () =>
          import('./exam/exam.module').then((m) => m.ExamModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      // {
      //   path: 'budgets',
      //   loadChildren: () =>
      //     import('./budgets/budgets.module').then((m) => m.BudgetsModule),
      //   canActivate: [StorageGuard],
      // },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./invoices/invoices.module').then((m) => m.InvoicesModule),
        canActivate: [StorageGuard],
      },
      {
        path: 'messages/jobs',
        loadChildren: () =>
          import('./news/news.module').then((m) => m.NewsModule),
        canActivate: [StorageGuard],
      },
      {
        path: 'my/assignments',
        loadChildren: () =>
          import('./freelancer-assignment/freelancer-assignment.module').then(
            (m) => m.FreelancerAssignmentModule
          ),
        canActivate: [StorageGuard],
      },
      {
        path: 'performance-review',
        loadChildren: () =>
          import('./performance-review/performance-review.module').then((m) => m.PerformanceReviewModule),
        canActivate: [AuthGuard, StorageGuard],
      },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
