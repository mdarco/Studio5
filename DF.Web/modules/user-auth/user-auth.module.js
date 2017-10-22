
angular.module('UserAuth', ['base64']);

/*** CONSTANTS ***/

angular.module('UserAuth').constant('WebApiBaseUrl', '/DFApi');

/*** CONSTANTS ***/


/*** SERVICES ***/

// AuthenticationService - deals with user login, logout and getting user permissions
// Authenticated user is stored in session storage (or in the cookie if the session storage is not accessible)
angular.module('UserAuth').factory('AuthenticationService', authenticationService);

authenticationService.$inject = ['$q', '$http', '$base64', 'WebApiBaseUrl'];

function authenticationService($q, $http, $base64, WebApiBaseUrl) {
	var currentUser = null;

	var service = {
		login: login,
		logout: logout,
		getCurrentUser: getCurrentUser,
		isUserAuthenticated: isUserAuthenticated
	};

	return service;

	function login(username, password) {
	    var userLoginModel = {
			Username: username,
			Password: password
		};

		var deferred = $q.defer();

		$http.post(WebApiBaseUrl + '/api/login', userLoginModel).then(
			function(userData) {
				var user = userData.data;

				if (user.IsAuthenticated) {
					currentUser = user;

					// put user info in session storage
					//localStorageService.set('TIMDMS_USER', currentUser);

					deferred.resolve(currentUser);
				}
				else {
					deferred.reject('Neispravno korisničko ime ili lozinka!');
				}

			},
			function(errorMsg) {
				deferred.reject('Neispravno korisničko ime ili lozinka!');
			}
		);

		return deferred.promise;
	}

	function logout() {
		currentUser = null;

		// delete user from session storage
		//localStorageService.remove('TIMDMS_USER');
	}

	function getCurrentUser() {
		return currentUser;
	}

	function isUserAuthenticated() {
		return (currentUser !== null && currentUser.IsAuthenticated === true);
	}
}

// AuthorizationService - responsible for working out if the user has the correct permissions
// based on the defined access property of the route
angular.module('UserAuth').factory('AuthorizationService', authorizationService);

authorizationService.$inject = ['AuthenticationService'];

function authorizationService(AuthenticationService) {

	var service = {
	    authorize: authorize,
	    authorizeByUserGroup: authorizeByUserGroup
	};

	return service;

	function authorize(loginRequired, requiredPermissions) {
		var result = 'authorised';

		var isUserAuthenticated = AuthenticationService.isUserAuthenticated();
		var user = AuthenticationService.getCurrentUser();
		var userPermissions = (user !== null) ? user.EffectivePermissions : [];
		var userGroups = (user !== null) ? user.UserGroups : [];

	    // 'Admin' user group => can access everything
		if (_.includes(userGroups, 'Admin')) {
		    return 'authorised';
		} else {
		    // 'Admin' permission => can access everything
		    if (_.includes(userPermissions, 'Admin')) {
		        return 'authorised';
		    }
		}

		if (loginRequired && !isUserAuthenticated) {
			result = 'login-required';
		}
		else if (loginRequired && isUserAuthenticated && (!requiredPermissions || requiredPermissions.length === 0)) {
			result = 'authorised';
		}
		else if (requiredPermissions) {
			// check if user has AT LEAST ONE required permission
			var hasPermission = false;

			angular.forEach(requiredPermissions, function(requiredPermission) {
				if (!hasPermission) {
					if (_.includes(userPermissions, requiredPermission)) {
						hasPermission = true;
					}
				}
			});

			result = (hasPermission) ? 'authorised' : 'not-authorised';
		}

		return result;
	}

	function authorizeByUserGroup(loginRequired, requiredUserGroups) {
	    var result = 'authorised';

	    var isUserAuthenticated = AuthenticationService.isUserAuthenticated();
	    var user = AuthenticationService.getCurrentUser();
	    var userGroups = (user !== null) ? user.UserGroups : [];

	    // 'Admin' user group can access everything
	    if (_.includes(userGroups, 'Admin')) {
	        return 'authorised';
	    }

	    if (loginRequired && !isUserAuthenticated) {
	        result = 'login-required';
	    }
	    else if (loginRequired && isUserAuthenticated && (!requiredUserGroups || requiredUserGroups.length === 0)) {
	        result = 'authorised';
	    }
	    else if (requiredUserGroups) {
	        // check if user has AT LEAST ONE required user group
	        var hasUserGroup = false;

	        angular.forEach(requiredUserGroups, function (requiredUserGroup) {
	            if (!hasUserGroup) {
	                if (_.includes(userGroups, requiredUserGroup)) {
	                    hasUserGroup = true;
	                }
	            }
	        });

	        result = (hasUserGroup) ? 'authorised' : 'not-authorised';
	    }

	    return result;
	}
}

/*** SERVICES ***/


/*** DIRECTIVES ***/

// 'authenticatedUser' directive allows that only authenticated users
// can see the target element
angular.module('UserAuth').directive('authenticatedUser', authUserDirective);

authUserDirective.$inject = ['AuthenticationService'];

function authUserDirective(AuthenticationService) {

	return {
		restrict: 'A',

		link: function(scope, element, attrs) {
			var showElement = function() {
				element.removeClass('hidden');
			};

			var hideElement = function() {
				element.addClass('hidden');
			};

			var checkAuth = function() {
				if (AuthenticationService.isUserAuthenticated()) {
					showElement();
				}
				else {
					hideElement();
				}
			};

			checkAuth();

			scope.$on('user-auth-changed', function (event, data) {
				checkAuth();
			});
		}
	};

}


// 'permissions' directive takes a list of permissions for which the resource
// is allowed to be shown
angular.module('UserAuth').directive('permissions', permissionsDirective);

permissionsDirective.$inject = ['AuthorizationService'];

function permissionsDirective(AuthorizationService) {
	return {

		restrict: 'A',

		link: function(scope, element, attrs) {
			var permissionList = attrs.permissions.split(',');

			var showElement = function() {
				element.removeClass('hidden');
			};

			var hideElement = function() {
				element.addClass('hidden');
			};

			var determineVisibility = function() {
				var result = AuthorizationService.authorize(true, permissionList);
				if (result === 'authorised') {
					showElement();
				}
				else {
					hideElement();
				}
			};

			if (permissionList.length > 0) {
				determineVisibility();
			}

			scope.$on('user-auth-changed', function (event, data) {
				determineVisibility();
			});
		}
	};
}

// 'permissions-disable-element' directive takes a list of permissions for which the resource
// is allowed to be enabled
angular.module('UserAuth').directive('permissionsDisableElement', permissionsDisableElementDirective);

permissionsDisableElementDirective.$inject = ['AuthorizationService'];

function permissionsDisableElementDirective(AuthorizationService) {
    return {

        restrict: 'A',

        link: function (scope, element, attrs) {
            var permissionList = attrs.permissionsDisableElement.split(',');

            var enableElement = function () {
                element.prop('disabled', false);
            };

            var disableElement = function () {
                element.prop('disabled', true);
            };

            var determineVisibility = function () {
                var result = AuthorizationService.authorize(true, permissionList);
                if (result === 'authorised') {
                    enableElement();
                }
                else {
                    disableElement();
                }
            };

            if (permissionList.length > 0) {
                determineVisibility();
            }

            scope.$on('user-auth-changed', function (event, data) {
                determineVisibility();
            });
        }
    };
}


// 'user-groups' directive takes a list of user groups for which the resource
// is allowed to be shown
angular.module('UserAuth').directive('userGroups', userGroupsDirective);

userGroupsDirective.$inject = ['AuthorizationService'];

function userGroupsDirective(AuthorizationService) {
    return {

        restrict: 'A',

        link: function (scope, element, attrs) {
            var userGroupList = attrs.userGroups.split(',');

            var showElement = function () {
                element.removeClass('hidden');
            };

            var hideElement = function () {
                element.addClass('hidden');
            };

            var determineVisibility = function () {
                var result = AuthorizationService.authorizeByUserGroup(true, userGroupList);
                if (result === 'authorised') {
                    showElement();
                }
                else {
                    hideElement();
                }
            };

            if (userGroupList.length > 0) {
                determineVisibility();
            }

            scope.$on('user-auth-changed', function (event, data) {
                determineVisibility();
            });
        }

    };
}

/*** DIRECTIVES ***/
