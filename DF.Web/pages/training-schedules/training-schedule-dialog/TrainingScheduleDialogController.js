(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('TrainingScheduleDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'TrainingSchedulesService', 'AuthenticationService', 'toastr', 'locations'];

    function ctrlFn($scope, $uibModalInstance, TrainingSchedulesService, AuthenticationService, toastr, locations) {
        $scope.locations = locations;

        $scope.weekDays = [
            { ID: 'ponedeljak', Name: 'Ponedeljak' },
            { ID: 'utorak', Name: 'Utorak' },
            { ID: 'sreda', Name: 'Sreda' },
            { ID: 'četvrtak', Name: 'Četvrtak' },
            { ID: 'petak', Name: 'Petak' },
            { ID: 'subota', Name: 'Subota' },
            { ID: 'nedelja', Name: 'Nedelja' }
        ];

        // var currentUser = AuthenticationService.getCurrentUser();

        $scope.save = function () {
            var modelValidation = validate();
            if (modelValidation.error) {
                toastr.warning(modelValidation.errorMsg);
                return;
            }

            $scope.schedule.Active = true;
            TrainingSchedulesService.create($scope.schedule).then(
                function () {
                    toastr.success('Novi raspored treninga je uspešno kreiran.');
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
            if (!$scope.schedule.TrainingLocationID || !$scope.schedule.WeekDay || !$scope.schedule.StartTime || !$scope.schedule.EndTime
            ) {
                return { error: true, errorMsg: 'Lokacija, dan u nedelji i vreme treninga su obavezni podaci.' };
            }

            // check training start and end time
            if ($scope.schedule.StartTime && !timeValidator.test($scope.schedule.StartTime)) {
                return { error: true, errorMsg: 'Neispravno vreme početka treninga.' };
            }

            if ($scope.schedule.EndTime && !timeValidator.test($scope.schedule.EndTime)) {
                return { error: true, errorMsg: 'Neispravno vreme završetka treninga.' };
            }

            // check if end time is later than the start time
            let startTime = moment('2000-01-01T' + $scope.schedule.StartTime);
            let endTime = moment('2000-01-01T' + $scope.schedule.EndTime);
            if (!endTime.isAfter(startTime)) {
                return { error: true, errorMsg: 'Vreme završetka treninga mora biti posle vremena početka treninga.' };
            }

            return { error: false };
        }

        function resolveErrorMessage(error) {
            switch (error.data.ExceptionMessage) {
                case 'error_training_schedule_exists':
                    toastr.error('Rasporeda treninga već postoji.');
                    break;
                default:
                    toastr.error('Došlo je do greške na serveru prilikom unošenja novog rasporeda treninga.');
                    break;
            }
        }
    }
})();
