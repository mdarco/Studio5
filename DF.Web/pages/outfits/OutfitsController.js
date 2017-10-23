(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('OutfitsController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'AuthenticationService'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, AuthenticationService) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuOutfits").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();
    }
})();
