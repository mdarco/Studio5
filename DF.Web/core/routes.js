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
                    templateUrl: 'pages/login/login.html'
                }
            )

            .when('/home',
                {
                    controller: 'HomeController',
                    templateUrl: 'pages/home/home.html',
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/members',
                {
                    controller: 'MembersController',
                    templateUrl: 'pages/members/members.html',
                    resolve: {
                        choreos: function (ChoreosService) {
                            return ChoreosService.getLookup().then(
                                function (result) {
                                    return result.data;
                                }
                            );
                        },
                        danceGroups: function (DanceGroupsService) {
                            return DanceGroupsService.getLookup().then(
                                function (result) {
                                    return result.data;
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
                    templateUrl: 'pages/members/member-file/member-file.html',
                    resolve: {
                        member: function ($route, MembersService) {
                            var id = $route.current.params.id;
                            return MembersService.get(id).then(
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

            .when('/trainings',
                {
                    controller: 'TrainingsController',
                    templateUrl: 'pages/trainings/trainings.html',
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/choreos',
                {
                    controller: 'ChoreosController',
                    templateUrl: 'pages/choreographies/choreos.html',
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/events',
                {
                    controller: 'EventsController',
                    templateUrl: 'pages/events/events.html',
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/outfits',
                {
                    controller: 'OutfitsController',
                    templateUrl: 'pages/outfits/outfits.html',
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/costumes',
                {
                    controller: 'CostumesController',
                    templateUrl: 'pages/costumes/costumes.html',
                    access: {
                        loginRequired: true
                    }
                }
            )

            .when('/payments',
			    {
			        controller: 'PaymentsController',
			        templateUrl: 'pages/settings/payments/payments.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/search-docs',
			    {
			        controller: 'SearchDocsController',
			        templateUrl: 'pages/settings/search-docs/search-docs.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/search-member-images',
			    {
			        controller: 'SearchMemberImagesController',
			        templateUrl: 'pages/settings/search-member-images/search-member-images.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/periods',
			    {
			        controller: 'PeriodsController',
			        templateUrl: 'pages/settings/periods/periods.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/lookup-age-categories',
			    {
			        controller: 'LookupAgeCategoriesController',
			        templateUrl: 'pages/settings/lookup-age-categories/lookup-age-categories.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/lookup-dance-styles',
			    {
			        controller: 'LookupDanceStylesController',
			        templateUrl: 'pages/settings/lookup-dance-styles/lookup-dance-styles.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/lookup-disciplines',
			    {
			        controller: 'LookupDisciplinesController',
			        templateUrl: 'pages/settings/lookup-disciplines/lookup-disciplines.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/lookup-event-types',
			    {
			        controller: 'LookupEventTypesController',
			        templateUrl: 'pages/settings/lookup-event-types/lookup-event-types.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/locations',
			    {
			        controller: 'LocationsController',
			        templateUrl: 'pages/settings/locations/locations.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/dance-groups',
			    {
			        controller: 'DanceGroupsController',
			        templateUrl: 'pages/settings/dance-groups/dance-groups.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/dance-selections',
			    {
			        controller: 'DanceSelectionsController',
			        templateUrl: 'pages/settings/dance-selections/dance-selections.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/users',
			    {
			        controller: 'UsersController',
			        templateUrl: 'pages/settings/users/users.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .when('/user-groups',
			    {
			        controller: 'UserGroupsController',
			        templateUrl: 'pages/settings/user-groups/user-groups.html',
			        access: {
			            loginRequired: true,
			            requiredPermissions: ['Admin']
			        }
			    }
		    )

            .otherwise({ redirectTo: '/login' });
    }
})();
