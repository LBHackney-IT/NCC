// A basic interface for JSON responses.
export interface IJSONResponse {
    result?: Array<any>;
    results?: Array<any>; // we should have consistency...
    response?: any;
    statusCode?: number;
    value?: any;
}
