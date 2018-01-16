(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('DanceGroupsController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$http', '$q', '$uibModal', 'WebApiBaseUrl', 'NgTableParams', 'DanceGroupsService', 'toastr'];

    function ctrlFn($rootScope, $scope, $http, $q, $uibModal, WebApiBaseUrl, NgTableParams, DanceGroupsService, toastr) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuDanceGroups").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.webApiBaseUrl = WebApiBaseUrl;
        $scope.showTable = false;

        $scope.danceGroupsList = new NgTableParams(
            {
                page: 1,
                count: 10
            },
            {
                total: 0,
                getData: function (params) {
                    $scope.filter = $scope.filter || {};

                    $scope.filter.PageNo = params.page();
                    $scope.filter.RecordsPerPage = params.count();

                    if (!_.isEmpty($scope.filter.DanceGroupName) && $scope.filter.DanceGroupName !== '') {
                        return DanceGroupsService.getDanceGroups($scope.filter).then(
                            function (result) {
                                if (result.data.Data.length > 0) {
                                    $scope.showTable = true;
                                } else {
                                    $scope.showTable = false;
                                }

                                params.total(result.Total);
                                return result.data.Data;
                            },
                            function (error) {
                                toastr.error('Došlo je do greške prilikom učitavanja spiska grupa.');
                                $scope.showTable = false;
                            }
                        );
                    }
                }
            }
        );

        // filter
        $scope.applyFilter = function () {
            if (!_.isEmpty($scope.filter.DanceGroupName) && $scope.filter.DanceGroupName !== '') {
                $scope.danceGroupList.reload();
            }
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.showTable = false;
        };

        // CRUD
        $scope.add = function () {
            $scope.openDialog({ id: -1 });
        };

        $scope.edit = function (tax) {
            $scope.openDialog(tax);
        };

        $scope.delete = function (tax) {
            DanceGroupsService.deleteDanceGroup(group.DanceGroupID).then(
                function () {
                    $scope.danceGroupsList.reload();
                },
                function (error) {
                    toastr.warning('Grupa se ne može obrisati jer se koristi.');
                }
            );
        };

        $scope.openDialog = function (group) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: true,
                backdropClick: false,
                templateUrl: 'pages/settings/dance-groups/dance-group-dialog/dance-group-dialog.html',
                controller: 'DanceGroupDialogController',
                resolve: {
                    group: function () {
                        return angular.copy(group);
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function (danceGroupData) {
                    if (group.id === -1) {
                        DanceGroupsService.createDanceGroup(danceGroupData).then(
                            function () {
                                $scope.danceGroupsList.reload();
                            },
                            function (error) {
                                toastr.error('Došlo je do greške prilikom unosa grupe.');
                            }
                        );
                    } else {
                        DanceGroupsService.updateDanceGroup(danceGroupData).then(
                            function () {
                                $scope.danceGroupsList.reload();
                            },
                            function (error) {
                                toastr.error('Došlo je do greške prilikom ažuriranja grupe.');
                            }
                        );
                    }
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };
    }
})();
