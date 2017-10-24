(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('DanceSelectionsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/dance-selections';

        var service = {
            getLookup: getLookupDanceSelections,
            getFiltered: getFilteredDanceSelections,
            create: createDanceSelection,
            edit: editDanceSelection
        };

        return service;

        function getLookupDanceSelections() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }

        function getFilteredDanceSelections(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function createDanceSelection(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function editDanceSelection(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.put(url, model);
        }
    }
})();
