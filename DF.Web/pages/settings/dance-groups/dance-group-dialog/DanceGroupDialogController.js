(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('DanceGroupDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'toastr', 'group', 'ageCategories'];

    function ctrlFn($scope, $uibModalInstance, toastr, group, ageCategories) {
        $scope.group = group;
        $scope.ageCategories = ageCategories;

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            $uibModalInstance.close($scope.group);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        // helpers
        function validate() {
            if (!$scope.group.DanceGroupName ||
                ($scope.group.DanceGroupName && $scope.group.DanceGroupName === '')
            ) {
                return { error: true, errorMsg: 'Naziv je obavezan podatak.' };
            }

            return { error: false };
        }
    }
})();
