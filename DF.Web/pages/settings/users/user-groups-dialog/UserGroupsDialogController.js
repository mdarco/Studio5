(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('UserGroupsDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'UsersService', 'toastr', 'user', 'allGroups', 'userGroups'];

    function ctrlFn($scope, $uibModalInstance, UsersService, toastr, user, allGroups, userGroups) {
        $scope.user = user;
        $scope.userGroups = userGroups;
        $scope.allGroups = allGroups;

        $scope.save = function () {
            UsersService.addUserToGroups(user, $scope.userGroups).then(
                function () {
                    toastr.success('Korisničke grupe uspešno ažurirane.');
                    $uibModalInstance.close();
                },
                function (error) {
                    toastr.error('Došlo je do greške prilikom ažuriranja korisničkih grupa.');
                }
            );
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    }
})();
