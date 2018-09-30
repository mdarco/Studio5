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

        $scope.totals = {};
        $scope.showTotals = false;
        $scope.grandTotal = 0.0;

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
                    $scope.records = response.data;

                    $scope.totals = calculateTotals();
                    $scope.grandTotal = calculateGrandTotal();
                    $scope.showTotals = true;
                } else {
                    $scope.records = [];
                    $scope.totals = {};
                }
            });
        }

        $scope.applyFilter = function () {
            generateReport();
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.records = [];
            $scope.totals = {};
            $scope.showTotals = false;
        };

        function calculateTotals() {
            let totals = {};

            $scope.records.forEach(record => {
                record.DeserializedPayments.forEach(payment => {
                    if (!totals[payment.Name]) {
                        totals[payment.Name] = 0.0;
                    }

                    if (payment.Installments) {
                        payment.Installments.forEach(installment => {
                            if (!installment.IsCanceled && installment.IsPaid) {
                                totals[payment.Name] += installment.Amount;
                            }
                        });
                    }
                });
            });

            return totals;
        }

        function calculateGrandTotal() {
            let grandTotal = 0.0;

            Object.keys($scope.totals).forEach(key => {
                grandTotal += $scope.totals[key];
            });

            return grandTotal;
        }

        $scope.resolveDocRowCssClass = function (doc) {
            if (doc.ExpiryDate) {
                var today = moment(Date.now());
                var expiryDate = moment(doc.ExpiryDate.split('.')[2] + '-' + doc.ExpiryDate.split('.')[1] + '-' + doc.ExpiryDate.split('.')[0]);

                if (expiryDate < today) {
                    return 'df-alert-row';
                }
            }

            return '';
        };
    }
})();
