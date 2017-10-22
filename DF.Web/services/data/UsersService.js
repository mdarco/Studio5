(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('UsersService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/settings/users';

        var service = {
            getUsers: getUsers
        };

        return service;

        function getUsers() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }
    }
})();
