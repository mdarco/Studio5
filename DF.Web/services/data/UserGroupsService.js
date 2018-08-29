(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('UserGroupsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/settings/user-groups';

        var service = {
            getUserGroups: getUserGroups
        };

        return service;

        function getUserGroups() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }
    }
})();
