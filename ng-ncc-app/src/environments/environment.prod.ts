export const environment = {
    production: true,
    name: 'Live',
    appName: 'Hackney NCC CRM',
    api: {
        manageATenancy: 'https://api.hackney.gov.uk/manageatenancy/v1',
        ncc: 'https://api.hackney.gov.uk/lbhnccapi/api/',
        notify: 'https://api.hackney.gov.uk/lbhnccapi/api/GovNotifier',
        statement: 'http://secure.ncc.hackney.gov.uk:5050/CustomerTransactions'
    },
    anonymousUserID: '9078B253-15C3-E811-A96B-002248072FE8',
    nonTenantUserID: '5A668C7E-4DF9-E811-A96F-002248072FE8',
    authenticationLink: 'http://lbhwsappp01:4040',
    repairsHubLink: 'https://repairs-hub.hackney.gov.uk/properties',
    disable: {
        additionalCallReason: false,
        advanceSearch: true,
        authentication: false,
        commsTemplates: [
            '77f78f80-7e23-4500-8aec-6ed1bc9f3276'
        ],
        consoleLogs: true,
        identifyCaller: false,
        noteCloseOnSave: false,
        previousCalls: false,
        viewOnly: false
    },
    previousCallCount: 50,
    notifyTemplate: {
        statement: '77f78f80-7e23-4500-8aec-6ed1bc9f3276'
    }
};
