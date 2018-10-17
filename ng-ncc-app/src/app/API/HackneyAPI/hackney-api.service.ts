import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
// replaces "import 'rxjs/add/operators/map'"
import { Observable, of, from } from 'rxjs';
// see https://stackoverflow.com/questions/42376972/best-way-to-import-observable-from-rxjs
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { IHackneyAPIJSONResult } from '../../interfaces/hackney-api-json-result';
import { ICitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result';

@Injectable({
    providedIn: 'root'
})

export class HackneyAPIService {

    _url = 'https://sandboxapi.hackney.gov.uk/hackneyapi';
    // _url = 'https://api.hackney.gov.uk';
    // TODO configure the host based on the build settings.

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
            .get(`${this._url}/CRMLookups?id=3`)
            .pipe(
                map((response: IHackneyAPIJSONResult) => {
                    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
                    // Though the above recommends using lodash/underscore for mapping with an object, we can still do it using native JS.
                    const types = response.result;

                    // Prepare the data returned from the microservice as a list (array) of ID and label pairs.
                    const indexed_types: Array<LogCallType> = Object.keys(types).map(
                        // (value, index) => new LogCallType(index, types[index])
                        (value, index) => {
                            const id = parseInt(value, 10);
                            return new LogCallType(id, types[id]);
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
            .get(`${this._url}/CRMEnquiryTypes`)
            .pipe(
                map((response: IHackneyAPIJSONResult) => {
                    let groups: { [propKey: number]: any }; // groups of call reasons, indexed by call type.
                    const types = response.result;

                    groups = {};
                    Object.keys(types)
                        .map(function(key) {
                            const call_type = parseInt(types[key].enquiryCallType, 10);
                            const reason: LogCallReason = new LogCallReason(types[key].enquiryTypeId, types[key].enquiryType);
                            if (undefined === groups[call_type]) {
                                groups[call_type] = [];
                            }
                            groups[call_type].push(reason);
                        });
                    return groups;
                })
            );
    }

    /**
     * Searches for citizens and returns a list of results.
     */
    getCitizenIndexSearch(first_name: string, last_name: string, address: string, postcode: string):
        Observable<ICitizenIndexSearchResult[]> {

        // Build the query part of the URL.
        let query = '';
        if (first_name) { query += `firstname=${first_name}`; }
        if (last_name) { query += `surname=${last_name}`; }
        if (address) { query += `addressline12=${address}`; }
        if (postcode) { query += `postcode=${postcode}`; }
        query += '&IsAdvanceSearch=false';
        // very important to set IsAdvanceSearch to false.

        return this.http
            .get(`${this._url}/v1/CitizenIndexSearch?${query}`)
            .pipe(
                map((response: IHackneyAPIJSONResult) => {
                    // TODO perhaps filter out any unwanted/unnecessary information.
                    return response.results;
                })
            );
    }

}
