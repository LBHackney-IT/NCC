// LIVE TEST site settings.

export const environment = {
    production: false,
    name: 'TEST Live',
    appName: 'Hackney NCC CRM',
    api: {
        hackney: 'https://api.hackney.gov.uk',
        // hackney: 'https://sandboxapi.hackney.gov.uk/hackneyapi',
        manageATenancy: 'https://api.hackney.gov.uk/manageatenancy/v1',
        // manageATenancy: 'https://sandboxapi.hackney.gov.uk/manageatenancy/v1',
        ncc: 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/',
        notify: 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/GovNotifier'
    },
    anonymousUserID: '9078B253-15C3-E811-A96B-002248072FE8',
    authenticationLink: 'http://lbhwebintd01:3030',
    disable: {
        authentication: false,
        consoleLogs: false,
        previousCalls: true,
        identifyCaller: true,
        additionalCallReason: true
    },
    previousCallCount: 10
};
