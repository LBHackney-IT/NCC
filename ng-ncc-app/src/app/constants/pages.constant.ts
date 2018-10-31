import { environment } from '../../environments/environment';

export const PAGES = {
    PREVIOUS_CALLS: { route: '/previous-calls', label: `Previous ${environment.previousCallCount} Calls` },
    LOG_CALL: { route: '/log-call', label: 'Start New Call' },
    IDENTIFY: { route: '/identify', label: 'Caller Identification' },
    ADDITIONAL_REASON: { route: '/log-additional', label: 'Additional Call Reason' },
    VIEW_NOTES: { route: '/view-notes', label: 'Caller Notes' },
    COMMS: { route: '/comms', label: 'General Communications' },
    RENT: { route: '/payment', label: 'Rent' }
};
