(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('PaymentsController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'PaymentsService', 'AuthenticationService', 'toastr'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, PaymentsService, AuthenticationService, toastr) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuPayments").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

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

        $scope.togglePaymentActive = function (payment) {
            PaymentsService.editPayment({ Active: !payment.Active }).then(() => {
                if (payment.Active) {
                    toastr.success('Plaćanje deaktivirano.');
                } else {
                    toastr.success('Plaćanje aktivirano.');
                }
            });
        };

        $scope.clonePayment = function (payment) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/payments/clone-payment-dialog/clone-payment-dialog.html',
                controller: 'ClonePaymentDialogController',
                resolve: {
                    payment: () => {
                        return payment;
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function () {
                    $scope.applyFilter();
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
                message: 'Plaćanje će biti u potpunosti obrisano.\nDa li ste sigurni?',
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
                                toastr.success('Plaćanje obrisano.');
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

        // access resolvers
        $scope.resolveAdminAccess = function () {
            return currentUser.UserGroups.includes('ADMIN');
        };
    }
})();
