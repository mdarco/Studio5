(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('DanceGroupsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/dance-groups';

        var service = {
            getLookup: getLookupDanceGroups,
            getFiltered: getFilteredDanceGroups,
            create: createDanceGroup,
            edit: editDanceGroup
        };

        return service;

        function getLookupDanceGroups() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }

        function getFilteredDanceGroups(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function createDanceGroup(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function editDanceGroup(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.put(url, model);
        }
    }
})();
