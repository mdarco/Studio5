(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MembersController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'NgTableParams', 'AuthenticationService', 'MembersService', 'LookupsService', 'toastr', 'choreos', 'danceGroups', 'danceSelections', 'events'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, NgTableParams, AuthenticationService, MembersService, LookupsService, toastr, choreos, danceGroups, danceSelections, events) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuMembers").addClass("active");

        // prevent 'Enter' to submit the form
        $('#searchForm').bind('keydown', function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });

        var currentUser = AuthenticationService.getCurrentUser();

        var isBack = false; // determines if we're back from the dossier page
        var queryString = $location.search();
        if (queryString && queryString.back) {
            isBack = queryString.back;
        }

        $scope.choreos = choreos;
        $scope.danceGroups = danceGroups;
        $scope.danceSelections = danceSelections;
        $scope.events = events;

        $scope.statuses = [
            { ID: 'all', Name: 'Svi' },
            { ID: 'active', Name: 'Aktivni' },
            { ID: 'non-active', Name: 'Neaktivni' }
        ];

        //#region Filter members

        $scope.totalRecords = 0;
        $scope.initialDocListLoad = true;
        $scope.showGrid = false;
        $scope.applyClicked = false;
        $scope.filter = {};

        $scope.membersTableParams = new NgTableParams(
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

                    resolveStatusFilter();

                    MembersService.setSearchFilter(angular.copy($scope.filter));

                    return MembersService.getFiltered_v2($scope.filter).then(
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

            if ($scope.filter.DanceGroups && $scope.filter.DanceGroups.length > 0) {
                $scope.filter.DanceGroupID_List = $scope.filter.DanceGroups.map(g => g.ID);
            }

            $scope.applyClicked = true;
            $scope.membersTableParams.reload();
        };

        $scope.clearFilter = function () {
            $scope.filter = {};
            $scope.showGrid = false;
            //$scope.newSearch = true;
            $scope.totalRecords = 0;
            $scope.membersTableParams.data = {};
        };

        function resolveStatusFilter() {
            if (!$scope.filter.Status) {
                $scope.filter.ExcludeNonActive = false;
                $scope.filter.ExcludeActive = false;
                return;
            }

            switch ($scope.filter.Status.toLowerCase()) {
                case '':
                case 'all':
                    $scope.filter.ExcludeNonActive = false;
                    $scope.filter.ExcludeActive = false;
                    break;

                case 'active':
                    $scope.filter.ExcludeNonActive = true;
                    $scope.filter.ExcludeActive = false;
                    break;

                case 'non-active':
                    $scope.filter.ExcludeNonActive = false;
                    $scope.filter.ExcludeActive = true;
                    break;

                default:
                    $scope.filter.ExcludeNonActive = false;
                    break;
            }
        }

        $scope.filterDanceGroupsForAutocomplete = function (query) {
            return $scope.danceGroups.filter(g => {
                if (g.Name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    return g;
                }
            });
        };

        //#endregion

        if (isBack) {
            if (MembersService.getSearchFilter()) {
                $scope.filter = MembersService.getSearchFilter();
                $scope.applyFilter();
            }
        } else {
            if (!_.includes(currentUser.UserGroups, 'ADMIN') && !_.includes(currentUser.UserGroups, 'PREGLED PODATAKA')) {
                if ($scope.danceGroups && $scope.danceGroups.length > 0) {
                    $scope.filter = {
                        DanceGroups: $scope.danceGroups
                    };
                }
            }
        }

        //#region Add member

        $scope.addMember = function () {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/members/member-dialog/member-dialog.html',
                controller: 'MemberDialogController',
                resolve: {
                    ageCategories: function (LookupsService) {
                        return LookupsService.getAgeCategories().then(
                            function (result) {
                                return result.data;
                            }
                        );
                    },
                    danceGroups: (DanceGroupsService) => {
                        var userDanceGroups = currentUser.UserDanceGroups.map((g) => {
                            return g.DanceGroupName.toLowerCase();
                        });

                        return DanceGroupsService.getLookup().then(
                            function (result) {
                                if (!_.includes(currentUser.UserGroups, 'ADMIN') && !_.includes(currentUser.UserGroups, 'PREGLED PODATAKA')) {
                                    return result.data.filter((d) => {
                                        return _.includes(userDanceGroups, d.Name.toLowerCase());
                                    });
                                } else {
                                    return result.data;
                                }
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

        //#region Member dossier

        $scope.openMemberDossier = function (member) {
            MembersService.setSearchFilter(angular.copy($scope.filter));
            $location.path('/member-file/' + member.MemberID);
        };

        //#endregion
    }
})();
