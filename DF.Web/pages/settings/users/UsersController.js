(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('UsersController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'NgTableParams', 'AuthenticationService', 'UsersService', 'LookupsService'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, NgTableParams, AuthenticationService, UsersService, LookupsService) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuUsers").addClass("active");

        // prevent 'Enter' to submit the form
        //$('#searchForm').bind('keydown', function (e) {
        //    if (e.keyCode === 13) {
        //        e.preventDefault();
        //    }
        //});

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.users = [];
        $scope.filter = {};

        //#region Filter users

        $scope.totalRecords = 0;
        $scope.initialDocListLoad = true;
        $scope.showGrid = false;

        $scope.usersTableParams = new NgTableParams(
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

                    UsersService.setSearchFilter(angular.copy($scope.filter));

                    return UsersService.getFiltered($scope.filter).then(
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
            $scope.usersTableParams.data = {};
        };

        //#endregion

        //#region Add user

        $scope.addUser = function () {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/users/user-dialog/user-dialog.html',
                controller: 'UserDialogController',
                resolve: {}
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

        //#region Action buttons

        

        //#endregion
    }
})();
