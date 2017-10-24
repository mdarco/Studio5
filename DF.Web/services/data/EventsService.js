(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('EventsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/events';

        var service = {
            getLookup: getLookupEvents,
            getFiltered: getFilteredEvents,
            create: createEvent,
            edit: editEvent
        };

        return service;

        function getLookupEvents() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }

        function getFilteredEvents(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function createEvent(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function editEvent(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.put(url, model);
        }
    }
})();
