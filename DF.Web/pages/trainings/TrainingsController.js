(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('TrainingsController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'AuthenticationService'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, AuthenticationService) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuTrainings").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();
    }
})();
