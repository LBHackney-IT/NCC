import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
// replaces "import 'rxjs/add/operators/map'"
import { Observable, of, from } from 'rxjs';
// see https://stackoverflow.com/questions/42376972/best-way-to-import-observable-from-rxjs
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { JSONResult } from '../../interfaces/json-result.interface';

@Injectable({
    providedIn: 'root'
})

export class HackneyAPIService {

    constructor(private http: HttpClient) { }

    /**
     * Fetching a list of call types from the HackneyAPI microservice, and returning them as a formatted list.
     *
     * This version of the method makes use of a [highly touted] Observable.
     */
    getCallTypes(): Observable<LogCallType[]> {
        // Fetching a list of call types from the HackneyAPI microservice, and returning them as a formatted list.
        // https://stackoverflow.com/a/50850777/4073160
        return this.http
            .get('https://sandboxapi.hackney.gov.uk/CRMLookups?id=3')
            .pipe(
                map((response: JSONResult) => {
                    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
                    // Though the above recommends using lodash/underscore for mapping with an object, we can still do it using native JS.
                    let types = response.result;

                    // Prepare the data returned from the microservice as a list (array) of ID and label pairs.
                    let indexed_types: Array<LogCallType> = Object.keys(types).map(function(value, index) {
                        return new LogCallType(index, types[index]);
                    });

                    return indexed_types;
                })
            );
    }

    /**
     * Fetching a list of call reasons from the HackneyAPI microservice, and returning them as a formatted list.
     *
     * This method uses an Observable.
     */
    getCallReasons(): Observable<any> {
        //
        // https://stackoverflow.com/a/50850777/4073160
        return this.http
            .get('https://sandboxapi.hackney.gov.uk/CRMEnquiryTypes')
            .pipe(
                map((response: JSONResult) => {
                    let groups = {}; // groups of call reasons, indexed by call type.
                    let types = response.result;

                    Object.keys(types)
                        .map(function(key) {
                            let call_type = parseInt(types[key].enquiryCallType);
                            let reason: LogCallReason = new LogCallReason(types[key].enquiryTypeId, types[key].enquiryType);
                            if (undefined === groups[call_type]) {
                                groups[call_type] = [];
                            }
                            groups[call_type].push(reason);
                        });
                    return groups;
                })
            );
    }

}
