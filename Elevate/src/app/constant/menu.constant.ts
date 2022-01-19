/*
 * Default homescreen after login
 */

// config.homescreen = 'app.dashboard';
// config.onboarding = 'app.profile.start';

/*
 * Menu structure
 */
export interface IMenuConfig {
  name: string;
  icon?: string;
  permission?: string[];
  allow?: string[];
  label?: string | undefined;
  invisible?: boolean;
  path?: string;
  class?: string[];
  params?: any;
  items?: {
    name: string;
    icon?: string;
    permission?: string[];
    allow?: string[];
    label?: string | undefined;
    invisible?: boolean;
    class?: string[];
    path?: string;
    params?: any;
  }[];
}
export const MenuConfig: IMenuConfig[] = [
  {
    name: 'app.dashboard',
    path: 'dashboard',
    icon: 'fas fa-tachometer-alt',
    permission: [
      'ROLE_FREELANCER',
      'ROLE_AGENT',
      'ROLE_ADMIN',
      'ROLE_CLIENT',
      'ROLE_FIELD',
    ],
  },
  {
    name: 'app.client',
    permission: ['ROLE_ADMIN', 'ROLE_AGENT'],
    icon: 'fas fa-user-tie',
    items: [
      {
        name: 'app.client.clients',
        path: 'administration/clients',
        permission: ['ROLE_ADMIN', 'ROLE_AGENT'],
        allow: ['details', 'edit', 'list'],
      },
      {
        name: 'app.client.contacts',
        permission: ['ROLE_ADMIN', 'ROLE_AGENT'],
        allow: ['list'],
        path: '/administration/contacts',
      },
    ],
  },
  {
    name: 'app.projects',
    icon: 'far fa-clipboard',
    path: '/projects',
    permission: ['MANAGE_PROJECTS'],
    allow: ['copy', 'create', 'details', 'edit', 'list', 'bulk-job-create'],
  },
  {
    name: 'app.projects.client',
    icon: 'far fa-clipboard',
    permission: ['ROLE_CLIENT', 'ROLE_FIELD'],
    label: 'menu.projects.client',
    allow: ['list', 'details', 'bulk-job-create'],
  },
  {
    name: 'app.jobs_app.dates',
    icon: 'fas fa-briefcase',
    permission: ['MANAGE_PROJECTS'],
    items: [
      {
        name: 'app.jobs',
        label: 'menu.jobs',
        path: '/jobs',
        permission: ['MANAGE_PROJECTS'],
        allow: [
          'details',
          'create',
          'edit',
          'list',
          'tenders',
          'tenders.edit',
          'offers',
        ],
      },
      {
        name: 'app.dates',
        label: 'menu.dates',
        path: '/dates',
        permission: ['MANAGE_PROJECTS'],
        allow: ['details', 'edit', 'list'],
      },
    ],
  },
  {
    name: 'app.jobs.client',
    label: 'menu.jobs',
    icon: 'far fa-clipboard',
    path: '/jobs/client',
    permission: ['ROLE_CLIENT', 'ROLE_FIELD'],
    allow: ['list', 'create', 'details', 'tenders', 'tenders.edit'],
  },
  {
    name: 'app.assignments.client',
    label: 'menu.assignments.list',
    icon: 'far fa-calendar',
    permission: ['ROLE_CLIENT', 'ROLE_FIELD'],
    allow: ['list', 'details'],
  },
  {
    name: 'app.budgets.client',
    label: 'menu.budgets',
    icon: 'far fa-clipboard',
    permission: ['ROLE_CLIENT', 'ROLE_FIELD'],
    path: '/budgets/client',
    allow: ['list'],
  },
  {
    name: 'app.tenders',
    icon: 'far fa-calendar-check',
    permission: ['MANAGE_PROJECTS', 'ROLE_FREELANCER'],
    items: [
      {
        name: 'app.tenders',
        label: 'menu.tenders.list',
        path: '/tenders/all',
        permission: ['MANAGE_PROJECTS',],
        allow: ['details', 'edit', 'list'],
      },
      {
        name: 'app.tenders.offers',
        path: '/tenders/offers',
        permission: ['ROLE_FREELANCER'],
        allow: ['details', 'list'],
      },
      {
        name: 'app.jobs.freelancer.recommended',
        label: 'menu.freelancer_jobs.recommended',
        path: '/jobs/freelancer/recommended',
        permission: ['ROLE_FREELANCER'],
        allow: ['list', 'details'],
      },
      {
        name: 'app.jobs.freelancer.all',
        label: 'menu.freelancer_jobs.all',
        path: '/jobs/freelancer/all',
        permission: ['ROLE_FREELANCER'],
        allow: ['list', 'details'],
      },
      {
        name: 'app.tenders.offer',
        path: '/tenders/offers',
        permission: [ 'MANAGE_PROJECTS'],
        allow: ['details', 'list'],
      },
      {
        name: 'app.tenders.shortlist',
        permission: ['MANAGE_PROJECTS'],
        path: 'jobs/shortlist',
        allow: ['details', 'edit', 'list'],
      },
      {
        name: 'app.tenders.invite',
        permission: ['MANAGE_PROJECTS'],
        path: '/jobs/freelancer/invite',
        allow: ['details', 'edit', 'list'],
      },
      {
        name: 'app.jobs.freelancer.invited_jobs',
        label: 'menu.tenders.invited_jobs',
        path: '/jobs/freelancer/invite',
        permission: ['ROLE_FREELANCER'],
        allow: ['list', 'details'],
      },
    ],
  },
  // {
  //   name: 'app.message.freelancer',
  //   icon: 'far fa-calendar-check',
  //   permission: ['ROLE_FREELANCER'],
  //   path: '/my/Messages',
  //   allow: ['details', 'list'],
  // },
  {
    name: 'app.assignments.freelancer',
    icon: 'far fa-calendar-check',
    permission: ['ROLE_FREELANCER'],
    path: '/my/assignments',
    allow: ['details', 'list'],
  },
  {
    name: 'app.revenues',
    icon: 'far fa-chart-bar',
    permission: ['ROLE_CLIENT', 'ROLE_FIELD'],
  },
  {
    name: 'app.assignments',
    icon: 'far fa-calendar',
    permission: ['MANAGE_PROJECTS'],
    items: [
      {
        name: 'app.assignments',
        label: 'menu.assignments.list',
        path: '/assignments',
        permission: ['MANAGE_PROJECTS'],
        allow: ['details', 'edit', 'list'],
      },
      {
        name: 'app.client-created.assignments',
        label: 'menu.client-created.assignments',
        permission: ['MANAGE_PROJECTS'],
        path: '/client-created/assignments',
        allow: ['details', 'edit', 'list'],
      },
    ],
  },
  {
    name: 'app.operations',
    permission: ['ROLE_ADMIN', 'ROLE_AGENT'],
    icon: 'fa fa-tasks',
    items: [
      /*{
        name: 'app.operations.preDeployment',
        permission: ['MANAGE_PROJECTS'],
        allow: ['list'],
      },
      {
        name: 'app.operations.deployment',
        permission: ['MANAGE_PROJECTS'],
        allow: ['list'],
      },
      {
        name: 'app.operations.postDeployment',
        permission: ['MANAGE_PROJECTS'],
        allow: ['list'],
      },*/
      // {
      //   name: 'app.operations.performanceReview',
      //   permission: ['ROLE_AGENT', 'ROLE_ADMIN'],
      //   icon: 'far fa-quote-left',
      //   path: 'performance-review',
      // },
      {
        name: 'app.operations-checkIn',
        label: 'menu.checkins',
        path: '/checkins',
        permission: ['MANAGE_PROJECTS'],
        allow: ['list'],
      }
    ],
  },
  {
    name: 'app.messages',
    permission: ['MANAGE_PROJECTS'],
    icon: 'far fa-comments',
    items: [
      {
        name: 'app.messages.jobs',
        permission: ['MANAGE_PROJECTS'],
        allow: ['list'],
        path: '/messages/jobs',
      },
    ],
  },
  {
    name: 'app.todos',
    permission: ['ROLE_AGENT', 'ROLE_ADMIN'],
    icon: 'fas fa-tasks',
    path: 'todos',
    allow: ['list'],
  },
  {
    name: 'app.invoices',
    permission: ['ROLE_FREELANCER', 'MANAGE_INVOICES'],
    icon: 'far fa-file',
    items: [
      {
        name: 'app.invoices.preparation',
        permission: ['ROLE_FREELANCER', 'MANAGE_INVOICES'],
        allow: ['list', 'edit'],
        path: '/invoices/preparation',
      },
      {
        name: 'app.invoices.overview',
        label: 'menu.invoices.list',
        allow: ['list', 'details', 'check', 'edit'],
        permission: ['ROLE_FREELANCER', 'MANAGE_INVOICES'],
        path: '/invoices/list',
      },
      {
        name: 'app.invoices.generate',
        permission: ['ROLE_FREELANCER'],
        allow: ['job', 'details', 'general', 'confirmation'],
        path: '/invoices/generator',
      },
      {
        name: 'app.invoices.create',
        permission: ['ROLE_FREELANCER', 'MANAGE_INVOICES'],
        path: '/invoices/create',
      },
      {
        name: 'app.invoices.check',
        invisible: true,
        permission: ['MANAGE_INVOICES'],
      },
    ],
  },
  {
    name: 'app.postprocessing',
    permission: [],
    icon: 'far fa-file',
    allow: ['list', 'edit'],
  },
  {
    name: 'app.accounting',
    permission: [
      'MANAGE_INVOICES',
      'MANAGE_BILLS',
      'MANAGE_PROJECTS',
      'MANAGE_SEPA',
    ],
    icon: 'far fa-money-bill',
    path: '/accounting',
    items: [
      {
        name: 'app.accounting.bills.list',
        path: 'accounting/invoices',
        permission: ['MANAGE_BILLS', 'MANAGE_SEPA'],
      },
      {
        name: 'app.accounting.bills.preparation',
        path: 'accounting/preparation',
        permission: ['MANAGE_BILLS', 'MANAGE_SEPA'],
      },
      {
        name: 'app.accounting.files',
        path: 'accounting/file',
        permission: ['MANAGE_BILLS', 'MANAGE_SEPA'],
      },
      {
        name: 'app.accounting.export',
        path: 'accounting/export',
        permission: ['MANAGE_BILLS', 'MANAGE_SEPA'],
      },

      {
        name: 'app.accounting.bills',
        invisible: true,
        permission: ['MANAGE_BILLS', 'MANAGE_SEPA'],
      },


      {
        name: 'app.accounting.bills.edit',
        invisible: true,
        permission: ['MANAGE_BILLS', 'MANAGE_SEPA'],
      },
      {
        name: 'app.accounting.bills.details',
        invisible: true,
        permission: ['MANAGE_BILLS', 'MANAGE_SEPA'],
      },
      {
        name: 'app.revenues',
        path: 'accounting/revenues',
        permission: ['MANAGE_PROJECTS'],
      },
    ],
  },
  {
    name: 'app.profile',
    permission: ['ONBOARDING', 'ROLE_FREELANCER'],
    icon: 'far fa-user',
    allow: [
      'start',
      'results',
      'confirmation',
      'summary',
      'exam',
      'exam.description',
      'exam.questionnaire',
      'exam.result',
      'exam.summary',
    ],
    items: [
      {
        name: 'app.profile.master',
        path: 'profile/master',
        permission: ['ONBOARDING', 'ROLE_FREELANCER'],
      },
      {
        name: 'app.profile.appearance',
        path: 'profile/appearance',
        permission: ['ONBOARDING', 'ROLE_FREELANCER'],
      },
      {
        name: 'app.profile.qualifications',
        path: 'profile/qualifications',
        permission: ['ONBOARDING', 'ROLE_FREELANCER'],
      },
      {
        name: 'app.profile.employment',
        path: 'profile/employment',
        permission: ['ONBOARDING', 'ROLE_FREELANCER'],
      },
      {
        name: 'app.profile.legal',
        path: 'profile/legal',
        permission: ['ONBOARDING', 'ROLE_FREELANCER'],
      },
      {
        name: 'app.profile.training',
        permission: [],
        allow: [
          'details',
          'exam',
          'exam.description',
          'exam.questionnaire',
          'exam.result',
          'exam.summary',
        ],
      },
      {
        name: 'app.profile.terms',
        permission: [],
      },
    ],
  },
  {
    name: 'app.approvals_app.administration.freelancers',
    icon: 'far fa-user',
    permission: ['MANAGE_FREELANCERS'],
    items: [
      {
        name: 'app.administration.freelancers',
        path: 'administration/freelancers',
        label: 'menu.approvals_app.administration.freelancers.list',
        permission: ['MANAGE_FREELANCERS'],
        allow: ['details', 'edit', 'list', 'profile'],
      },
      {
        name: 'app.approval.list',
        params: { type: 'freelancer-onboarding' },
        label: 'menu.approvals_app.administration.freelancers.onboarding',
        permission: ['MANAGE_FREELANCERS'],
        path: 'approval/freelancer-onboarding',
      },
      {
        name: 'app.approval.list',
        params: {},
        label: 'menu.approvals_app.administration.freelancers.register',
        permission: ['ROLE_ADMIN'],
        path: 'approval/freelancer-approved'
      },
      {
        name: 'app.approval.list',
        label: 'menu.approvals_app.administration.freelancers.update',
        params: { type: 'freelancer-changerequest' },
        permission: ['MANAGE_FREELANCERS'],
        path: 'approval/freelancer-changerequest',
      },
      {
        name: 'app.approval.logs',
        label: 'menu.approvals_app.administration.freelancers.logs',
        permission: ['MANAGE_LOGS'],
        path: 'approval/logs',
      },
      {
        name: 'app.mails',
        permission: ['MANAGE_FREELANCERS'],
        allow: ['create'],
        path: 'mails',
      },
      {
        name: 'app.sms',
        permission: ['MANAGE_FREELANCERS'],
        allow: ['create'],
        path: 'sms',
      },
    ],
  },
  {
    name: 'app.administration',
    permission: [
      'MANAGE_CUSTOMERS',
      'MANAGE_CONTACTS',
      'MANAGE_ORDERS',
      'MANAGE_INCENTIVES',
      'MANAGE_POS',
      'MANAGE_PROJECTS',
      'MANAGE_USERS',
      'MANAGE_RIGHTS',
    ],
    icon: 'far fa-suitcase',
    items: [
      {
        name: 'app.administration.budgets',
        permission: ['MANAGE_ORDERS'],
        allow: ['details', 'create', 'edit', 'list', 'record'],
        path: '/administration/budgets',
      },
      {
        name: 'app.administration.orders',
        permission: ['MANAGE_ORDERS'],
        allow: ['details', 'edit', 'list'],
        path: '/administration/orders',
      },
      {
        name: 'app.administration.incentives',
        path: '/administration/incentives',
        permission: ['MANAGE_INCENTIVES'],
        allow: ['details', 'edit', 'list'],
      },
      // {
      //   name: 'app.administration.sites',
      //   permission: ['MANAGE_POS'],
      //   path: '/administration/sites',
      //   allow: ['details', 'edit', 'list', 'create'],
      // },
      {
        name: 'app.administration.jobs',
        permission: ['MANAGE_PROJECTS_DISABLED'],
        allow: ['details', 'edit', 'list', 'tenders', 'tenders.edit', 'offers'],
      },
      {
        name: 'app.administration.dates',
        permission: ['MANAGE_PROJECTS_DISABLED'],
        allow: ['details', 'edit', 'list'],
      },
      {
        name: 'app.administration.assignments',
        permission: ['MANAGE_PROJECTS_DISABLED'],
        allow: ['details', 'edit', 'list'],
      },
      {
        name: 'app.administration.tenders',
        permission: ['MANAGE_PROJECTS_DISABLED'],
        allow: ['details', 'edit', 'list'],
      },
      {
        name: 'app.administration.certificates',
        permission: ['MANAGE_TRAININGS'],
        allow: ['details', 'edit', 'list', 'legal'],
        path: 'administration/certificates',
      },
      {
        name: 'app.administration.users',
        path: 'administration/users',
        permission: ['MANAGE_USERS'],
        allow: ['details', 'edit', 'list', 'create'],
      },
      {
        name: 'app.administration.rights',
        path: '/administration/rights',
        permission: ['MANAGE_RIGHTS'],
      },
      {
        name: 'app.administration.gtcs',
        path: '/administration/gtcs',
        permission: ['MANAGE_GTCS'],
        allow: ['edit', 'list'],
      },
      {
        name: 'app.administration.logs',
        path: '/administration/logs',
        permission: ['MANAGE_LOGS'],
      },
      {
        name: 'app.administration.maillogs',
        path: '/administration/maillogs',
        permission: ['MANAGE_LOGS'],
      },
      // {
      //   name: 'app.administration.health-insurances',
      //   path: '/administration/insurances',
      //   permission: ['MANAGE_INSURANCES'],
      //   allow: ['details', 'edit', 'list', 'create'],
      // },
    ],
  },
  {
    name: 'app.master',
    permission: ['ROLE_ADMIN', 'ROLE_AGENT'],
    icon: 'far fa-user-cog',
    items: [
      {
        name: 'app.master.skills',
        permission: ['ROLE_ADMIN', 'ROLE_AGENT'],
        allow: ['list', 'edit'],
        path: '/master/skills',
      },
      {
        name: 'app.master.roles',
        permission: ['ROLE_ADMIN', 'ROLE_AGENT'],
        allow: ['list', 'edit'],
        path: '/master/roles',
      },
    ],
  },
  {
    name: 'app.certificates',
    permission: ['ROLE_FREELANCER'],
    icon: 'far fa-bookmark',
    items: [
      {
        name: 'app.certificates.my',
        permission: ['ROLE_FREELANCER'],
        path: 'certificates/my',
      },
      {
        name: 'app.certificates.all',
        permission: ['ROLE_FREELANCER'],
        path: 'certificates/all',
      },
      {
        name: 'app.certificates.exclusive',
        permission: ['ROLE_FREELANCER'],
        path: 'certificates/exclusive',
      },
    ],
  },
  {
    name: 'app.gallery',
    icon: 'fas fa-chart-bar',
    permission: ['ROLE_ADMIN'],
    path: 'report'
  },
  {
    name: 'app.user',
    icon: 'far fa-cog',
    permission: ['MANAGE_SETTINGS'],
    path: 'user',
  },
  {
    name: 'auth.logout',
    icon: 'fas fa-sign-out-alt',
    path: '/login',
    class: ['btn', 'btn-block', 'btn-default'],
    permission: ['ANY'],
  },
  {
    name: 'hidden',
    invisible: true,
    items: [
      { name: 'app.imprint', permission: ['ANY'] },
      { name: 'app.contact', permission: ['ANY'] },
      { name: 'app.dataprivacy', permission: ['ANY'] },
      { name: 'app.client-created', permission: ['MANAGE_PROJECTS'] },
      { name: 'app.approval.change', permission: ['MANAGE_FREELANCERS'] },
      { name: 'app.approval.profile', permission: ['MANAGE_FREELANCERS'] },
      {
        name: 'app.invoices',
        permission: ['ROLE_FREELANCER', 'MANAGE_INVOICES'],
        allow: ['details', 'edit'],
      },
      {
        name: 'app.exam',
        permission: ['ROLE_FREELANCER'],
        allow: ['description', 'questionnaire', 'result', 'summary'],
      },
      {
        name: 'app.certificates',
        permission: ['ROLE_FREELANCER'],
        allow: ['details', 'passed'],
      },
      {
        name: 'app.training',
        permission: ['ROLE_FREELANCER'],
        allow: ['details', 'passed'],
      },
      {
        name: 'app.administration.freelancers.details',
        permission: ['MANAGE_FREELANCERS', 'ROLE_CLIENT', 'ROLE_FIELD'],
      },
      {
        name: 'app.revenues',
        permission: ['MANAGE_PROJECTS', 'ROLE_CLIENT', 'ROLE_FIELD'],
        allow: ['details', 'list'],
      },
    ],
  },
];
