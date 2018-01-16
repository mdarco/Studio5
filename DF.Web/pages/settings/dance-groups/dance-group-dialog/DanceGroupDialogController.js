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
            if (!$scope.tax.DanceGroupName ||
                ($scope.tax.DanceGroupName && $scope.tax.DanceGroupName === '')
            ) {
                return { error: true, errorMsg: 'Naziv je obavezan podatak.' };
            }

            return { error: false };
        }
    }
})();
