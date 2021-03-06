// An interface for JSON responses from the Hackney API/microservice.
export interface IHackneyAPIJSONResult {
    result?: Array<any>;
    results?: Array<any>; // we should have consistency...
}
