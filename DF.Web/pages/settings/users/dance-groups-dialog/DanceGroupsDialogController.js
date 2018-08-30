(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('DanceGroupsDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'UsersService', 'toastr', 'user', 'allDanceGroups', 'userDanceGroups'];

    function ctrlFn($scope, $uibModalInstance, UsersService, toastr, user, allDanceGroups, userDanceGroups) {
        $scope.user = user;
        $scope.allDanceGroups = allDanceGroups;
        $scope.userDanceGroups = userDanceGroups;

        $scope.save = function () {
            UsersService.addUserToDanceGroups(user, $scope.userDanceGroups).then(
                function () {
                    toastr.success('Plesne grupe uspešno ažurirane.');
                    $uibModalInstance.close();
                },
                function (error) {
                    toastr.error('Došlo je do greške prilikom ažuriranja plesnih grupa.');
                }
            );
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    }
})();
