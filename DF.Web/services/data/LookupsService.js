(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('LookupsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/lookups';

        var service = {
            getAgeCategories: getAgeCategories
        };

        return service;

        function getAgeCategories() {
            var url = WebApiBaseUrl + urlRoot + '/age-categories?nd=' + Date.now();
            return $http.get(url);
        }
    }
})();
