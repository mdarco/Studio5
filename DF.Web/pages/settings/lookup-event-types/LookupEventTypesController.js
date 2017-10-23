(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('LookupEventTypesController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'AuthenticationService'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, AuthenticationService) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuLookupEventTypes").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();
    }
})();
