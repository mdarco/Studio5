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

            //.when('/file-card',
            //    {
            //        controller: 'FileCardController',
            //        templateUrl: 'pages/file-card/file-card.html',
            //        access: {
            //            loginRequired: true
            //        }
            //    }
            //)

            //.when('/file-types',
			//    {
			//        controller: 'FileTypesController',
			//        templateUrl: 'pages/settings/file-types/file-types.html',
			//        access: {
			//            loginRequired: true,
			//            requiredPermissions: ['Admin']
			//        }
			//    }
		    //)

            //.when('/doc-types',
			//    {
			//        controller: 'DocTypesController',
			//        templateUrl: 'pages/settings/doc-types/doc-types.html',
			//        access: {
			//            loginRequired: true,
			//            requiredPermissions: ['Admin']
			//        }
			//    }
		    //)

            //.when('/orgunits',
			//    {
			//        controller: 'OrgUnitsController',
			//        templateUrl: 'pages/settings/org-units/org-units.html',
			//        access: {
			//            loginRequired: true,
			//            requiredPermissions: ['Admin']
			//        }
			//    }
		    //)

            //.when('/taxes',
			//    {
			//        controller: 'TaxesController',
			//        templateUrl: 'pages/settings/taxes/taxes.html',
			//        access: {
			//            loginRequired: true,
			//            requiredPermissions: ['Admin']
			//        }
			//    }
		    //)

            //.when('/workflows',
			//    {
			//        controller: 'WorkflowsController',
			//        templateUrl: 'pages/workflows/workflows.html',
			//        access: {
			//            loginRequired: true
			//        }
			//    }
		    //)

            //.when('/req-docs',
			//    {
			//        controller: 'RequiredDocsController',
			//        templateUrl: 'pages/settings/required-docs/required-docs.html',
			//        access: {
			//            loginRequired: true,
			//            requiredPermissions: ['Admin']
			//        }
			//    }
		    //)

            //.when('/file-search',
            //    {
            //        controller: 'FileSearchController',
            //        templateUrl: 'pages/file-search/file-search.html',
            //        access: {
            //            loginRequired: true
            //        }
            //    }
            //)

            //.when('/users',
            //    {
            //        controller: 'UsersController',
            //        templateUrl: 'pages/settings/users/users.html',
            //        access: {
            //            loginRequired: true,
            //            requiredUserGroups: ['Admin']
            //        }
            //    }
            //)

            //.when('/usergroups',
            //    {
            //        controller: 'UserGroupsController',
            //        templateUrl: 'pages/settings/user-groups/user-groups.html',
            //        access: {
            //            loginRequired: true,
            //            requiredUserGroups: ['Admin']
            //        }
            //    }
            //)

            //.when('/notauthorised',
            //    {
            //        controller: 'NotAuthorisedController',
            //        templateUrl: 'pages/not-authorised/not-authorised.html'
            //    }
            //)

            .otherwise({ redirectTo: '/login' });
    }
})();
