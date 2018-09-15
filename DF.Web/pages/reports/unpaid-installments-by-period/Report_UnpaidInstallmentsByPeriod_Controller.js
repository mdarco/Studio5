(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('Report_UnpaidInstallmentsByPeriod_Controller', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'ReportsService', 'AuthenticationService'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, ReportsService, AuthenticationService) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menumenuReport_UnpaidInstallmentsByPeriod").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.filter = {};
        $scope.installments = [];

        function generateReport() {
            ReportsService.getUnpaidInstallmentsByPeriod($scope.filter).then(response => {
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
                record.InstallmentDate = moment(record.InstallmentDate).format('DD.MM.YYYY');
            });
        }
    }
})();
