(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('ChoreosService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/events';

        var service = {
            getLookup: getLookupChoreos,
            getFiltered: getFilteredChoreos,
            create: createChoreo,
            edit: editChoreo
        };

        return service;

        function getLookupChoreos() {
            var url = WebApiBaseUrl + urlRoot + '/lookup?nd=' + Date.now();
            return $http.get(url);
        }

        function getFilteredChoreos(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function createChoreo(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function editChoreo(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.put(url, model);
        }
    }
})();
