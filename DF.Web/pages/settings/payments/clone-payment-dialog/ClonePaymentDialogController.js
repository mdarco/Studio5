(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('ClonePaymentDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'PaymentsService', 'AuthenticationService', 'toastr', 'payment'];

    function ctrlFn($scope, $uibModalInstance, PaymentsService, AuthenticationService, toastr, payment) {
        // var currentUser = AuthenticationService.getCurrentUser();

        $scope.clone = {
            ID: payment.ID,
            Name: payment.Name,
            Amount: payment.Amount,
            DueDate: payment.DueDate.split('T')[0],
            NumberOfInstallments: payment.NumberOfInstallments,
            InstallmentAmounts: payment.InstallmentAmounts
        };

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            PaymentsService.clonePayment($scope.clone).then(
                function () {
                    toastr.success('Plaćanje je uspešno iskopirano.');
                    $uibModalInstance.close();
                },
                function (error) {
                    resolveErrorMessage(error);
                }
            );
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        // helpers
        function validate() {
            // check required data
            if (!$scope.clone.Name || !$scope.clone.Amount || !$scope.clone.DueDate
            ) {
                return { error: true, errorMsg: 'Naziv, iznos i rok plaćanja su obavezni podaci.' };
            }

            // check amount
            if ($scope.clone.Amount && (parseFloat($scope.clone.Amount) < 0) || _.isNaN(parseFloat($scope.clone.Amount))) {
                return { error: true, errorMsg: 'Neispravan iznos.' };
            }

            // check payment due date
            if ($scope.clone.DueDate && !moment($scope.clone.DueDate).isValid()) {
                return { error: true, errorMsg: 'Nepostojeći datum ili neispravan format datuma.' };
            }

            return { error: false };
        }

        function resolveErrorMessage(error) {
            switch (error.statusText) {
                case 'error_payments_clone_payment_existing_name':
                    toastr.warning('Plaćanje sa datim nazivom već postoji.');
                    break;

                default:
                    toastr.error('Došlo je do greške na serveru prilikom kopiranja plaćanja.');
                    break;
            }
        }
    }
})();
