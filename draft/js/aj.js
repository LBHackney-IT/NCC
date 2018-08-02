// Vanilla JavaScript AJAX methods.
// (Or more to the point, AJ - no XML is involved.)
// These are here for testing purposes, without the requirement of a framework.
//
// Drew Maughan

/**
 * Performs a GET request.
 * 
 * @param {string} url 
 * @param {Object} params 
 * 
 * @returns {Promise}
 */
function ajGet(url, params) {
    if ( params instanceof Object ) {
        // Build the query portion of the URL.
        // https://stackoverflow.com/a/23639793
        url += '?' + Object.keys(params).map(function(key) {
            return key + '=' + encodeURIComponent(params[key]);
          }).join('&');
    }
    return _aj('GET', url);
}

/**
 * Performs an AJAX request.
 * 
 * @param {string} method 
 * @param {string} url 
 * 
 * @returns {Promise}
 */
function _aj(method, url) {
    var promise = new Promise(function(resolve, reject) {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.DONE === this.readyState) {
                if ( this.status < 400 ) {
                    resolve({
                        status: this.status,
                        data: JSON.parse(this.response)
                    });
                } else {
                    reject({
                        status: this.status,
                        data: JSON.parse(this.response)
                    });
                }
            };
        };

        xhttp.open(method, url, true);
        xhttp.send();    
    });
    
    return promise;
}