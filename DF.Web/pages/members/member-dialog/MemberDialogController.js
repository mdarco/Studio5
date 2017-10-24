(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'toastr'];

    function ctrlFn($scope, $uibModalInstance, toastr) {
        $scope.member = {
            ContactData: {}
        };

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            $uibModalInstance.close($scope.member);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        // helpers
        function validate() {
            if (!$scope.member.JMBG || ($scope.member.JMBG && $scope.member.JMBG === '')) {
                return { error: true, errorMsg: 'JMBG je obavezan podatak.' };
            }

            // check JMBG
            var validJMBG = dataValidator.prototype.validanJMBG($scope.member.JMBG);
            if (!validJMBG) {
                return { error: true, errorMsg: 'Nevalidan JMBG.' };
            }

            if (!$scope.member.FirstName || !$scope.member.LastName ||
               ($scope.member.FirstName && $scope.member.FirstName === '') || ($scope.member.LastName && $scope.member.LastName === '')
            ) {
                return { error: true, errorMsg: 'Ime i prezime su obavezni podaci.' };
            }

            return { error: false };
        }

        // date picker support
        $scope.datePickers = {};
        $scope.openDatePicker = function (pickerFor, event) {
            event.preventDefault();
            event.stopPropagation();

            $scope.datePickers['datePickerOpened_' + pickerFor] = true;
        };
    }
})();
