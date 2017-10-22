(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('NavigationController', navigation);

    navigation.$inject = ['$rootScope', '$scope', '$location', 'AuthenticationService', 'toastr', 'AppParams'];

    function navigation($rootScope, $scope, $location, AuthenticationService, toastr, AppParams) {
        
    }
})();
