(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('NavigationController', navigation);

    navigation.$inject = ['$rootScope', '$scope', '$location', 'UsersService', 'AuthenticationService', 'toastr', 'AppParams'];

    function navigation($rootScope, $scope, $location, UsersService, AuthenticationService, NotificationService, toastr, AppParams) {
        
    }
})();
