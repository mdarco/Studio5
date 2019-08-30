(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberPresenceController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$q', '$location', '$timeout', '$uibModal', 'TrainingsService', 'AuthenticationService', 'WebApiBaseUrl', 'toastr', 'memberPresenceList'];

    function ctrlFn($scope, $q, $location, $timeout, $uibModal, TrainingsService, AuthenticationService, WebApiBaseUrl, toastr, memberPresenceList) {
        // set active menu item
        //$("#left-panel nav ul li").removeClass("active");
        //$("#menuHome").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.webApiBaseUrl = WebApiBaseUrl;
        $scope.memberPresenceList = memberPresenceList;
        $scope.showGrid = (memberPresenceList && memberPresenceList.length > 0);

        $scope.resolveAbsenceJustifiedDisplayText = function (item) {
            if (item.AbsenceJustified === true) {
                return 'Da';
            }

            if (item.AbsenceJustified === false) {
                return 'Ne';
            }
        };
    }
})();
