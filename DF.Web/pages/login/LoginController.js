(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('LoginController', login);

    login.$inject = ['$rootScope', '$scope', '$timeout', '$location', '$base64', 'blockUI', 'AuthenticationService'];

    function login($rootScope, $scope, $timeout, $location, $base64, blockUI, AuthenticationService) {
        $timeout(function () {
            $scope.error = {};
            $scope.userLoginModel = {};
        }, 100);

        $scope.login = function () {
            if (!$scope.userLoginModel.Username || $scope.userLoginModel.Username === '') {
                $scope.error.errorMsg = 'Niste uneli korisničko ime.';
                return;
            }

            if (!$scope.userLoginModel.Password || $scope.userLoginModel.Password === '') {
                $scope.error.errorMsg = 'Niste uneli lozinku.';
                return;
            }

            var loadingSpinner = blockUI.instances.get('block-ui-element');
            loadingSpinner.start();

            // encrypt password for transfer with base64
            var base64Password = $base64.encode($scope.userLoginModel.Password);

            AuthenticationService.login($scope.userLoginModel.Username, base64Password).then(
                function (user) {
                    loadingSpinner.stop();
                    $rootScope.$broadcast('user-auth-changed', { userInfo: user }); // this fires an event down the $scope ($emit fires up the $scope)

                    //if (_.includes(user.UserGroups, 'Admin')) {
                    //    $location.path('/home');
                    //} else {
                    //    $location.path('/user-messages');
                    //}
                },
                function (errorMsg) {
                    $scope.error.errorMsg = errorMsg;
                    loadingSpinner.stop();
                }
            );
        };
    }
})();
