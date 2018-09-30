(function () {
    'use strict';

    angular
        .module('DFApp')
        .config(routeFn);

    routeFn.$inject = ['$routeProvider'];

    function routeFn($routeProvider) {
        $routeProvider
            .when('/login',
                {
                    controller: 'LoginController',
                    templateUrl: 'pages/login/login.html?nd=' + Date.now()
                }
            )

            .when('/home',
                {
                    controller: 'HomeController',
                    templateUrl: 'pages/home/home.html?nd=' + Date.now(),
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/members',
                {
                    controller: 'MembersController',
                    templateUrl: 'pages/members/members.html?nd=' + Date.now(),
                    resolve: {
                        choreos: function (ChoreosService) {
                            return ChoreosService.getLookup().then(
                                function (result) {
                                    return result.data;
                                }
                            );
                        },
                        danceGroups: function (DanceGroupsService, AuthenticationService) {
                            var currentUser = AuthenticationService.getCurrentUser();

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
                        },
                        danceSelections: function (DanceSelectionsService) {
                            return DanceSelectionsService.getLookup().then(
                                function (result) {
                                    return result.data;
                                }
                            );
                        },
                        events: function (EventsService) {
                            return EventsService.getLookup().then(
                                function (result) {
                                    return result.data;
                                }
                            );
                        }
                    },
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/member-file/:id',
                {
                    controller: 'MemberFileController',
                    templateUrl: 'pages/members/member-file/member-file.html?nd=' + Date.now(),
                    resolve: {
                        member: function ($route, MembersService) {
                            var id = $route.current.params.id;
                            return MembersService.get(id).then(
                                function (result) {
                                    return MembersService.getDanceGroups(result.data.MemberID).then((memberDanceGroups) => {
                                        result.data.DanceGroups = memberDanceGroups.data;
                                        return result.data;
                                    });
                                }
                            );
                        }
                    },
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/trainings',
                {
                    controller: 'TrainingsController',
                    templateUrl: 'pages/trainings/trainings.html?nd=' + Date.now(),
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/choreos',
                {
                    controller: 'ChoreosController',
                    templateUrl: 'pages/choreographies/choreos.html?nd=' + Date.now(),
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/events',
                {
                    controller: 'EventsController',
                    templateUrl: 'pages/events/events.html?nd=' + Date.now(),
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/outfits',
                {
                    controller: 'OutfitsController',
                    templateUrl: 'pages/outfits/outfits.html?nd=' + Date.now(),
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/costumes',
                {
                    controller: 'CostumesController',
                    templateUrl: 'pages/costumes/costumes.html?nd=' + Date.now(),
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/payments',
			    {
			        controller: 'PaymentsController',
			        templateUrl: 'pages/settings/payments/payments.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/search-docs',
			    {
			        controller: 'SearchDocsController',
			        templateUrl: 'pages/settings/search-docs/search-docs.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/search-member-images',
			    {
			        controller: 'SearchMemberImagesController',
			        templateUrl: 'pages/settings/search-member-images/search-member-images.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/periods',
			    {
			        controller: 'PeriodsController',
			        templateUrl: 'pages/settings/periods/periods.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/lookup-age-categories',
			    {
			        controller: 'LookupAgeCategoriesController',
			        templateUrl: 'pages/settings/lookup-age-categories/lookup-age-categories.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/lookup-dance-styles',
			    {
			        controller: 'LookupDanceStylesController',
			        templateUrl: 'pages/settings/lookup-dance-styles/lookup-dance-styles.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/lookup-disciplines',
			    {
			        controller: 'LookupDisciplinesController',
			        templateUrl: 'pages/settings/lookup-disciplines/lookup-disciplines.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/lookup-event-types',
			    {
			        controller: 'LookupEventTypesController',
			        templateUrl: 'pages/settings/lookup-event-types/lookup-event-types.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/locations',
			    {
			        controller: 'LocationsController',
			        templateUrl: 'pages/settings/locations/locations.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/dance-groups',
			    {
			        controller: 'DanceGroupsController',
			        templateUrl: 'pages/settings/dance-groups/dance-groups.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/dance-selections',
			    {
			        controller: 'DanceSelectionsController',
			        templateUrl: 'pages/settings/dance-selections/dance-selections.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/users',
			    {
			        controller: 'UsersController',
			        templateUrl: 'pages/settings/users/users.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
		    )

            .when('/user-groups',
			    {
			        controller: 'UserGroupsController',
			        templateUrl: 'pages/settings/user-groups/user-groups.html?nd=' + Date.now(),
			        access: {
			            loginRequired: true,
                        requiredPermissions: ['ADMIN']
			        }
			    }
            )

            .when('/report-unpaid-installments-by-period',
                {
                    controller: 'Report_UnpaidInstallmentsByPeriod_Controller',
                    templateUrl: 'pages/reports/unpaid-installments-by-period/unpaid-installments-by-period.html?nd=' + Date.now(),
                    resolve: {
                        danceGroups: function (DanceGroupsService, AuthenticationService) {
                            var currentUser = AuthenticationService.getCurrentUser();

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
                    },
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/report-monthly-payments',
                {
                    controller: 'Report_MonthlyPayments_Controller',
                    templateUrl: 'pages/reports/monthly-payments/monthly-payments.html?nd=' + Date.now(),
                    resolve: {
                        danceGroups: function (DanceGroupsService, AuthenticationService) {
                            var currentUser = AuthenticationService.getCurrentUser();

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
                    },
                    access: {
                        loginRequired: true
                    }
                }
            )

            .otherwise({ redirectTo: '/login' });
    }
})();
