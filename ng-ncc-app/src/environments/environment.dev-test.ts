// DEVELOPMENT TEST site settings.

export const environment = {
    production: false,
    name: 'TEST Dev',
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
    authenticationLink: 'http://lbhwebintd01:1010',
    disable: {
        advanceSearch: true,
        authentication: false,
        consoleLogs: false,
        previousCalls: false,
        identifyCaller: false,
        additionalCallReason: false,
        commsTemplates: [
            'dd757ce7-468a-4fd1-8cb1-4315c74cfded'
        ]
    },
    previousCallCount: 50,
    notifyTemplate: {
        statement: 'dd757ce7-468a-4fd1-8cb1-4315c74cfded'
    }
};
