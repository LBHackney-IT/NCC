angular
    .module('hackney.ncc')
    .factory('HackneyAPIFactory', HackneyAPIFactory);

HackneyAPIFactory.$inject = ['$http'];

function HackneyAPIFactory($http) {

    return {
        getCallTypes: getCallTypes,
        getCallReasons: getCallReasons
    };

    ////////////////////

    function getCallTypes() {
        return $http.get('https://sandboxapi.hackney.gov.uk/CRMLookups?id=3')
            .then(function(response) {
                // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
                // Though the above recommends using lodash/underscore for mapping with an object, we can still do it using native JS.
                let types = response.data.result;
                
                return Object.keys(types).map(function (value, index) {
                    return { id: parseInt(index), label: types[index] };
                });

                return results;
            });
    }
    
    function getCallReasons() {
        return $http
            .get('https://sandboxapi.hackney.gov.uk/CRMEnquiryTypes')
            .then(function(response) {
                // Group the enquiry types by their group.
                var groups = {};
                var types = response.data.result;

                // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
                // Though the above recommends using lodash/underscore for mapping with an object, we can still do it using native JS.
                Object.keys(types).map(function(key) {
                    var call_type = parseInt(types[key].enquiryCallType);
                    if ( groups[call_type] == undefined ) {
                        groups[call_type] = [];
                    }
                    groups[call_type].push({
                        id: types[key].enquiryTypeId,
                        label: types[key].enquiryType
                    });
                });
    
                return groups;
            });
    }

}