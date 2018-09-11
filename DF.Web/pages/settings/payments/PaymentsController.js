(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('PaymentsController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'PaymentsService', 'toastr' /* , 'AuthenticationService' */];

    function ctrlFn($rootScope, $scope, $location, $uibModal, PaymentsService, toastr /* , AuthenticationService */) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuPayments").addClass("active");

        //var currentUser = AuthenticationService.getCurrentUser();

        $scope.filter = {};
        $scope.payments = [];

        $scope.showGrid = false;

        function getPayments() {
            PaymentsService.getFiltered($scope.filter).then(
                function (result) {
                    if (!result || !result.data) {
                        $scope.showGrid = false;
                        return [];
                    }

                    if (result && result.data && result.data.length > 0) {
                        $scope.payments = result.data;
                        $scope.showGrid = true;
                    } else {
                        $scope.showGrid = false;
                        $scope.payments = [];
                    }
                },
                function (error) {
                    toastr.error('Došlo je do greške prilikom pretraživanja.');
                }
            );
        }

        $scope.applyFilter = function () {
            getPayments();
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.showGrid = false;
            $scope.payments = [];
        };

        $scope.addPayment = function () {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/payments/payment-dialog/payment-dialog.html',
                controller: 'PaymentDialogController',
                resolve: {
                    model: function () {
                        return null;
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function () {
                    getPayments();
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };

        $scope.viewPayment = function (payment) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/payments/payment-dialog/payment-dialog.html',
                controller: 'PaymentDialogController',
                resolve: {
                    model: function () {
                        return PaymentsService.getPayment(payment.ID).then(
                            function (result) {
                                return result.data;
                            }
                        );
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function () {
                    
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };

        $scope.deletePayment = function (payment) {
            bootbox.confirm({
                message: 'Da li ste sigurni?',
                buttons: {
                    confirm: {
                        label: 'Da',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'Ne',
                        className: 'btn-default'
                    }
                },
                callback: function (result) {
                    if (result) {
                        PaymentsService.deletePayment(payment.ID).then(
                            function () {
                                getPayments();
                            },
                            function (error) {
                                toastr.warning('Plaćanje se ne može obrisati jer se koristi.');
                            }
                        );
                    }
                }
            });
        };
    }
})();
