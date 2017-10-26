(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('MembersService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/members';

        var service = {
            getFiltered: getFilteredMembers,
            get: getMember,
            create: createMember,
            edit: editMember
        };

        return service;

        function getFilteredMembers(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function getMember(id) {
            var url = WebApiBaseUrl + urlRoot + '?id=' + id + '&nd=' + Date.now();
            return $http.get(url);
        }

        function createMember(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function editMember(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.put(url, model);
        }
    }
})();
