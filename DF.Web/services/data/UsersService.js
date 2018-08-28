(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('UsersService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/settings/users';

        var service = {
            getUsers: getUsers,

            manage: manageUser,
            delete: deleteUser
        };

        return service;

        function getUsers() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }

        function manageUser(user) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, user);
        }

        function deleteUser(userID) {
            var url = WebApiBaseUrl + urlRoot + '/' + userID;
            return $http.delete(url);
        }
    }
})();
