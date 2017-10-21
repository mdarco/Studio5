(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('ComboDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'toastr', 'settings', 'comboValues'];

    function ctrlFn($scope, $uibModalInstance, toastr, settings, comboValues) {
        if (!settings.HideNote) {
            settings.HideNote = false;
        }

        $scope.viewSettings = settings;
        $scope.comboValues = [];

        if (comboValues && comboValues.data && _.isArray(comboValues.data)) {
            $scope.comboValues = mapFields(comboValues.data, settings.FieldMappings);
        } else if (comboValues && _.isArray(comboValues)) {
            $scope.comboValues = mapFields(comboValues, settings.FieldMappings);
        }

        $scope.combo = {};
        if (settings.ComboValue) {
            $scope.combo.Value = settings.ComboValue;
        }

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            var comboItem = _.find($scope.comboValues, { Id: $scope.combo.Value });
            if (comboItem) {
                $scope.combo.ValueText = comboItem.DisplayText;
            }

            $uibModalInstance.close($scope.combo);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        // helpers
        function validate() {
            if (!$scope.combo.Value ||
               ($scope.combo.Value && $scope.combo.Value === '')
            ) {
                return { error: true, errorMsg: sprintf('%s je obavezan podatak.', $scope.viewSettings.Label) };
            }

            return { error: false };
        }

        function mapFields(comboData, mappings) {
            var result = [];

            _.each(comboData, function (comboItem) {
                result.push({
                    Id: comboItem[mappings.idField],
                    DisplayText: comboItem[mappings.displayTextField]
                });
            });

            return result;
        }
    }
})();
