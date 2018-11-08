export const environment = {
    production: true,
    name: 'Live',
    appName: 'Hackney NCC CRM',
    api: {
        hackney: 'https://api.hackney.gov.uk',
        manageATenancy: 'https://api.hackney.gov.uk/manageatenancy/v1',
        ncc: 'https://api.hackney.gov.uk/lbhnccapi/api/',
        notify: 'https://api.hackney.gov.uk/lbhnccapi/api/GovNotifier'
    },
    anonymousUserID: '9078B253-15C3-E811-A96B-002248072FE8',
    authenticationLink: 'http://lbhwsappp01:4040',
    disable: {
        authentication: false,
        consoleLogs: true,
        previousCalls: true,
        identifyCaller: true,
        additionalCallReason: true
    },
    previousCallCount: 10
};
