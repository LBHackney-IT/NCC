import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HackneyAPIService {

  constructor(private http: HttpClient) { }

  getCallTypes(): Promise {
      // https://codecraft.tv/courses/angular/http/http-with-promises/
      return new Promise((resolve, reject) => {
          this.http.get('https://sandboxapi.hackney.gov.uk/CRMLookups?id=3')
            .toPromise()
            .then(
                res => {
                    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
                    // Though the above recommends using lodash/underscore for mapping with an object, we can still do it using native JS.
                    let types = res.result;

                    let indexed_types = Object.keys(types).map(function (value, index) {
                        return { id: parseInt(index), label: types[index] };
                    });

                    resolve(indexed_types);
                }
            );
      });
  }

  // getCallReasons(http: Http) {
  //     return http
  //         .get('https://sandboxapi.hackney.gov.uk/CRMEnquiryTypes')
  //         .then(function(response) {
  //             // Group the enquiry types by their group.
  //             var groups = {};
  //             var types = response.data.result;
  //
  //             // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
  //             // Though the above recommends using lodash/underscore for mapping with an object, we can still do it using native JS.
  //             Object.keys(types).map(function(key) {
  //                 var call_type = parseInt(types[key].enquiryCallType);
  //                 if ( groups[call_type] == undefined ) {
  //                     groups[call_type] = [];
  //                 }
  //                 groups[call_type].push({
  //                     id: types[key].enquiryTypeId,
  //                     label: types[key].enquiryType
  //                 });
  //             });
  //
  //             return groups;
  //         });
  // }

}
