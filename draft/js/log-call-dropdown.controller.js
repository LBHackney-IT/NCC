angular
    .module('hackney.ncc')
    .controller('LogCallDropdownCtrl', LogCallDropdownController);

LogCallDropdownController.$inject = ['$filter', '$q', '$timeout', 'HackneyAPIFactory'];

function LogCallDropdownController($filter, $q, $timeout, HackneyAPI) {

    var ctrl = this;

    // MODEL
    ctrl.model = {
        call_types: null,
        call_reasons: null,
        selected: {
            call_type: null,
            call_reason: null
        }
    };

    // METHODS
    ctrl.$onInit = _init;
    ctrl.canProceed = canProceed;
    ctrl.getReasonsForCallType = getReasonsForCallType;
    ctrl.isCallReasonSelected = isCallReasonSelected;
    ctrl.isCallTypeSelected = isCallTypeSelected;
    ctrl.resetCallReason = resetCallReason;

    ////////////////////

    function _init() {
        $q.all({
            types: HackneyAPI.getCallTypes(),
            reasons: HackneyAPI.getCallReasons()
        })
        .then(function(responses) {
            ctrl.model.call_types = responses.types;
            ctrl.model.call_reasons = responses.reasons;
        });
    }

    function getReasonsForCallType() {
        if ( isCallTypeSelected() ) {
            reasons = ctrl.model.call_reasons[ ctrl.model.selected.call_type ];
            reasons = $filter('orderBy')(reasons, 'label'); // in alphabetical order.
            return reasons;
        }
        return null;
    }

    function resetCallReason() {
        ctrl.model.selected.call_reason = null;
    }

    function canProceed() {
        return isCallTypeSelected() && isCallReasonSelected();
    }

    function isCallTypeSelected() {
        return (null !== ctrl.model.selected.call_type);
    }

    function isCallReasonSelected() {
        return (null !== ctrl.model.selected.call_reason);
    }

}