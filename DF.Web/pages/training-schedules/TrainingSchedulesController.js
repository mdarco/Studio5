(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('TrainingSchedulesController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModal', 'AuthenticationService', 'TrainingSchedulesService', 'toastr', 'locations'];

    function ctrlFn($scope, $uibModal, AuthenticationService, TrainingSchedulesService, toastr, locations) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuTrainingSchedules").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.locations = locations;
        $scope.trainingSchedules = [];

        $scope.weekDays = [
            { ID: 'ponedeljak', Name: 'Ponedeljak' },
            { ID: 'utorak', Name: 'Utorak' },
            { ID: 'sreda', Name: 'Sreda' },
            { ID: 'četvrtak', Name: 'Četvrtak' },
            { ID: 'petak', Name: 'Petak' },
            { ID: 'subota', Name: 'Subota' },
            { ID: 'nedelja', Name: 'Nedelja' }
        ];

        $scope.showGrid = false;
        $scope.totalRecords = undefined;

        function getTrainingSchedules() {
            TrainingSchedulesService.get().then(
                function (result) {
                    if (!result || !result.data) {
                        $scope.showGrid = false;
                        return [];
                    }

                    if (result && result.data && result.data.length > 0) {
                        $scope.trainingSchedules = result.data;
                        $scope.showGrid = true;
                        $scope.totalRecords = result.data.length;
                    } else {
                        $scope.showGrid = false;
                        $scope.trainingSchedules = [];
                        $scope.totalRecords = undefined;
                    }
                },
                function (error) {
                    toastr.error('Došlo je do greške prilikom preuzimanja rasporeda treninga.');
                }
            );
        }
        getTrainingSchedules();

        //#region Add training schedule

        $scope.addTrainingSchedule = function () {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/training-schedules/training-schedule-dialog/training-schedule-dialog.html',
                controller: 'TrainingScheduleDialogController',
                resolve: {
                    locations: () => {
                        return $scope.locations;
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function () {
                    getTrainingSchedules();
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };

        //#endregion

        //#region Delete training schedule

        $scope.deleteTrainingSchedule = function (schedule) {
            bootbox.confirm({
                message: 'Da li ste sigurni?',
                buttons: {
                    confirm: {
                        label: 'Da',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'Ne',
                        className: 'btn-default'
                    }
                },
                callback: function (result) {
                    if (result) {
                        TrainingSchedulesService.delete(schedule.ID).then(() => {
                            toastr.success('Raspored treninga uspešno obrisan.');
                            getTrainingSchedules();
                        }).catch((error) => {
                            toastr.success('Došlo je do greške prilikom brisanja rasporeda treninga.');
                        });
                    }
                }
            });
        };

        //#endregion
    }
})();
