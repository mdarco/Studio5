(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('Report_UnpaidInstallmentsByPeriod_Controller', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'ReportsService', 'AuthenticationService', 'danceGroups'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, ReportsService, AuthenticationService, danceGroups) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menumenuReport_UnpaidInstallmentsByPeriod").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.filter = {};
        $scope.installments = [];
        $scope.danceGroups = danceGroups;

        if (currentUser.UserGroups.includes('TRENER')) {
            if ($scope.danceGroups && $scope.danceGroups.length > 0) {
                $scope.filter.DanceGroupID = $scope.danceGroups[0].ID;
            }
        }

        function generateReport() {
            ReportsService.getUnpaidInstallmentsByPeriodAndDanceGroup($scope.filter).then(response => {
                if (response && response.data) {
                    formatDatesForDisplay(response.data);
                    $scope.installments = response.data;
                } else {
                    $scope.installments = [];
                }
            });
        }

        $scope.applyFilter = function () {
            generateReport();
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.installments = [];
        };

        function formatDatesForDisplay(records) {
            records.forEach(record => {
                record.InstallmentDateForDisplay = moment(record.InstallmentDate).format('DD.MM.YYYY');
            });
        }

        $scope.getInstallmentRowCss = function (record) {
            if (moment(record.InstallmentDate) < moment()) {
                return 'df-alert-row-light';
            }
        };
    }
})();
