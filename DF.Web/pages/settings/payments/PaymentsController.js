(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('PaymentsController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'PaymentsService' /* , 'AuthenticationService' */];

    function ctrlFn($rootScope, $scope, $location, $uibModal, PaymentsService /* , AuthenticationService */) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuPayments").addClass("active");

        //var currentUser = AuthenticationService.getCurrentUser();

        $scope.filter = {};
        $scope.payments = [];

        $scope.showGrid = false;

        function getPayments() {
            PaymentsService.getFiltered($scope.filter).then(
                function (result) {
                    if (!result || !result.data) {
                        $scope.showGrid = false;
                        return [];
                    }

                    if (result && result.data && result.data.length > 0) {
                        $scope.payments = result.data;
                        $scope.showGrid = true;
                    } else {
                        $scope.showGrid = false;
                        $scope.payments = [];
                    }
                },
                function (error) {
                    toastr.error('Došlo je do greške prilikom pretraživanja.');
                }
            );
        }

        $scope.applyFilter = function () {
            getPayments();
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.showGrid = false;
            $scope.payments = [];
        };
    }
})();
