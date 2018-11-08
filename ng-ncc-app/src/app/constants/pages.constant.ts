import { environment } from '../../environments/environment';

export const PAGES = {
    PREVIOUS_CALLS: { route: 'previous-calls', label: `Previous ${environment.previousCallCount} Calls` },
    LOG_CALL: { route: 'log-call', label: 'Start New Call' },
    IDENTIFY: { route: 'identify', label: 'Caller Identification' },
    ADDITIONAL_REASON: { route: 'log-additional', label: 'Additional Call Reason' },
    VIEW_NOTES: { route: 'view-notes', label: 'Caller Notes' },
    COMMS: { route: 'comms', label: 'General Communications' },
    RENT: { route: 'payment', label: 'Rent' },
    RENT_SUMMARY: { route: 'summary', label: 'Statement' },
    RENT_TRANSACTIONS: { route: 'transactions', label: 'Transaction History' },
    RENT_PAYMENT: { route: 'make', label: 'Pay Rent' },
    RENT_COMMS: { route: 'comms', label: 'Communications' },
    EDIT_CONTACT_DETAILS: { route: 'contact-details', label: 'Edit contact details' },
    AUTHENTICATION: { route: 'auth', label: '' },
    TRANSACTION: { route: 'transaction', label: '' },
    TRANSACTION_SUCCESS: { route: 'success', label: '' },
    TRANSACTION_FAILED: { route: 'failed', label: '' },
    TRY_AGAIN: { route: 'try-again', label: '' },
    PLAYGROUND: { route: 'playground', label: '' },
};
