(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('TrainingsController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$location', '$uibModal', 'NgTableParams', 'AuthenticationService', 'TrainingsService', 'toastr', 'locations', 'danceGroups'];

    function ctrlFn($scope, $location, $uibModal, NgTableParams, AuthenticationService, TrainingsService, toastr, locations, danceGroups) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuTrainings").addClass("active");

        // prevent 'Enter' to submit the form
        $('#searchForm').bind('keydown', function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });

        var currentUser = AuthenticationService.getCurrentUser();

        var isBack = false; // determines if we're back from the member-presence page
        var queryString = $location.search();
        if (queryString && queryString.back) {
            isBack = queryString.back;
        }

        $scope.locations = locations;
        $scope.danceGroups = danceGroups;

        $scope.weekDays = [
            { ID: 'ponedeljak', Name: 'Ponedeljak' },
            { ID: 'utorak', Name: 'Utorak' },
            { ID: 'sreda', Name: 'Sreda' },
            { ID: 'četvrtak', Name: 'Četvrtak' },
            { ID: 'petak', Name: 'Petak' },
            { ID: 'subota', Name: 'Subota' },
            { ID: 'nedelja', Name: 'Nedelja' }
        ];

        //#region Filter members

        $scope.totalRecords = 0;
        $scope.initialDocListLoad = true;
        $scope.showGrid = false;
        $scope.applyClicked = false;
        $scope.filter = {};

        $scope.trainingsTableParams = new NgTableParams(
            {
                page: 1,
                count: 50
            },
            {
                total: 0,
                getData: function (params) {
                    if ($scope.initialDocListLoad) {
                        $scope.initialDocListLoad = false;
                        return [];
                    }

                    $scope.filter = $scope.filter || {};

                    if ($scope.applyClicked) {
                        $scope.applyClicked = false;
                        $scope.filter.PageNo = 1;
                    } else {
                        $scope.filter.PageNo = params.page();
                    }

                    $scope.filter.RecordsPerPage = params.count();

                    TrainingsService.setSearchFilter(angular.copy($scope.filter));

                    return TrainingsService.getFiltered($scope.filter).then(
                        function (result) {
                            if (!result || !result.data || !result.data.Data) {
                                $scope.showGrid = false;
                                return [];
                            }

                            if (result.data.Data.length > 0) {
                                $scope.showGrid = true;
                            } else {
                                $scope.showGrid = false;
                            }

                            params.total(result.data.Total);
                            $scope.totalRecords = result.data.Total;

                            return result.data.Data;
                        },
                        function (error) {
                            toastr.error('Došlo je do greške prilikom pretraživanja.');
                            $scope.showGrid = false;
                        }
                    );
                }
            }
        );

        $scope.applyFilter = function () {
            $scope.applyClicked = true;
            $scope.trainingsTableParams.reload();
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.showGrid = false;
            $scope.totalRecords = 0;
            $scope.trainingsTableParams.data = {};
        };

        //#endregion

        if (isBack) {
            if (TrainingsService.getSearchFilter()) {
                $scope.filter = TrainingsService.getSearchFilter();
                $scope.applyFilter();
            }
        } else {
            if (!_.includes(currentUser.UserGroups, 'ADMIN') && !_.includes(currentUser.UserGroups, 'PREGLED PODATAKA')) {
                if ($scope.danceGroups && $scope.danceGroups.length > 0) {
                    $scope.filter = {
                        TrainingDanceGroupID: $scope.danceGroups[0].ID
                    };
                }
            }
        }

        //#region Add training

        $scope.addTraining = function () {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/trainings/training-dialog/training-dialog.html',
                controller: 'TrainingDialogController',
                resolve: {
                    locations: () => {
                        return $scope.locations;
                    },
                    danceGroups: () => {
                        return $scope.danceGroups;
                    },
                    trainers: (LookupsService) => {
                        return LookupsService.getUsers().then(response => response.data);
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function () {
                    $scope.applyFilter();
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };

        //#endregion

        //#region Delete training

        $scope.deleteTraining = function (training) {
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
                        TrainingsService.delete(training.TrainingID).then(() => {
                            toastr.success('Trening uspešno obrisan.');
                            $scope.applyFilter();
                        }).catch((error) => {
                            toastr.success('Došlo je do greške prilikom brisanja treninga.');
                        });
                    }
                }
            });
        };

        //#endregion

        //#region Member presence

        $scope.openMemberPresencePage = function (training) {
            TrainingsService.setSearchFilter(angular.copy($scope.filter));
            $location.path('/training-member-presence/' + training.TrainingID);
        };

        //#endregion
    }
})();
