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
            getDanceGroups: getFilteredDanceGroups,
            getDanceGroup: getDanceGroup,
            createDanceGroup: createDanceGroup,
            editDanceGroup: editDanceGroup,
            deleteDanceGroup: deleteDanceGroup
        };

        return service;

        function getLookupDanceGroups() {
            var url = WebApiBaseUrl + urlRoot + '/lookup?nd=' + Date.now();
            return $http.get(url);
        }

        function getFilteredDanceGroups(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function getDanceGroup(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function createDanceGroup(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function editDanceGroup(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id;
            return $http.put(url, model);
        }

        function deleteDanceGroup(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id;
            return $http.delete(url);
        }
    }
})();
