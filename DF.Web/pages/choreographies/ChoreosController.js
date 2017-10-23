(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('ChoreosController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'AuthenticationService'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, AuthenticationService) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuChoreos").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();
    }
})();
