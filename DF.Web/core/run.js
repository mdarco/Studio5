(function () {
    'use strict';

    angular
        .module('DFApp')
        .run(runFn);

    runFn.$inject = ['$rootScope', '$location', 'AuthorizationService', 'editableOptions'];

    function runFn($rootScope, $location, AuthorizationService) {
        // check route permissions
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            if (nextRoute.access !== undefined) {
                //var userAccessByPermissionsAuthorisedResult = AuthorizationService.authorize(nextRoute.access.loginRequired, nextRoute.access.requiredPermissions);
                var userAccessByUserGroupsAuthorisedResult = AuthorizationService.authorizeByUserGroup(nextRoute.access.loginRequired, nextRoute.access.requiredUserGroups);

                if (userAccessByUserGroupsAuthorisedResult === 'login-required' /* || userAccessByPermissionsAuthorisedResult === 'login-required' */) {
                    event.preventDefault();
                    $rootScope.$evalAsync(function () {
                        $location.path('/login');
                    });
                }

                if (userAccessByUserGroupsAuthorisedResult === 'not-authorised' /* || userAccessByPermissionsAuthorisedResult === 'not-authorised' */) {
                    event.preventDefault();
                    $rootScope.$evalAsync(function () {
                        $location.path('/notauthorised');
                    });
                }
            }
        });
    }
})();
