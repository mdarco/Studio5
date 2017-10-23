(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('DanceSelectionsController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'AuthenticationService'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, AuthenticationService) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuDanceSelections").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();
    }
})();
