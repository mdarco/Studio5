(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('UserDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', '$base64', 'UsersService', 'UtilityService', 'toastr'];

    function ctrlFn($scope, $uibModalInstance, $base64, UsersService, UtilityService, toastr) {
        $scope.user = {};

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            $scope.user.Password = $base64.encode($scope.user.Password);

            UsersService.manage($scope.user).then(
                function () {
                    toastr.success('Novi korisnik je uspešno sačuvan.');
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
            if (!$scope.user.Username || !$scope.user.Password || !$scope.user.ConfirmPassword) {
                return { error: true, errorMsg: 'Niste uneli sve obavezne podatke.' };
            }

            if ($scope.user.Password.toLowerCase() !== $scope.user.ConfirmPassword.toLowerCase()) {
                return { error: true, errorMsg: 'Lozinke se ne poklapaju.' };
            }

            return { error: false };
        }

        function resolveErrorMessage(error) {
            switch (error.statusText) {
                case 'error_users_username_exists':
                    toastr.error('Korisnik sa datim korisničkim imenom već postoji.');
                    break;

                default:
                    toastr.error('Došlo je do greške na serveru prilikom unosa novog korisnika.');
                    break;
            }
        }
    }
})();
