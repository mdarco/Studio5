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
        // $scope.grandTotal = 0.0;
        $scope.grandTotal = {};

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

                    console.log($scope.records);

                    $scope.totals = calculateTotals();
                    $scope.grandTotal = calculateGrandTotal();

                    console.log($scope.totals);
                    console.log($scope.grandTotal);

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
                        totals[payment.Name] = { Amount: 0.0, Currency: payment.Currency };
                    }

                    if (payment.Installments) {
                        payment.Installments.forEach(installment => {
                            if (!installment.IsCanceled && installment.IsPaid) {
                                totals[payment.Name].Amount += installment.Amount;
                            }
                        });
                    }
                });
            });

            return totals;
        }

        function calculateGrandTotal() {
            // let grandTotal = 0.0;
            let grandTotal = {};

            Object.keys($scope.totals).forEach(key => {
                if (!grandTotal[$scope.totals[key].Currency]) {
                    grandTotal[$scope.totals[key].Currency] = 0.0;
                }

                // grandTotal += $scope.totals[key];
                grandTotal[$scope.totals[key].Currency] += $scope.totals[key].Amount;
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

        $scope.showMemberPayment = function (payment) {
            return !_.isNull(payment.Installments);
        };
    }
})();
