(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('UsersController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'NgTableParams', 'AuthenticationService', 'UsersService', 'toastr'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, NgTableParams, AuthenticationService, UsersService, toastr) {
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

        //$scope.users = [];
        //$scope.filter = {};

        //#region User list

        $scope.totalRecords = 0;
        //$scope.initialDocListLoad = true;
        $scope.showGrid = false;

        $scope.usersTableParams = new NgTableParams(
            {
                page: 1,
                count: 10000
            },
            {
                total: 0,
                getData: function (params) {
                    //if ($scope.initialDocListLoad) {
                    //    $scope.initialDocListLoad = false;
                    //    return [];
                    //}

                    $scope.filter = $scope.filter || {};

                    $scope.filter.PageNo = params.page();
                    $scope.filter.RecordsPerPage = params.count();

                    //UsersService.setSearchFilter(angular.copy($scope.filter));

                    //return UsersService.getFiltered($scope.filter).then(
                    return UsersService.getUsers().then(
                        function (result) {
                            if (!result || !result.data) {
                                $scope.showGrid = false;
                                return [];
                            }

                            if (result.data.length > 0) {
                                $scope.showGrid = true;
                            } else {
                                $scope.showGrid = false;
                            }

                            params.total(result.data.length);
                            $scope.totalRecords = result.data.length;

                            createUserGroupsArrays(result.data);

                            return result.data;
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
            $scope.usersTableParams.reload();
        };

        $scope.clearFilter = function () {
            //$scope.filter = {};
            $scope.showGrid = false;
            //$scope.newSearch = true;
            $scope.totalRecords = 0;
            $scope.usersTableParams.data = {};
        };

        function createUserGroupsArrays(users) {
            users.forEach((user) => {
                user.DisplayUserGroups = _.join(_.map(user.UserGroups, 'UserGroupName'), ', ');
            });
        }

        //#endregion

        //#region Add user

        $scope.addUser = function () {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/users/user-dialog/user-dialog.html',
                controller: 'UserDialogController',
                resolve: {
                    user: function () {
                        return null;
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

        //#region Action buttons

        $scope.editUser = function (user) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/users/user-dialog/user-dialog.html',
                controller: 'UserDialogController',
                resolve: {
                    user: function () {
                        return UsersService.getUser(user.UserID).then(response => {
                            return response.data;
                        });
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

        $scope.deleteUser = function (userID) {
            alert('Work in progress..');
        };

        $scope.changeActive = function (user) {
            bootbox.confirm({
                message: (!user.IsActive ? 'Aktivirati' : 'Deaktivirati') + ' korisnika?',
                buttons: {
                    confirm: {
                        label: 'Da',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Ne',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        // update 'IsActive'
                        user.IsActive = !user.IsActive;

                        UsersService.manage(user).then(
                            () => {
                                
                            },
                            (error) => {
                                toastr.error('Došlo je do greške na serveru prilikom ažuriranja korisnika.');
                            }
                        );
                    }
                }
            });
        };

        $scope.manageUserGroups = function (user) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/users/user-groups-dialog/user-groups-dialog.html',
                controller: 'UserGroupsDialogController',
                resolve: {
                    user: () => {
                        return _.cloneDeep(user);
                    },
                    allGroups: (UserGroupsService) => {
                        return UserGroupsService.getUserGroups().then(
                            (response) => {
                                return response.data;
                            }
                        );
                    },
                    userGroups: () => {
                        return UsersService.getUserGroups(user).then(
                            (response) => {
                                return response.data;
                            }
                        );
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

        $scope.manageDanceGroups = function (user) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/users/dance-groups-dialog/dance-groups-dialog.html',
                controller: 'DanceGroupsDialogController',
                resolve: {
                    user: () => {
                        return _.cloneDeep(user);
                    },
                    allDanceGroups: (DanceGroupsService) => {
                        return DanceGroupsService.getAllDanceGroups().then(
                            (response) => {
                                response.data.forEach((item) => {
                                    delete item.HasPaymentAbility;
                                });
                                return response.data;
                            }
                        );
                    },
                    userDanceGroups: () => {
                        return UsersService.getUserDanceGroups(user).then(
                            (response) => {
                                response.data.forEach((item) => {
                                    delete item.HasPaymentAbility;
                                });
                                return response.data;
                            }
                        );
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

        $scope.managePaymentPermissions = function (user) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/settings/users/payment-permissions-dialog/payment-permissions-dialog.html',
                controller: 'PaymentPermissionsDialogController',
                resolve: {
                    user: () => {
                        return _.cloneDeep(user);
                    },
                    userDanceGroups: () => {
                        return UsersService.getUserDanceGroups(user).then(
                            (response) => {
                                return response.data;
                            }
                        );
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
    }
})();
