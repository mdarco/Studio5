(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('TextFieldDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'toastr', 'settings'];

    function ctrlFn($scope, $uibModalInstance, toastr, settings) {
        $scope.viewSettings = settings;

        $scope.field = {};
        if (settings.FieldValue) {
            $scope.field.Value = settings.FieldValue;
        }

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            $uibModalInstance.close($scope.field.Value);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        // helpers
        function validate() {
            if (!$scope.field.Value ||
               ($scope.field.Value && $scope.field.Value === '')
            ) {
                return { error: true, errorMsg: sprintf('%s je obavezan podatak.', $scope.viewSettings.FieldLabel) };
            }

            return { error: false };
        }
    }
})();
