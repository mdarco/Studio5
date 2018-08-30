(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('ChangePasswordDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', '$base64', 'AuthenticationService', 'UsersService', 'toastr'];

    function ctrlFn($scope, $uibModalInstance, $base64, AuthenticationService, UsersService, toastr) {
        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            var currentUser = AuthenticationService.getCurrentUser();

            $scope.model.OldPassword = $base64.encode($scope.model.OldPassword);
            $scope.model.Password = $base64.encode($scope.model.Password);

            AuthenticationService.login(currentUser.Username, $scope.model.OldPassword).then(
                function (user) {
                    // proceed with password changing
                    user.Password = $scope.model.Password;

                    UsersService.changePassword(user).then(
                        function () {
                            toastr.success('Lozinka je uspešno izmenjena.');
                            $uibModalInstance.close();
                        },
                        function (error) {
                            toastr.error('Došlo je do greške prilikom komunikacije sa serverom.\nLozinka nije izmenjena.');
                        }
                    );
                },
                function (errorMsg) {
                    toastr.warning('Neispravna stara lozinka.');
                }
            );
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        // helpers
        function validate() {
            if (!$scope.model.OldPassword ||
                !$scope.model.Password ||
                !$scope.model.ConfirmPassword ||
                ($scope.model.OldPassword && $scope.model.OldPassword === '') ||
                ($scope.model.Password && $scope.model.Password === '') ||
                ($scope.model.ConfirmPassword && $scope.model.ConfirmPassword === '')
            ) {
                return { error: true, errorMsg: 'Svi podaci moraju biti popunjeni.' };
            }

            if ($scope.model.Password.toLowerCase() !== $scope.model.ConfirmPassword.toLowerCase()) {
                return { error: true, errorMsg: 'Neispravna potvrda lozinke.' };
            }

            return { error: false };
        }
    }
})();
