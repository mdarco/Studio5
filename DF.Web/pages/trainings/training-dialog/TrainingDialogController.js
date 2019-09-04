(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('TrainingDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'TrainingsService', 'AuthenticationService', 'UtilityService', 'toastr', 'locations', 'danceGroups', 'trainers'];

    function ctrlFn($scope, $uibModalInstance, TrainingsService, AuthenticationService, UtilityService, toastr, locations, danceGroups, trainers) {
        $scope.locations = locations;
        $scope.danceGroups = danceGroups;
        $scope.trainers = trainers;

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.training = {
            TrainingDate: UtilityService.convertDateToISODateString(new Date())
        };

        if (danceGroups.length === 1) {
            $scope.training.TrainingDanceGroupID = danceGroups[0].ID;
        }

        if (danceGroups.length > 1) {
            if (!_.includes(currentUser.UserGroups, 'ADMIN') && !_.includes(currentUser.UserGroups, 'PREGLED PODATAKA')) {
                $scope.training.TrainingDanceGroupID = danceGroups[0].ID;
            }
        }

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            if (!$scope.training.TrainerUserID) {
                // assign current user
                $scope.training.TrainerUserID = currentUser.UserID;
            }

            TrainingsService.create($scope.training).then(
                function () {
                    toastr.success('Novi trening je uspešno kreiran.');
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
            let timeValidator = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

            // check required data
            if (!$scope.training.TrainingDate || !$scope.training.TrainingLocationID || !$scope.training.TrainingDanceGroupID || !$scope.training.StartTime || !$scope.training.EndTime
            ) {
                return { error: true, errorMsg: 'Datum, lokacija, grupa i vreme treninga su obavezni podaci.' };
            }

            // check training date
            if ($scope.training.TrainingDate && !moment($scope.training.TrainingDate).isValid()) {
                return { error: true, errorMsg: 'Nepostojeći datum ili neispravan format datuma.' };
            }

            // check training start and end time
            if ($scope.training.StartTime && !timeValidator.test($scope.training.StartTime)) {
                return { error: true, errorMsg: 'Neispravno vreme početka treninga.' };
            }

            if ($scope.training.EndTime && !timeValidator.test($scope.training.EndTime)) {
                return { error: true, errorMsg: 'Neispravno vreme završetka treninga.' };
            }

            // check if end time is later than the start time
            let startTime = moment('2000-01-01T' + $scope.training.StartTime);
            let endTime = moment('2000-01-01T' + $scope.training.EndTime);
            if (!endTime.isAfter(startTime)) {
                return { error: true, errorMsg: 'Vreme završetka treninga mora biti posle vremena početka treninga.' };
            }

            return { error: false };
        }

        function resolveErrorMessage(error) {
            switch (error.statusText) {
                default:
                    toastr.error('Došlo je do greške na serveru prilikom unošenja novog treninga.');
                    break;
            }
        }

        $scope.resolveTrainerComboVisibility = function () {
            if (!_.includes(currentUser.UserGroups, 'ADMIN') && !_.includes(currentUser.UserGroups, 'PREGLED PODATAKA')) {
                return true;
            } else {
                return false;
            }
        };

        // date picker support
        $scope.datePickers = {};
        $scope.openDatePicker = function (pickerFor, event) {
            event.preventDefault();
            event.stopPropagation();

            $scope.datePickers['datePickerOpened_' + pickerFor] = true;
        };
    }
})();
