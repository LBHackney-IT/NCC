

var HackneyAPI = {

    getCallTypes: function() {
        return ajGet('https://sandboxapi.hackney.gov.uk/CRMLookups', { id: 3 })
            .then(function(response) {
                return response.data.result;
            });
    },

    getCallReasons: function() {
        return ajGet('https://sandboxapi.hackney.gov.uk/CRMEnquiryTypes')
        .then(function(response) {
            // Group the enquiry types by their group.
            var groups = {};
            var types = response.data.result;
            Object.keys(types).map(function(key) {
                var call_type = types[key].enquiryCallType;
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
    
};