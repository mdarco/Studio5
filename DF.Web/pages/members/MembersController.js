(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MembersController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'AuthenticationService'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, AuthenticationService) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuMembers").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();
    }
})();
