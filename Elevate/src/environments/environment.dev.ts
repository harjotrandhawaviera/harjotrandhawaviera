// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  api: 'http://52.29.76.225:90',
  // CI variables
  ref: '',
  tag: '',
  // inactivity time (in sec) for auto-refreshing (once) token
  tokenRefresh: 900,
  // maintenance reload time (in sec)
  maintenanceReload: 900,
  defaultLanguage: 'de',
  maps: {
    // api key for test env
    apiKey: '',
    apiVersion: '', // 'quarterly' on production
  },
  store: [
    {
      type: 'android',
      url: 'https://play.google.com/store/apps/details?id=com.promotionforyou.flapp',
      img: '/assets/images/store-android.png',
    },
    {
      type: 'ios',
      url: 'https://apps.apple.com/de/app/portal-p4u/id1360272703',
      img: '/assets/images/store-ios.png',
    },
  ],
  bulkJobTotal: 50,
  clientCreatedAssignments: {
    defaultStartDateFilterRange: 1,
    minJobHours: 9,
  },
  appVersion: '0.0.1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
