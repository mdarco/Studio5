(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('DanceGroupsController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$http', '$q', '$uibModal', 'WebApiBaseUrl', 'NgTableParams', 'DanceGroupsService', 'AuthenticationService', 'toastr'];

    function ctrlFn($rootScope, $scope, $http, $q, $uibModal, WebApiBaseUrl, NgTableParams, DanceGroupsService, AuthenticationService, toastr) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuDanceGroups").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.webApiBaseUrl = WebApiBaseUrl;
        $scope.filter = {};

        $scope.totalRecords = 0;
        $scope.initialDocListLoad = true;
        $scope.showTable = false;

        $scope.danceGroupsList = new NgTableParams(
            {
                page: 1,
                count: 10
            },
            {
                total: 0,
                getData: function (params) {
                    if ($scope.initialDocListLoad) {
                        $scope.initialDocListLoad = false;
                        return [];
                    }

                    $scope.filter = $scope.filter || {};

                    $scope.filter.PageNo = params.page();
                    $scope.filter.RecordsPerPage = params.count();

                    return DanceGroupsService.getDanceGroups($scope.filter).then(
                        function (result) {
                            if (!result || !result.data || !result.data.Data) {
                                $scope.showTable = false;
                                return [];
                            }

                            if (result.data.Data.length > 0) {
                                $scope.showTable = true;
                            } else {
                                $scope.showTable = false;
                            }

                            params.total(result.Total);
                            $scope.totalRecords = result.data.Total;

                            return result.data.Data;
                        },
                        function (error) {
                            toastr.error('Došlo je do greške prilikom učitavanja spiska grupa.');
                            $scope.showTable = false;
                        }
                    );
                }
            }
        );

        // filter
        $scope.applyFilter = function () {
            $scope.danceGroupsList.reload();
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

        //#region Dialog

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
                    },
                    ageCategories: function (LookupsService) {
                        return LookupsService.getAgeCategories().then(
                            function (resultAgeCategories) {
                                if (resultAgeCategories && resultAgeCategories.data) {
                                    return resultAgeCategories.data;
                                } else {
                                    return null;
                                }
                            }
                        );
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
                        DanceGroupsService.editDanceGroup(group.id, danceGroupData).then(
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

        //#endregion
    }
})();
