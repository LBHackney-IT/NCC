export const environment = {
    production: true,
    name: 'Live',
    appName: 'Hackney NCC CRM',
    api: {
        hackney: 'https://sandboxapi.hackney.gov.uk/hackneyapi',
        manageATenancy: 'https://api.hackney.gov.uk/manageatenancy/v1',
        ncc: 'https://api.hackney.gov.uk/lbhnccapi/api/',
        notify: 'https://api.hackney.gov.uk/lbhnccapi/api/GovNotifier',
        statement: 'http://lbhwebintd01:5050/CustomerTransactions'
    },
    anonymousUserID: '9078B253-15C3-E811-A96B-002248072FE8',
    authenticationLink: 'http://lbhwsappp01:4040',
    disable: {
        advanceSearch: true,
        authentication: false,
        consoleLogs: true,
        previousCalls: false,
        identifyCaller: false,
        additionalCallReason: false,
        commsTemplates: [
            '77f78f80-7e23-4500-8aec-6ed1bc9f3276'
        ]
    },
    previousCallCount: 50,
    notifyTemplate: {
        statement: 'dd757ce7-468a-4fd1-8cb1-4315c74cfded'
    }
};
