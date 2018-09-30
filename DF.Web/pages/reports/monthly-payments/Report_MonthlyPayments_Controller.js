(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('Report_MonthlyPayments_Controller', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'ReportsService', 'AuthenticationService', 'toastr', 'danceGroups'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, ReportsService, AuthenticationService, toastr, danceGroups) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menumenuReport_UnpaidInstallmentsByPeriod").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.filter = {};
        $scope.records = [];
        $scope.danceGroups = danceGroups;

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

            ReportsService.getMonthlyPaymentsReport($scope.filter).then(response => {
                if (response && response.data) {
                    console.log(response.data);
                    $scope.records = response.data;
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
    }
})();
