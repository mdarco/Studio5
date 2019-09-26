(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('Report_TrainingMemberPresence_Controller', ctrlFn);

    ctrlFn.$inject = ['$scope', 'ReportsService', 'AuthenticationService', 'toastr', 'danceGroups'];

    function ctrlFn($scope, ReportsService, AuthenticationService, toastr, danceGroups) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menumenuReport_TrainingMemberPresence").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.filter = {};
        $scope.danceGroups = danceGroups;

        $scope.records = [];
        $scope.headerColumns = [];

        if (currentUser.UserGroups.includes('TRENER')) {
            if ($scope.danceGroups && $scope.danceGroups.length > 0) {
                $scope.filter.DanceGroupID = $scope.danceGroups[0].ID;
            }
        }

        function generateReport() {
            if (!$scope.filter.DanceGroupID) {
                toastr.warning('Morate izabrati grupu.');
                return;
            }

            if (!$scope.filter.StartDate) {
                toastr.warning('Morate zadati početni datum.');
                return;
            }

            if (!$scope.filter.EndDate) {
                toastr.warning('Morate zadati krajnji datum.');
                return;
            }

            // check date validity
            if (!moment($scope.filter.StartDate, 'YYYY-MM-DD', true).isValid()) {
                toastr.warning('Nepostojeći početni datum ili neispravan format datuma.');
                return;
            }

            if (!moment($scope.filter.EndDate, 'YYYY-MM-DD', true).isValid()) {
                toastr.warning('Nepostojeći krajnji datum ili neispravan format datuma.');
                return;
            }

            // check if start date < end date
            if (moment($scope.filter.StartDate, 'YYYY-MM-DD', true) > moment($scope.filter.EndDate, 'YYYY-MM-DD', true)) {
                toastr.warning('Krajnji datum mora biti posle početnog datuma.');
                return;
            }

            ReportsService.getTrainingMemberPresence($scope.filter).then(response => {
                if (response && response.data) {
                    // console.log(response.data);
                    $scope.records = response.data;

                    if ($scope.records.length > 0) {
                        $scope.headerColumns = Object.keys($scope.records[0]);
                    }
                } else {
                    $scope.records = [];
                }
            });
        }

        $scope.applyFilter = function () {
            generateReport();
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.records = [];
        };

        $scope.formatHeader = function (headerCol) {
            let parts = headerCol.split('|');

            // let result = '<div>';
            let result = '';
            parts.forEach(part => {
                result += part + '\n';
            });

            //if (result.endsWith('<br />')) {
            //    result = result.substr(0, result.length - 6);
            //}

            // result += '</div>';

            return result;
        };
    }
})();
