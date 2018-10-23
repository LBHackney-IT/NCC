// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    api: {
        hackney: 'https://sandboxapi.hackney.gov.uk/hackneyapi',
        manageATenancy: 'https://sandboxapi.hackney.gov.uk/manageatenancy/v1',
        ncc: 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/',
        notify: 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/GovNotifier'
    },
    anonymousUserID: '9078B253-15C3-E811-A96B-002248072FE8',
    disable: {
        identifyCaller: true
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
