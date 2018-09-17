(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'MembersService', 'UtilityService', 'toastr', 'ageCategories', 'danceGroups'];

    function ctrlFn($scope, $uibModalInstance, MembersService, UtilityService, toastr, ageCategories, danceGroups) {
        $scope.ageCategories = ageCategories;
        $scope.danceGroups = danceGroups;

        $scope.member = {
            ContactData: {}
        };

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            // adjust birth date for transfer
            $scope.member.BirthDate = UtilityService.convertDateToISODateString($scope.member.BirthDateFromPicker);

            MembersService.create($scope.member).then(
                function () {
                    toastr.success('Novi plesač je uspešno sačuvan.');
                    $uibModalInstance.close();
                },
                function (error) {
                    resolveErrorMessage(error);
                }
            );
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        // helpers
        function validate() {
            //if (!$scope.member.JMBG || ($scope.member.JMBG && $scope.member.JMBG === '')) {
            //    return { error: true, errorMsg: 'JMBG je obavezan podatak.' };
            //}

            // check JMBG
            //var validJMBG = dataValidator.prototype.validanJMBG($scope.member.JMBG);
            //if (!validJMBG) {
            //    return { error: true, errorMsg: 'Nevalidan JMBG.' };
            //}

            if (!$scope.member.FirstName || !$scope.member.LastName ||
               ($scope.member.FirstName && $scope.member.FirstName === '') || ($scope.member.LastName && $scope.member.LastName === '')
            ) {
                return { error: true, errorMsg: 'Ime i prezime su obavezni podaci.' };
            }

            return { error: false };
        }

        function resolveErrorMessage(error) {
            switch (error.statusText) {
                case 'error_members_jmbg_exists':
                    toastr.error('Plesač sa datim JMBG već postoji.');
                    break;

                default:
                    toastr.error('Došlo je do greške na serveru prilikom unošenja novog plesača.');
                    break;
            }
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
