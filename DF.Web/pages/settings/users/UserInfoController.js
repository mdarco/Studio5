(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('UserInfoController', userInfo);

    userInfo.$inject = ['$rootScope', '$scope', '$http', '$location', '$uibModal', '$base64', 'WebApiBaseUrl', 'AuthenticationService'];

    function userInfo($rootScope, $scope, $http, $location, $uibModal, $base64, WebApiBaseUrl, AuthenticationService) {
        $scope.webApiBaseUrl = WebApiBaseUrl;
        $scope.userInfo = {};

        function openChangePasswordDialog() {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                templateUrl: 'pages/settings/users/change-password-dialog/change-password-dialog.html',
                controller: 'ChangePasswordDialogController'
            };

            var dlg = $uibModal.open(dialogOpts);

            dlg.result.then(
                function (newPasswordObj) {
                    // modal closed => check old password first
                    var currentUser = AuthenticationService.getCurrentUser();

                    newPasswordObj.OldPassword = $base64.encode(newPasswordObj.OldPassword);
                    newPasswordObj.Password = $base64.encode(newPasswordObj.Password);
                    AuthenticationService.login(currentUser.Username, newPasswordObj.OldPassword).then(
                        function (user) {
                            // proceed with password changing
                            user.Password = newPasswordObj.Password;

                            var url = WebApiBaseUrl + '/api/settings/users/change-password';
                            $http.post(url, user).then(
                                function () {
                                    alert('Lozinka je uspešno izmenjena.');
                                },
                                function (error) {
                                    alert('Došlo je do greške prilikom komunikacije sa serverom.\nLozinka nije izmenjena.');
                                }
                            );
                        },
                        function (errorMsg) {
                            alert('Neispravna stara lozinka.');
                        }
                    );
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        }

        $scope.changePassword = function () {
            openChangePasswordDialog();
        };

        $scope.logout = function () {
            AuthenticationService.logout();
            $rootScope.$broadcast('user-auth-changed', {});
            $location.path('/login');
        };

        $scope.$on('user-auth-changed', function (event, data) {
            if (data && data.userInfo) {
                $scope.userInfo = data.userInfo;
                $scope.userInfo.FullName = $scope.userInfo.FirstName + ' ' + $scope.userInfo.LastName;
            } else {
                $scope.userInfo = {};
            }
        });
    }
})();
