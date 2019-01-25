import { IAuthentication } from './authentication';

export interface IPaymentInteraction {
    InteractionData: {
        interactionId: string,
        serviceRequestId: string;
        ticketNumber: string,
        callType: string,
        callReasonType: string;
        contactId: string;
        fullname: string
    };
    UserData: IAuthentication;
    PaymentRecorded: {
        result: {
            response: {
                message: string;
                success: boolean
            };
        };
        id: number;
        exception: string | null;
        status: number;
        isCanceled: boolean;
        isCompleted: boolean;
        isCompletedSuccessfully: boolean;
        creationOptions: number;
        asyncState: string | null;
        isFaulted: boolean
    };
}
