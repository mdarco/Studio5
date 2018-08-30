(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('PaymentPermissionsDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'UsersService', 'toastr', 'user', 'userDanceGroups'];

    function ctrlFn($scope, $uibModalInstance, UsersService, toastr, user, userDanceGroups) {
        $scope.user = user;
        $scope.userDanceGroups = userDanceGroups;

        $scope.selectedDanceGroups = userDanceGroups.filter((g) => {
            return (g.HasPaymentAbility === true);
        });

        console.table($scope.userDanceGroups);
        console.table($scope.selectedDanceGroups);

        $scope.save = function () {
            UsersService.setUserDanceGroupsPaymentPermissions(user, $scope.selectedDanceGroups).then(
                function () {
                    toastr.success('Dozvole za plaćanje uspešno ažurirane.');
                    $uibModalInstance.close();
                },
                function (error) {
                    toastr.error('Došlo je do greške prilikom ažuriranja dozvola za plaćanje.');
                }
            );
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    }
})();
