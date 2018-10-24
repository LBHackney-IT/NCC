// DEVELOPMENT TEST site settings.

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
        previousCalls: false,
        identifyCaller: false,
        additionalCallReason: false
    },
    previousCallCount: 10
};
