// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    name: 'Local',
    appName: 'Hackney NCC CRM',
    api: {
        hackney: 'https://sandboxapi.hackney.gov.uk/hackneyapi',
        manageATenancy: 'https://sandboxapi.hackney.gov.uk/manageatenancy/v1',
        ncc: 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/',
        notify: 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/GovNotifier',
        statement: 'http://lbhwebintd01:5050/CustomerTransactions'
    },
    anonymousUserID: '9078B253-15C3-E811-A96B-002248072FE8',
    nonTenantUserID: '5A668C7E-4DF9-E811-A96F-002248072FE8',
    authenticationLink: 'http://localhost:4200',
    disable: {
        additionalCallReason: false,
        advanceSearch: true,
        authentication: true,
        commsTemplates: [
            'dd757ce7-468a-4fd1-8cb1-4315c74cfded'
        ],
        consoleLogs: false,
        identifyCaller: false,
        noteCloseOnSave: false,
        previousCalls: false,
        viewOnly: false
    },
    previousCallCount: 50,
    notifyTemplate: {
        statement: 'dd757ce7-468a-4fd1-8cb1-4315c74cfded'
    },
    // Call Type IDs: Rent = 1 & Leasehold Services = 3
    listOfCallTypeIdsToBeSentToActionDiary: [1, 3]
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
