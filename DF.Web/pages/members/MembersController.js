(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MembersController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'NgTableParams', 'AuthenticationService', 'MembersService', 'toastr', 'choreos', 'danceGroups', 'danceSelections', 'events'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, NgTableParams, AuthenticationService, MembersService, toastr, choreos, danceGroups, danceSelections, events) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuMembers").addClass("active");

        // prevent 'Enter' to submit the form
        $('#searchForm').bind('keydown', function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
            }
        });

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.filter = {};

        $scope.choreos = choreos;
        $scope.danceGroups = danceGroups;
        $scope.danceSelections = danceSelections;
        $scope.events = events;

        //#region Filter members

        $scope.totalRecords = 0;
        $scope.initialDocListLoad = true;
        $scope.showGrid = false;

        $scope.membersTableParams = new NgTableParams(
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

                    //if ($scope.newSearch === true) {
                    //    params.page(1);
                    //}

                    $scope.filter.PageNo = params.page();
                    $scope.filter.RecordsPerPage = params.count();

                    return MembersService.getFiltered($scope.filter).then(
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
            //$scope.newSearch = true;
            $scope.membersTableParams.reload();
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.showGrid = false;
            //$scope.newSearch = true;
            $scope.totalRecords = 0;
            $scope.membersTableParams.data = {};
        };

        //#endregion
    }
})();
