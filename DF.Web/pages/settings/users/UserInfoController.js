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
                function () {
                    // modal closed
                },
                function () {
                    // modal dismissed
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
