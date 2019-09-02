(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('LookupsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/lookups';

        var service = {
            getAgeCategories: getAgeCategories,
            getLocations: getLocations,
            getUsers: getUsers
        };

        return service;

        function getAgeCategories() {
            var url = WebApiBaseUrl + urlRoot + '/age-categories?nd=' + Date.now();
            return $http.get(url);
        }

        function getLocations() {
            var url = WebApiBaseUrl + urlRoot + '/locations?nd=' + Date.now();
            return $http.get(url);
        }

        function getUsers() {
            var url = WebApiBaseUrl + urlRoot + '/users?nd=' + Date.now();
            return $http.get(url);
        }
    }
})();
