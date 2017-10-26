(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberFileController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'AuthenticationService', 'member'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, AuthenticationService, member) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuHome").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.member = member;
    }
})();
