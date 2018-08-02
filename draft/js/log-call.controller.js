angular
    .module('hackney.ncc')
    .controller('LogCallCtrl', LogCallController);

LogCallController.$inject = ['$q', '$timeout', 'HackneyAPIFactory'];

function LogCallController($q, $timeout, HackneyAPI) {

    var ctrl = this;

    ctrl.model = {
        call_types: null,
        call_reasons: null,
        selected: {
            type: null,
            reason: null
        }
    };

    ctrl.$onInit = _init;

    ////////////////////

    function _init() {
        $q.all({
            types: HackneyAPI.getCallTypes(),
            reasons: HackneyAPI.getCallReasons()
        })
        .then(function(responses) {
            ctrl.model.call_types = responses.types;
            ctrl.model.call_reasons = responses.reasons;

            $timeout(window.GOVUKFrontend.initAll);
            // to activate the GDS conditional radio button feature.
        });
    }
}