import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
// replaces "import 'rxjs/add/operators/map'"

@Injectable({
    providedIn: 'root'
})

export class HackneyAPIService {

    constructor(private http: HttpClient) { }

    /**
     * Fetching a list of call types from the HackneyAPI microservice, and returning them as a formatted list.
     *
     * This version of the method makes use of a Promise, which is what we're used to doing in AngularJS.
     */
    getCallTypes_P(): Promise {
        // https://codecraft.tv/courses/angular/http/http-with-promises/
        return new Promise((resolve, reject) => {
            this.http.get('https://sandboxapi.hackney.gov.uk/CRMLookups?id=3')
                .toPromise()
                .then(
                    res => {
                        // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
                        // Though the above recommends using lodash/underscore for mapping with an obj`ect, we can still do it using native JS.
                        let types = res.result;

                        // Prepare the data returned from the microservice as a list (array) of ID and label pairs.
                        let indexed_types = Object.keys(types).map(function(value, index) {
                            return { id: parseInt(index), label: types[index] };
                        });

                        resolve(indexed_types);
                    }
                );
        });
    }

    /**
     * Fetching a list of call types from the HackneyAPI microservice, and returning them as a formatted list.
     *
     * This version of the method makes use of a [highly touted] Observable.
     */
    getCallTypes_O(): Observable {
        // Fetching a list of call types from the HackneyAPI microservice, and returning them as a formatted list.
        // https://stackoverflow.com/a/50850777/4073160
        return this.http
            .get('https://sandboxapi.hackney.gov.uk/CRMLookups?id=3')
            .pipe(
              .map((response) => {
                    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
                    // Though the above recommends using lodash/underscore for mapping with an object, we can still do it using native JS.
                    let types = response.result;

                    // Prepare the data returned from the microservice as a list (array) of ID and label pairs.
                    let indexed_types = Object.keys(types).map(function(value, index) {
                        return { id: parseInt(index), label: types[index] };
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
    getCallReasons_O(): Observable {
        //
        // https://stackoverflow.com/a/50850777/4073160
        return this.http
            .get('https://sandboxapi.hackney.gov.uk/CRMEnquiryTypes')
            .pipe(
            .map((response) => {
                    let groups = {}; // groups of call reasons, indexed by call type.
                    let types = response.result;

                    Object.keys(types)
                        .map(function(key) {
                            let call_type = parseInt(types[key].enquiryCallType);
                            if (undefined === groups[call_type]) {
                                groups[call_type] = [];
                            }
                            groups[call_type].push({
                                id: types[key].enquiryTypeId,
                                label: types[key].enquiryType
                            });
                        });

                    return groups;
                }
                );
    }

}
