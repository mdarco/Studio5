(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberPresenceController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$q', '$location', '$timeout', '$uibModal', 'TrainingsService', 'AuthenticationService', 'WebApiBaseUrl', 'toastr', 'memberPresenceList'];

    function ctrlFn($scope, $q, $location, $timeout, $uibModal, TrainingsService, AuthenticationService, WebApiBaseUrl, toastr, memberPresenceList) {
        var currentUser = AuthenticationService.getCurrentUser();

        $scope.webApiBaseUrl = WebApiBaseUrl;
        $scope.memberPresenceList = memberPresenceList;
        $scope.showGrid = (memberPresenceList && memberPresenceList.length > 0);

        $scope.resolveAbsenceJustifiedDisplayText = function (item) {
            if (!item.IsPresent && item.AbsenceJustified === true) {
                return 'Da';
            }

            if (!item.IsPresent && item.AbsenceJustified === false) {
                return 'Ne';
            }
        };

        $scope.toggleStatus = function (item) {
            let updateStatusObj = {
                TrainingID: item.TrainingID,
                MemberID: item.MemberID,
                IsPresent: !item.IsPresent
            };

            TrainingsService.updateMemberPresence(updateStatusObj).then(() => {
                toastr.success('Status izmenjen.');
                item.IsPresent = !item.IsPresent;
            });
        };

        $scope.toggleAbsenceJustified = function (item) {
            let updateObj = {
                TrainingID: item.TrainingID,
                MemberID: item.MemberID,
                AbsenceJustified: !item.AbsenceJustified
            };

            TrainingsService.updateMemberPresence(updateObj).then(() => {
                toastr.success('Status izostanka izmenjen.');
                item.AbsenceJustified = !item.AbsenceJustified;
            });
        };
    }
})();
